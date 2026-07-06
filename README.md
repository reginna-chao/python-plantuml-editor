# PlantUML Security Editor

A secure PlantUML diagram editor with local and cloud rendering modes for privacy-conscious users.

## Project Overview

This PlantUML editor supports dual rendering modes: secure local processing and convenient cloud processing. The application features real-time preview, multi-format export (SVG/PNG), and built-in examples for common diagram types.

## Quick Start with Docker (Recommended)

No local installation of Python, Java, or Node.js required — only [Docker](https://www.docker.com/products/docker-desktop/).

```bash
docker compose up -d --build
```

This builds and starts two containers:

| Service  | URL                   | Description                                      |
|----------|-----------------------|--------------------------------------------------|
| Frontend | http://localhost:8081 | Web editor (nginx)                               |
| Backend  | http://localhost:5000 | Flask render API with JRE, Graphviz, CJK fonts   |

Open http://localhost:8081, keep the default Backend Server URL (`http://localhost:5000/render`), and use Local Mode directly.

To stop:

```bash
docker compose down
```

Notes:
- The backend image bundles the Java runtime, Graphviz (needed for class/component diagrams), and Noto CJK fonts (so Chinese/Japanese/Korean text renders correctly).
- The frontend host port is `8081` (not `8080`) to avoid a common port conflict; change it in `docker-compose.yml` if needed.

## Manual Installation (without Docker)

### Prerequisites
- Python 3.6+
- Node.js (for http-server)
- Java Runtime Environment (JRE) 8+

### Setup Steps

1. **Install Python dependencies:**
```bash
python -m pip install -r requirements.txt
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

## Usage (Manual)

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
- **Frontend**: http://localhost:8080 (manual) / http://localhost:8081 (Docker)
- **Backend API**: http://localhost:5000

### Project Structure
```
plantuml-editor/
├── app.py                # Python backend service
├── app.js                # Frontend logic
├── app.css               # Frontend styles
├── index.html            # Frontend interface
├── start.py              # Cross-platform startup script (manual mode)
├── plantuml.jar          # PlantUML JAR file
├── Dockerfile.backend    # Backend image (Python + JRE + Graphviz + CJK fonts)
├── Dockerfile.frontend   # Frontend image (nginx)
├── docker-compose.yml    # One-command startup for both services
├── requirements.txt      # Python dependencies
├── tmp/                  # Temporary files directory
└── README.md             # Documentation
```

## Related Links

* Official Translation Page: https://www.plantuml.com/plantuml/

## License

This project is licensed under the MIT License.

