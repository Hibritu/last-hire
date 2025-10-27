# 🔧 Port Configuration Fix - User Portal

## ✅ What Was Fixed

The User Portal and Seekr Companion had **hardcoded ports** in their Vite config files that conflicted with the startup script.

### **Fixed Files:**
1. `Frontend/USER(dagi)/vite.config.ts` - Changed from port 8080 → **8081**
2. `Frontend/seekr-companion-main/vite.config.ts` - Changed from port 8080 → **3002**

---

## 🚀 How to Start the User Portal Now

### **Option 1: Use the Startup Script (Recommended)**

```bash
# Windows
.\start-hirehub.bat
```

This will start all services including the User Portal on port 8081.

---

### **Option 2: Start User Portal Manually**

```bash
# Open a terminal
cd Frontend/USER(dagi)

# Install dependencies (if not done yet)
npm install

# Start the development server
npm run dev
```

The server will now start on **port 8081** automatically!

---

## 🎯 Correct Port Configuration

Here's what should be running where:

| Service | Port | URL |
|---------|------|-----|
| **Auth Service** | 4000 | http://localhost:4000 |
| **Jobs Service** | 4001 | http://localhost:4001 |
| **Payment Service** | 8080 | http://localhost:8080 |
| **Seekr Companion** (Auth Hub) | 3002 | http://localhost:3002 |
| **User Portal** | 8081 | http://localhost:8081 |
| **Employer Portal** | 3000 | http://localhost:3000 |
| **Admin Panel** | 3001 | http://localhost:3001 |

---

## 🧪 Test If User Portal Is Running

1. **Start the User Portal:**
   ```bash
   cd Frontend/USER(dagi)
   npm run dev
   ```

2. **Look for this message in the terminal:**
   ```
   ➜  Local:   http://localhost:8081/
   ➜  Network: use --host to expose
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:8081
   ```

4. **You should see the User Portal homepage!** 🎉

---

## 🐛 Troubleshooting

### **Problem: Port 8081 is already in use**

**Solution:** Kill the process using port 8081:

```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F

# Or use a different port temporarily:
cd Frontend/USER(dagi)
npm run dev -- --port 8082
```

---

### **Problem: "npm run dev" fails with errors**

**Solutions:**

1. **Delete node_modules and reinstall:**
   ```bash
   cd Frontend/USER(dagi)
   rmdir /s /q node_modules
   npm install
   npm run dev
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18 or higher
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

### **Problem: User Portal loads but shows blank page**

**Solutions:**

1. **Check browser console for errors** (F12)
2. **Check if backend services are running:**
   - Auth Service: http://localhost:4000/health
   - Jobs Service: http://localhost:4001/health

3. **Clear browser cache and reload**

---

### **Problem: "Cannot find module" errors**

**Solution:** Make sure all dependencies are installed:
```bash
cd Frontend/USER(dagi)
npm install
```

---

## ✅ Verification Checklist

After starting, verify everything works:

- [ ] Terminal shows "Local: http://localhost:8081/"
- [ ] Browser can open http://localhost:8081
- [ ] No CORS errors in browser console (F12)
- [ ] Can see job listings (if jobs are approved)
- [ ] Can register/login (redirects work)

---

## 🎯 Complete Testing Flow

### **Step 1: Start All Services**
```bash
# Use the startup script
.\start-hirehub.bat

# Wait 30-60 seconds for all services to start
```

### **Step 2: Verify Each Service**
```bash
# Check Auth Service
curl http://localhost:4000/health

# Check Jobs Service
curl http://localhost:4001/health

# Check Payment Service
curl http://localhost:8080/healthz
```

### **Step 3: Test User Portal**
1. Open http://localhost:3002 (Seekr Companion)
2. Register as Job Seeker
3. Should redirect to http://localhost:8081 (User Portal)
4. You should see the job listings page! ✅

---

## 📝 Quick Commands Reference

```bash
# Start User Portal only
cd Frontend/USER(dagi) && npm run dev

# Start Seekr Companion only
cd Frontend/seekr-companion-main && npm run dev

# Start Employer Portal only
cd Frontend/employer-connect-pro-main && npm run dev

# Start all frontends at once (Windows PowerShell)
Start-Process -FilePath "cmd" -ArgumentList "/c cd Frontend\USER(dagi) && npm run dev"
Start-Process -FilePath "cmd" -ArgumentList "/c cd Frontend\seekr-companion-main && npm run dev"
Start-Process -FilePath "cmd" -ArgumentList "/c cd Frontend\employer-connect-pro-main && npm run dev"
```

---

## 🎉 Success!

If you can access http://localhost:8081 and see the User Portal, everything is working correctly! 

The port configuration is now fixed and consistent across all services.

---

## 📞 Still Having Issues?

If the User Portal still won't start:

1. **Check the terminal output** for specific error messages
2. **Make sure no other application is using port 8081**
3. **Try starting it manually** with the commands above
4. **Check Node.js and npm versions:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

Let me know what error you're seeing and I can help debug further! 😊

