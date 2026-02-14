@echo off
echo Starting Safety Intelligence API Server...
echo.
cd /d "%~dp0"
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)
echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
