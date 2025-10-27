# HireHub Ethiopia - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### **1. Module Import Errors**

#### **Error:** `Cannot find module './api.js'`
```
Module not found: Error: Can't resolve './api.js' in 'src/services'
```

**Solution:** 
- API client is located in `src/lib/api.js`, not in the same directory as services
- Update import paths in service files:
```javascript
// ❌ Wrong
import { apiWrapper } from './api.js';

// ✅ Correct  
import { apiWrapper } from '../lib/api.js';
```

**Fixed Files:**
- `src/services/apiServices.js` ✅
- `src/services/authService.js` ✅  
- `src/services/paymentService.js` ✅

### **2. Backend Connection Issues**

#### **Error:** Backend services not responding
**Symptoms:**
- "Mock Data Mode" badge appears
- Development banner shows "🟡 Mock Mode"
- Console shows connection errors

**Solutions:**
1. **Check Backend Services:**
```bash
# Verify services are running
curl http://localhost:4000/health  # Auth Service
curl http://localhost:4001/health  # Jobs Service  
curl http://localhost:8080/healthz # Payment Service
```

2. **Start Missing Services:**
```bash
# Auth Service
cd backend/nodejs(Hibr) && npm start

# Jobs Service
cd backend/NodeJS && npm start

# Payment Service (Docker)
cd backend/go && docker run -p 8080:8080 hirehub-payment
```

3. **Check Environment Variables:**
- Verify `.env` files have correct API URLs
- Ensure CORS origins include frontend URLs

### **3. Authentication Issues**

#### **Error:** Redirected to login repeatedly
**Symptoms:**
- Can't access protected routes
- Constantly redirected to Seekr Companion
- Authentication doesn't persist

**Solutions:**
1. **Clear Browser Storage:**
```javascript
localStorage.clear();
sessionStorage.clear();
```

2. **Check Token Validity:**
- Open browser dev tools → Application → Local Storage
- Look for `hirehub_token` key
- Verify token isn't expired

3. **Use Development Banner:**
- Click quick login buttons in development banner
- Use provided test credentials

### **4. CORS Errors**

#### **Error:** `Access to fetch at 'localhost:4000' blocked by CORS policy`
**Solution:**
1. **Check Backend CORS Configuration:**
```javascript
// In backend app.js files
const corsOptions = {
  origin: [
    'http://localhost:5173',  // USER app
    'http://localhost:5174',  // Seekr Companion
    'http://localhost:3000',  // Employer app
    'http://localhost:3001'   // Admin panel
  ]
};
```

2. **Restart Backend Services** after CORS changes

### **5. Port Conflicts**

#### **Error:** `EADDRINUSE: address already in use :::3000`
**Solution:**
1. **Find Process Using Port:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux  
lsof -ti:3000 | xargs kill -9
```

2. **Use Different Port:**
```bash
# Set PORT environment variable
PORT=3001 npm start
```

### **6. Database Connection Issues**

#### **Error:** Database connection failed
**Solution:**
1. **Start PostgreSQL:**
```bash
# Windows (if installed via installer)
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Mac (via Homebrew)
brew services start postgresql

# Linux (systemd)
sudo systemctl start postgresql
```

2. **Create Database:**
```sql
CREATE DATABASE hirehub;
```

3. **Update Connection String:**
```bash
# In backend .env files
DATABASE_URL=postgres://username:password@localhost:5432/hirehub
```

### **7. Development Banner Not Showing**

#### **Issue:** Testing credentials not visible
**Solution:**
1. **Check Environment Mode:**
```javascript
// Should be true in development
console.log(process.env.NODE_ENV); // 'development'
```

2. **Force Development Mode:**
```bash
# In .env files
NODE_ENV=development
REACT_APP_DEBUG=true
```

### **8. Payment Integration Issues**

#### **Error:** Payment service unavailable
**Solution:**
1. **Start Go Payment Service:**
```bash
cd backend/go
docker build -t hirehub-payment .
docker run -p 8080:8080 hirehub-payment
```

2. **Use Mock Payments:**
- System automatically falls back to mock payments
- All ETB transactions are simulated
- No real payment processing in development

## 🔧 **Quick Diagnostic Commands**

### **Check All Services:**
```bash
# Test all endpoints
curl http://localhost:4000/health  # Auth
curl http://localhost:4001/health  # Jobs  
curl http://localhost:8080/healthz # Payment
curl http://localhost:5174         # Seekr Companion
curl http://localhost:5173         # User App
curl http://localhost:3000         # Employer App
```

### **Reset Everything:**
```bash
# Clear all tokens and cache
localStorage.clear();

# Restart all services
# Use start-hirehub.bat or start-hirehub.sh
```

### **Check Logs:**
- **Browser Console:** F12 → Console tab
- **Backend Logs:** Check terminal running services
- **Network Tab:** F12 → Network tab for API calls

## 🆘 **Emergency Recovery**

If nothing works:

1. **Full Reset:**
```bash
# Stop all services (Ctrl+C in all terminals)
# Clear browser data completely
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

2. **Use Mock Mode:**
- Development banners show "Mock Data Mode"
- All functionality works with realistic test data
- No backend required

3. **Check System Status:**
- Development banners show connectivity status
- Green = Connected, Yellow = Mock Mode, Red = Error

## 📞 **Getting Help**

- **Development Banners:** Show real-time status and test credentials
- **Console Logs:** Detailed error messages with prefixes like `[EMPLOYER]`
- **Network Tab:** Check API request/response details
- **Environment Check:** Verify all `.env` configurations

The system is designed to work robustly with comprehensive fallbacks, so most issues can be resolved by using the mock data mode while troubleshooting backend connectivity.