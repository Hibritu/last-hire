#!/bin/bash
# HireHub Ethiopia - Docker Startup Script for Linux/Mac
# This script starts all services using Docker Compose

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         🇪🇹 HIREHUB ETHIOPIA - DOCKER STARTUP 🇪🇹                ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker is not installed or not in PATH"
    echo ""
    echo "Please install Docker from:"
    echo "https://docs.docker.com/get-docker/"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ ERROR: Docker is not running"
    echo ""
    echo "Please start Docker and try again."
    echo ""
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "⚠️  WARNING: .env.docker file not found"
    echo ""
    echo "Creating .env.docker from template..."
    if cp .env.docker.example .env.docker 2>/dev/null; then
        echo "✅ .env.docker created. Please edit it with your configuration."
        echo ""
        echo "Press Enter to continue..."
        read
    else
        echo "❌ ERROR: Could not create .env.docker"
        echo "Please create it manually from .env.docker.example"
        echo ""
        exit 1
    fi
fi

echo "📦 Loading environment variables from .env.docker..."
echo ""

# Stop any running containers
echo "🛑 Stopping any existing HireHub containers..."
docker-compose down

echo ""
echo "🏗️  Building Docker images (this may take a few minutes)..."
echo ""
docker-compose build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Docker build failed"
    echo "Please check the error messages above"
    echo ""
    exit 1
fi

echo ""
echo "🚀 Starting all HireHub services..."
echo ""
docker-compose up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERROR: Failed to start containers"
    echo "Please check the error messages above"
    echo ""
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                     ✅ ALL SERVICES RUNNING                      ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 HireHub Ethiopia is now running!"
echo ""
echo "📋 Access your applications:"
echo "   • Backend API:       http://localhost:4000"
echo "   • Job Seeker Portal: http://localhost:8081"
echo "   • Employer Portal:   http://localhost:3000"
echo "   • Admin Panel:       http://localhost:3001"
echo "   • Auth Hub:          http://localhost:3002"
echo ""
echo "📊 Monitor logs:        docker-compose logs -f"
echo "🛑 Stop services:       docker-compose down"
echo "🔄 Restart services:    docker-compose restart"
echo "📈 View status:         docker-compose ps"
echo ""
echo "══════════════════════════════════════════════════════════════════"
echo ""
echo "Opening Job Seeker Portal in your browser..."
sleep 2

# Try to open browser (works on most Linux and Mac systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8081
elif command -v open &> /dev/null; then
    open http://localhost:8081
fi

echo ""

