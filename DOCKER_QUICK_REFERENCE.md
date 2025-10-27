# HireHub Ethiopia - Docker Quick Reference

**Quick command reference for Docker deployment**

---

## 🚀 Startup

### Windows
```cmd
start-docker.bat
```

### Linux/Mac
```bash
./start-docker.sh
```

---

## 🎯 Essential Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# View logs (follow mode)
docker-compose logs -f

# Check status
docker-compose ps

# Rebuild and restart
docker-compose up -d --build
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Job Seeker Portal | http://localhost:8081 |
| Employer Portal | http://localhost:3000 |
| Auth Hub | http://localhost:3002 |
| Admin Panel | http://localhost:3001 |
| Backend API | http://localhost:4000 |

---

## 📊 Service-Specific Commands

```bash
# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f job-seeker-portal
docker-compose logs -f employer-portal
docker-compose logs -f auth-hub
docker-compose logs -f admin-panel

# Restart specific service
docker-compose restart backend
docker-compose restart job-seeker-portal

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend
```

---

## 🔧 Troubleshooting

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Check resource usage
docker stats

# Clean up stopped containers
docker container prune

# Clean up unused images
docker image prune

# Nuclear option (clean everything)
docker system prune -a --volumes

# Fresh start
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

---

## 🗄️ Database Commands

```bash
# Backup SQLite database
docker cp hirehub-backend:/app/database.sqlite ./backup-$(date +%Y%m%d).sqlite

# Access container shell
docker-compose exec backend sh

# View database inside container
docker-compose exec backend sqlite3 /app/database.sqlite
```

---

## 🐛 Common Issues

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill <PID>
```

### Build Fails
```bash
docker system prune -a
docker-compose build --no-cache
```

### Service Won't Start
```bash
docker-compose logs <service-name>
docker-compose restart <service-name>
```

### Clear Everything
```bash
docker-compose down -v --rmi all
docker system prune -a --volumes
```

---

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Main orchestration file |
| `.env.docker` | Environment variables |
| `backend/Dockerfile` | Backend container build |
| `Frontend/*/Dockerfile` | Frontend container builds |

---

## 🔐 Default Credentials

### Admin User
- **Email:** admin@hirehub.et
- **Password:** admin123

### Test Employer
- **Email:** test@employer.com
- **Password:** password123

---

## 🎓 Learn More

Full documentation: `DOCKER_DEPLOYMENT_GUIDE.md`

