import os
import sys
import subprocess
import time
import shutil
import webbrowser
import platform

def clean_tmp_folder():
    """清理 tmp 資料夾"""
    print("1. Cleaning temporary files...")
    tmp_dir = "tmp"
    if os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)
    os.makedirs(tmp_dir, exist_ok=True)

def start_backend():
    """啟動 Python 後端"""
    print("2. Starting Python backend service...")
    if platform.system() == "Windows":
        subprocess.Popen(["cmd", "/c", "start", "PlantUML Backend", "cmd", "/k", "python app.py"], shell=True)
    else:
        subprocess.Popen(["python", "app.py"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def start_http_server():
    """啟動 HTTP 伺服器"""
    print("4. Starting HTTP server...")
    if platform.system() == "Windows":
        subprocess.Popen(["cmd", "/c", "start", "HTTP Server", "cmd", "/k", "http-server -p 8080"], shell=True)
    else:
        subprocess.Popen(["http-server", "-p", "8080"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def open_browser():
    """開啟瀏覽器"""
    print("6. Opening browser...")
    webbrowser.open("http://localhost:8080")

def main():
    print("Starting PlantUML Editor...")
    
    try:
        clean_tmp_folder()
        
        start_backend()
        
        print("3. Waiting for backend service to start...")
        time.sleep(3)
        
        start_http_server()
        
        print("5. Waiting for HTTP server to start...")
        time.sleep(2)
        
        open_browser()
        
        print("All services started successfully!")
        input("Press Enter to exit...")
        
    except KeyboardInterrupt:
        print("\nShutting down...")
    except Exception as e:
        print(f"Error: {e}")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()