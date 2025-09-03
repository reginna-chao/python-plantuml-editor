# app.py - 修正中文編碼問題版本
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import subprocess
import os
import tempfile
import uuid
import platform

app = Flask(__name__)
CORS(app)

PLANTUML_JAR = "plantuml.jar"

def get_temp_dir():
    if platform.system() == "Windows":
        temp_dir = os.path.join(os.getcwd(), "tmp")
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        return temp_dir
    else:
        return "/tmp"

@app.route('/render', methods=['POST'])
def render_diagram():
    input_file = None
    output_file = None
    
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({"error": "Missing 'code' in request"}), 400
        
        plantuml_code = data['code']
        output_format = data.get('format', 'svg').lower()
        
        temp_dir = get_temp_dir()
        temp_id = str(uuid.uuid4())
        input_file = os.path.join(temp_dir, f"plantuml_{temp_id}.puml")
        
        print(f"Writing to: {input_file}")
        
        # 使用 UTF-8 BOM 寫入檔案，確保中文字符正確處理
        with open(input_file, 'w', encoding='utf-8-sig') as f:
            f.write(plantuml_code)
        
        jar_path = os.path.abspath(PLANTUML_JAR)
        input_path = os.path.abspath(input_file)
        
        # 直接執行轉譯，並設定正確的編碼
        format_flag = '-tsvg' if output_format == 'svg' else '-tpng'
        
        # 添加編碼參數
        cmd = ['java', '-Dfile.encoding=UTF-8', '-jar', jar_path, format_flag, '-charset', 'UTF-8', input_path]
        
        print(f"Executing command: {' '.join(cmd)}")
        
        # 設定環境變數確保正確的編碼處理
        env = os.environ.copy()
        env['JAVA_TOOL_OPTIONS'] = '-Dfile.encoding=UTF-8'
        
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=os.getcwd(), env=env)
        
        print(f"Return code: {result.returncode}")
        print(f"Stdout: {result.stdout}")
        print(f"Stderr: {result.stderr}")
        
        # PlantUML 可能返回非零代碼但仍成功生成檔案
        base_name = os.path.splitext(input_file)[0]
        output_file = f"{base_name}.{output_format}"
        
        print(f"Looking for output file: {output_file}")
        print(f"Output file exists: {os.path.exists(output_file)}")
        
        if not os.path.exists(output_file):
            # 檢查是否有其他格式的輸出檔案
            possible_outputs = [
                f"{base_name}.svg",
                f"{base_name}.png"
            ]
            
            for possible_output in possible_outputs:
                if os.path.exists(possible_output):
                    output_file = possible_output
                    print(f"Found alternative output: {output_file}")
                    break
            else:
                # 列出臨時目錄的所有檔案
                temp_files = os.listdir(temp_dir)
                print(f"Files in temp directory: {temp_files}")
                
                return jsonify({
                    "error": f"無法生成輸出檔案",
                    "expected": output_file,
                    "temp_files": temp_files,
                    "stdout": result.stdout,
                    "stderr": result.stderr
                }), 500
        
        mimetype = f'image/svg+xml' if output_file.endswith('.svg') else f'image/png'
        return send_file(output_file, mimetype=mimetype)
        
    except Exception as e:
        print(f"Exception: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"伺服器錯誤: {str(e)}"}), 500
    finally:
        for file in [input_file, output_file]:
            if file and os.path.exists(file):
                try:
                    os.remove(file)
                    print(f"Cleaned up: {file}")
                except Exception as e:
                    print(f"清理檔案失敗 {file}: {e}")

@app.route('/test-simple', methods=['POST'])
def test_simple():
    """測試簡單的英文 PlantUML"""
    try:
        simple_code = """@startuml
A -> B: Hello
B -> A: Hi
@enduml"""
        
        temp_dir = get_temp_dir()
        temp_id = str(uuid.uuid4())
        input_file = os.path.join(temp_dir, f"test_{temp_id}.puml")
        
        with open(input_file, 'w', encoding='utf-8') as f:
            f.write(simple_code)
        
        jar_path = os.path.abspath(PLANTUML_JAR)
        cmd = ['java', '-jar', jar_path, '-tsvg', input_file]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        output_file = f"{os.path.splitext(input_file)[0]}.svg"
        
        success = os.path.exists(output_file)
        
        # 清理
        if os.path.exists(input_file):
            os.remove(input_file)
        if os.path.exists(output_file):
            os.remove(output_file)
        
        return jsonify({
            "success": success,
            "return_code": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test_server():
    try:
        java_result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        java_available = java_result.returncode == 0
        
        jar_exists = os.path.exists(PLANTUML_JAR)
        
        temp_dir = get_temp_dir()
        temp_writable = os.access(temp_dir, os.W_OK)
        
        plantuml_version = "Unknown"
        if jar_exists:
            version_result = subprocess.run(['java', '-jar', PLANTUML_JAR, '-version'], capture_output=True, text=True)
            if version_result.returncode == 0:
                plantuml_version = version_result.stdout.strip()
        
        return jsonify({
            "status": "ok",
            "java_available": java_available,
            "java_version": java_result.stderr if java_available else "Not available",
            "plantuml_jar_exists": jar_exists,
            "plantuml_version": plantuml_version,
            "plantuml_jar_path": os.path.abspath(PLANTUML_JAR),
            "temp_directory": temp_dir,
            "temp_writable": temp_writable
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)