@echo off
REM HireHub Ethiopia - Full Stack Windows Startup Script

echo ========================================
echo   HireHub Ethiopia - Full Stack Startup
echo ========================================
echo.

echo Starting HireHub Ethiopia with Backend Integration...
echo.

REM Kill any existing processes on our ports
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do taskkill /f /pid %%a 2>nul

echo.

echo ========================================
echo   PHASE 1: Starting Unified Backend
echo ========================================
echo.

REM Start Unified Backend Service - Port 4000
echo [1/1] Starting Unified Backend (Port 4000)...
echo    - Auth, Jobs, Applications, Chat, Payments
cd backend
start "HireHub Unified Backend" cmd /c "npm install && npm start"
cd ..
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   PHASE 2: Starting Frontend Applications
echo ========================================
echo.

REM Start Seekr Companion (Auth Hub) - Port 3002
echo [1/4] Starting Seekr Companion - Auth Hub (Port 3002)...
cd Frontend\seekr-companion-main
start "Seekr Companion - HireHub" cmd /c "npm install && npm run dev -- --port 3002"
cd ..\..
timeout /t 2 /nobreak >nul

REM Start User Portal - Port 8081
echo [2/4] Starting User Portal (Port 8081)...
cd Frontend\USER(dagi)
start "User Portal - HireHub" cmd /c "npm install && npm run dev -- --port 8081"
cd ..\..
timeout /t 2 /nobreak >nul

REM Start Employer Portal - Port 3000
echo [3/4] Starting Employer Connect Pro (Port 3000)...
cd Frontend\employer-connect-pro-main
start "Employer Connect Pro - HireHub" cmd /c "npm install && npm run dev -- --port 3000"
cd ..\..
timeout /t 2 /nobreak >nul

REM Start Admin Panel - Port 3001
echo [4/4] Starting Admin Panel (Port 3001)...
cd admin
start "Admin Panel - HireHub" cmd /c "npm install && npm run dev -- --port 3001"
cd ..
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   HireHub Ethiopia - READY!
echo ========================================
echo.
echo Backend Service (Unified):
echo   - API Server:      http://localhost:4000
echo     * Auth:          /auth/*
echo     * Jobs:          /api/jobs/*
echo     * Applications:  /api/applications/*
echo     * Employers:     /employers/*
echo     * Chat:          /api/chat/*
echo     * Payments:      /api/chapa/*
echo     * Swagger Docs:  /api-docs
echo.
echo Frontend Applications:
echo   - Auth Hub:        http://localhost:3002 (START HERE)
echo   - User Portal:     http://localhost:8081
echo   - Employer Portal: http://localhost:3000
echo   - Admin Panel:     http://localhost:3001
echo.
echo ========================================
echo   Development Notes:
echo ========================================
echo.
echo - PRIMARY ENTRY: http://localhost:3002 (Seekr Companion)
echo - Unified Backend: All services now in one API server
echo - Database: PostgreSQL (Neon Cloud)
echo - Real-time Chat: Socket.io enabled
echo - Payment Gateway: Chapa (Ethiopian payments)
echo - File Uploads: Resumes, IDs, Licenses supported
echo.
echo Wait 30-60 seconds for all services to fully start...
echo Then visit: http://localhost:3002
echo.
pause