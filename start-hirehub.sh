#!/bin/bash

# HireHub Ethiopia - Complete System Startup Script
echo "🚀 Starting HireHub Ethiopia System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to start service in background
start_service() {
    local service_name=$1
    local directory=$2
    local command=$3
    local port=$4
    
    echo -e "${BLUE}Starting $service_name on port $port...${NC}"
    
    if check_port $port; then
        cd "$directory"
        $command &
        local pid=$!
        echo -e "${GREEN}✅ $service_name started (PID: $pid)${NC}"
        sleep 3
    else
        echo -e "${YELLOW}⚠️ $service_name may already be running on port $port${NC}"
    fi
}

# Start Backend Services
echo -e "\n${BLUE}📡 Starting Backend Services...${NC}"

# Auth Service (nodejs Hibr)
start_service "Auth Service" "backend/nodejs(Hibr)" "npm start" 4000

# Jobs Service (NodeJS)
start_service "Jobs Service" "backend/NodeJS" "npm start" 4001

# Payment Service (Go)
echo -e "${BLUE}Starting Payment Service (Docker)...${NC}"
cd backend/go
if command -v docker &> /dev/null; then
    if check_port 8080; then
        docker build -t hirehub-payment . 2>/dev/null
        docker run -d -p 8080:8080 --name hirehub-payment hirehub-payment
        echo -e "${GREEN}✅ Payment Service started in Docker${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Docker not found, starting with Go directly...${NC}"
    go run main.go &
    echo -e "${GREEN}✅ Payment Service started with Go${NC}"
fi

sleep 5

# Start Frontend Applications
echo -e "\n${BLUE}🖥️ Starting Frontend Applications...${NC}"

# Seekr Companion (Auth Hub)
start_service "Seekr Companion (Auth Hub)" "Frontend/seekr-companion-main" "npm run dev" 8080

# User Frontend
start_service "User Frontend (Job Seeker)" "Frontend/USER(dagi)" "npm run dev" 8081

# Employer Frontend  
start_service "Employer Frontend" "Frontend/Employer(letera)" "npm start" 3000

# Admin Panel
start_service "Admin Panel" "admin" "npm run dev" 3001

echo -e "\n${GREEN}🎉 HireHub Ethiopia System Started Successfully!${NC}"
echo -e "\n${BLUE}📋 Access Points:${NC}"
echo -e "🔐 Auth Hub (Seekr Companion): ${YELLOW}http://localhost:8080${NC}"
echo -e "👤 Job Seeker Portal: ${YELLOW}http://localhost:8081${NC}"  
echo -e "🏢 Employer Portal: ${YELLOW}http://localhost:3000${NC}"
echo -e "⚙️ Admin Panel: ${YELLOW}http://localhost:3001${NC}"

echo -e "\n${BLUE}🔧 Backend Services:${NC}"
echo -e "🔑 Auth API: ${YELLOW}http://localhost:4000${NC}"
echo -e "💼 Jobs API: ${YELLOW}http://localhost:4001${NC}"
echo -e "💳 Payment API: ${YELLOW}http://localhost:8080${NC}"

echo -e "\n${BLUE}🧪 Test Credentials (shown in dev banners):${NC}"
echo -e "📧 Employer: ${YELLOW}employer@hirehub.et${NC} / ${YELLOW}password123${NC}"
echo -e "👤 Job Seeker: ${YELLOW}user@hirehub.et${NC} / ${YELLOW}password123${NC}"

echo -e "\n${GREEN}💡 Tip: Development banners will show mock credentials and quick login buttons!${NC}"

# Wait for user input to stop services
echo -e "\n${BLUE}Press Ctrl+C to stop all services...${NC}"
wait