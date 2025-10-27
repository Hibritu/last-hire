# HireHub Ethiopia - Docker Deployment Guide

**Complete guide for running HireHub Ethiopia with Docker**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Building and Running](#building-and-running)
5. [Service Architecture](#service-architecture)
6. [Docker Commands Reference](#docker-commands-reference)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## 🔧 Prerequisites

### Required Software

1. **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
   - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Mac: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

2. **Docker Compose** (included with Docker Desktop)
   - Verify installation: `docker-compose --version`

### System Requirements

- **RAM:** Minimum 4GB, Recommended 8GB
- **Disk Space:** Minimum 10GB free
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)

---

## 🚀 Quick Start

### Windows

1. **Open Command Prompt or PowerShell** in the project root directory

2. **Run the Docker startup script:**
   ```cmd
   start-docker.bat
   ```

3. **Wait for all services to start** (first run may take 5-10 minutes to build images)

4. **Access your applications:**
   - Job Seeker Portal: http://localhost:8081
   - Employer Portal: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Auth Hub: http://localhost:3002
   - Backend API: http://localhost:4000

### Linux/Mac

1. **Open Terminal** in the project root directory

2. **Make the script executable:**
   ```bash
   chmod +x start-docker.sh
   ```

3. **Run the Docker startup script:**
   ```bash
   ./start-docker.sh
   ```

4. **Wait for all services to start** (first run may take 5-10 minutes)

5. **Access your applications** at the URLs above

---

## 🔐 Environment Configuration

### Setup `.env.docker` File

1. **Copy the example file:**
   ```bash
   cp .env.docker.example .env.docker
   ```

2. **Edit `.env.docker` with your configuration:**

```env
# Database - Use Neon DB for production or leave empty for SQLite
DATABASE_URL=postgresql://user:password@host/database

# JWT Secret - Generate a strong random key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Chat Encryption - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CHAT_ENCRYPTION_KEY=your_32_byte_hex_string

# Payment Gateway (Chapa) - Get from https://dashboard.chapa.co/
CHAPA_SECRET_KEY=CHASECK_TEST-your_test_key_here

# Application URLs
FRONTEND_URL=http://localhost:8081
BACKEND_URL=http://localhost:4000
```

### Important Configuration Notes

- **JWT_SECRET:** Generate a strong secret key. Never use default values in production.
- **DATABASE_URL:** 
  - Leave empty to use SQLite (development only)
  - Use Neon DB connection string for production
- **GMAIL_APP_PASSWORD:** Generate from Google Account settings (2FA required)
- **CHAT_ENCRYPTION_KEY:** Must be exactly 32 bytes (64 hex characters)

---

## 🏗️ Building and Running

### Manual Docker Commands

If you prefer not to use the startup script:

#### 1. Build all images
```bash
docker-compose build
```

#### 2. Start all services
```bash
docker-compose up -d
```

The `-d` flag runs containers in detached mode (background).

#### 3. View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f job-seeker-portal
```

#### 4. Stop all services
```bash
docker-compose down
```

#### 5. Restart services
```bash
docker-compose restart
```

#### 6. Check service status
```bash
docker-compose ps
```

---

## 🏛️ Service Architecture

### Container Overview

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| Backend API | `hirehub-backend` | 4000 | Node.js REST API, authentication, database |
| Job Seeker Portal | `hirehub-job-seeker` | 8081 | React + Vite, job browsing, applications |
| Employer Portal | `hirehub-employer` | 3000 | React + Vite, job posting, applicant management |
| Auth Hub | `hirehub-auth` | 3002 | React + Vite, centralized authentication |
| Admin Panel | `hirehub-admin` | 3001 | Next.js, admin dashboard, moderation |

### Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network (Bridge)                   │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Job Seeker   │    │  Employer    │    │  Auth Hub    │ │
│  │   :8081      │    │    :3000     │    │    :3002     │ │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘ │
│         │                   │                   │          │
│         └───────────────────┼───────────────────┘          │
│                             │                               │
│                      ┌──────▼────────┐                     │
│                      │   Backend     │                     │
│                      │     :4000     │                     │
│                      └──────┬────────┘                     │
│                             │                               │
│                      ┌──────▼────────┐                     │
│                      │   Database    │                     │
│                      │ (Neon/SQLite) │                     │
│                      └───────────────┘                     │
│                                                              │
│  ┌──────────────┐                                          │
│  │ Admin Panel  │                                          │
│  │    :3001     │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

### Volumes

- `./backend/uploads` → `/app/uploads` (persistent file storage)
- `./backend/database.sqlite` → `/app/database.sqlite` (SQLite database)

---

## 📚 Docker Commands Reference

### Container Management

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v
```

### Logs and Monitoring

```bash
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# View logs for specific service
docker-compose logs backend

# View last 100 lines
docker-compose logs --tail=100
```

### Building and Updating

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache

# Pull latest base images and rebuild
docker-compose build --pull
```

### Inspecting Services

```bash
# List running containers
docker-compose ps

# View resource usage
docker stats

# Execute command in container
docker-compose exec backend sh

# View container details
docker inspect hirehub-backend
```

### Database Management

```bash
# Access SQLite database (if using SQLite)
docker-compose exec backend sh
sqlite3 database.sqlite

# Backup database
docker cp hirehub-backend:/app/database.sqlite ./backup.sqlite

# Restore database
docker cp ./backup.sqlite hirehub-backend:/app/database.sqlite
docker-compose restart backend
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Bind for 0.0.0.0:4000 failed: port is already allocated`

**Solution:**
```bash
# Stop the conflicting service
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill <PID>

# Or change port in docker-compose.yml
ports:
  - "4001:4000"  # Use 4001 externally instead
```

#### 2. Out of Memory

**Error:** Container crashes or becomes unresponsive

**Solution:**
- Increase Docker memory limit in Docker Desktop settings
- Recommended: 4GB minimum, 8GB for better performance

#### 3. Build Failed

**Error:** `ERROR [internal] load metadata for docker.io/library/node:20-alpine`

**Solution:**
```bash
# Pull base image manually
docker pull node:20-alpine

# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose build --no-cache
```

#### 4. Database Connection Failed

**Error:** `SequelizeConnectionError: connect ECONNREFUSED`

**Solution:**
- Check `DATABASE_URL` in `.env.docker`
- For SQLite: Ensure `database.sqlite` is accessible
- For PostgreSQL: Verify Neon DB credentials
- Check network connectivity

#### 5. Frontend Not Loading

**Error:** Blank page or loading spinner

**Solution:**
```bash
# Check if build completed
docker-compose logs job-seeker-portal

# Rebuild frontend
docker-compose build job-seeker-portal

# Restart service
docker-compose restart job-seeker-portal
```

### Health Checks

```bash
# Check if backend is healthy
curl http://localhost:4000/health

# View all service health status
docker-compose ps
```

### Clean Slate Restart

If something is seriously broken:

```bash
# Stop everything
docker-compose down

# Remove all containers, networks, volumes, and images
docker-compose down -v --rmi all

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

---

## 🌍 Production Deployment

### Pre-Deployment Checklist

- [ ] Set strong `JWT_SECRET` (never use default)
- [ ] Configure production `DATABASE_URL` (Neon DB)
- [ ] Set up proper SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Enable automatic backups
- [ ] Configure email service (Gmail or SMTP)
- [ ] Set up Chapa payment gateway (production keys)
- [ ] Review and secure environment variables
- [ ] Set up reverse proxy (Nginx/Traefik)
- [ ] Configure domain names and DNS

### Production docker-compose.yml

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  # ... other services with similar configurations
```

### Deployment to VPS/Cloud

1. **Setup VPS** (DigitalOcean, AWS, Azure, etc.)

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/your-repo/hirehub-ethiopia.git
   cd hirehub-ethiopia
   ```

4. **Configure environment:**
   ```bash
   cp .env.docker.example .env.docker
   nano .env.docker  # Edit with production values
   ```

5. **Start services:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

6. **Setup Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name hirehub.et;

       location / {
           proxy_pass http://localhost:8081;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /api {
           proxy_pass http://localhost:4000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

7. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d hirehub.et
   ```

### Monitoring

```bash
# Install monitoring tools
docker run -d --name prometheus prom/prometheus
docker run -d --name grafana grafana/grafana

# View logs
docker-compose logs -f --tail=100

# Monitor resources
docker stats
```

---

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [HireHub GitHub Repository](https://github.com/your-repo/hirehub-ethiopia)
- [Neon Database Documentation](https://neon.tech/docs/introduction)
- [Chapa Payment Gateway](https://dashboard.chapa.co/)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check logs:** `docker-compose logs -f`
2. **Search GitHub Issues:** Common problems may already be solved
3. **Create an Issue:** Provide logs, configuration (sanitized), and steps to reproduce
4. **Contact Support:** email@hirehub.et

---

## 🎉 Success!

Once all services are running, you should see:

```
✅ ALL SERVICES RUNNING

🌐 HireHub Ethiopia is now running!

📋 Access your applications:
   • Backend API:       http://localhost:4000
   • Job Seeker Portal: http://localhost:8081
   • Employer Portal:   http://localhost:3000
   • Admin Panel:       http://localhost:3001
   • Auth Hub:          http://localhost:3002
```

**Enjoy using HireHub Ethiopia! 🇪🇹**

