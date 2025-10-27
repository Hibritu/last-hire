@echo off
REM HireHub Ethiopia - Docker Startup Script for Windows
REM This script starts all services using Docker Compose

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║         🇪🇹 HIREHUB ETHIOPIA - DOCKER STARTUP 🇪🇹                ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker is not installed or not in PATH
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker is not running
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is installed and running
echo.

REM Check if .env.docker exists
if not exist ".env.docker" (
    echo ⚠️  WARNING: .env.docker file not found
    echo.
    echo Creating .env.docker from template...
    copy .env.docker.example .env.docker >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ .env.docker created. Please edit it with your configuration.
        echo.
        pause
    ) else (
        echo ❌ ERROR: Could not create .env.docker
        echo Please create it manually from .env.docker.example
        echo.
        pause
        exit /b 1
    )
)

echo 📦 Loading environment variables from .env.docker...
echo.

REM Stop any running containers
echo 🛑 Stopping any existing HireHub containers...
docker-compose down

echo.
echo 🏗️  Building Docker images (this may take a few minutes)...
echo.
docker-compose build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Docker build failed
    echo Please check the error messages above
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Starting all HireHub services...
echo.
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Failed to start containers
    echo Please check the error messages above
    echo.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                     ✅ ALL SERVICES RUNNING                      ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 HireHub Ethiopia is now running!
echo.
echo 📋 Access your applications:
echo    • Backend API:       http://localhost:4000
echo    • Job Seeker Portal: http://localhost:8081
echo    • Employer Portal:   http://localhost:3000
echo    • Admin Panel:       http://localhost:3001
echo    • Auth Hub:          http://localhost:3002
echo.
echo 📊 Monitor logs:        docker-compose logs -f
echo 🛑 Stop services:       docker-compose down
echo 🔄 Restart services:    docker-compose restart
echo 📈 View status:         docker-compose ps
echo.
echo ══════════════════════════════════════════════════════════════════
echo.
echo Opening Job Seeker Portal in your browser...
timeout /t 3 >nul
start http://localhost:8081
echo.
pause

