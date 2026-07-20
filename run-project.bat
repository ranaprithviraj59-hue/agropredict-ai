@echo off
setlocal

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 24 or newer from https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed. Reinstall Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting AgroPredict AI...
echo Frontend: http://127.0.0.1:5173
echo Backend:  http://127.0.0.1:4000/api/health
echo Admin key: admin123
npm run dev
