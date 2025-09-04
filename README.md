# PlantUML Security Editor

A secure PlantUML diagram editor with local and cloud rendering modes for privacy-conscious users.

## Project Overview

This PlantUML editor supports dual rendering modes: secure local processing and convenient cloud processing. The application features real-time preview, multi-format export (SVG/PNG), and built-in examples for common diagram types.

## Installation

### Prerequisites
- Python 3.6+
- Node.js (for http-server)
- Java Runtime Environment (JRE) 8+

### Setup Steps

1. **Install Python dependencies:**
```bash
pip install flask flask-cors
```

2. **Install Node.js http-server:**
```bash
npm install -g http-server
```

3. **Download PlantUML JAR:**
```bash
wget https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar
```

4. **Install Java:**
   - Windows: Download from [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html) or [OpenJDK](https://adoptium.net/)
   - Linux: `sudo apt install openjdk-11-jre`
   - macOS: `brew install openjdk@11`

## Usage

### Quick Start
```bash
python start.py
```

This will automatically:
- Clean temporary files
- Start Python backend (port 5000)
- Start HTTP server (port 8080)
- Open browser to http://localhost:8080

### Manual Start
```bash
# Start backend
python app.py

# Start frontend
http-server -p 8080
```

## Usage Modes

### Local Mode (Default)
- **Security**: All processing occurs locally, no data transmission to external servers
- **Privacy**: Complete data confidentiality, suitable for sensitive information
- **Requirements**: Requires local Java installation and PlantUML JAR file
- **Performance**: Slower initial startup, but secure

### Cloud Mode
- **Security**: PlantUML code is transmitted to external PlantUML official servers
- **Privacy**: Not suitable for confidential or sensitive information
- **Requirements**: Internet connection only
- **Performance**: Faster rendering through optimized cloud infrastructure

**Security Recommendation**: Use Local Mode for confidential documents and enterprise environments.

## Development Information

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python Flask
- **Diagram Engine**: PlantUML
- **Web Server**: http-server (Node.js)

### Port Configuration
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

### Project Structure
```
plantuml-editor/
├── app.py              # Python backend service
├── index.html          # Frontend interface
├── start.py            # Cross-platform startup script
├── plantuml.jar        # PlantUML JAR file
├── tmp/                # Temporary files directory
└── README.md           # Documentation
```

## Related Links

* Official Translation Page: https://www.plantuml.com/plantuml/

## License

This project is licensed under the MIT License.

