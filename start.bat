@echo off
echo Starting PlantUML Editor...

echo 1. Starting Python backend service...
start "PlantUML Backend" cmd /k "python app.py"

echo 2. Waiting for backend service to start...
timeout /t 3 /nobreak > nul

echo 3. Starting HTTP server...
start "HTTP Server" cmd /k "http-server -p 8080"

echo 4. Waiting for HTTP server to start...
timeout /t 2 /nobreak > nul

echo 5. Opening browser...
start http://localhost:8080

echo All services started successfully!
pause