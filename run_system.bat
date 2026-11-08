@echo off
title AI Waste Disposal Detection & Monitoring System
echo ============================================================
echo Starting AI Waste Disposal Detection System...
echo ============================================================

echo Starting FastAPI Backend Server on http://127.0.0.1:8000...
start "FastAPI Backend" cmd /k ".\venv\Scripts\activate.bat && python main.py backend"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend Dashboard on http://localhost:5173...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================================
echo Both servers have been launched in separate windows!
echo - Backend:  http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)
echo - Frontend: http://localhost:5173
echo ============================================================
pause

