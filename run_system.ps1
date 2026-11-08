# Launcher script for Windows PowerShell
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting AI Waste Disposal Detection & Monitoring System..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

# Start Backend in a new window
Write-Host "1. Launching FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PSScriptRoot'; .\venv\Scripts\Activate.ps1; python main.py backend }"

Start-Sleep -Seconds 3

# Start Frontend in a new window
Write-Host "2. Launching React Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PSScriptRoot\frontend'; npm run dev }"

Write-Host ""
Write-Host "Both Backend and Frontend servers are now running in separate windows!" -ForegroundColor Green
Write-Host "-> Frontend URL: http://localhost:5173" -ForegroundColor White
Write-Host "-> Backend URL:  http://127.0.0.1:8000" -ForegroundColor White
Write-Host "-> Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor White

