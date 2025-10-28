# 🚀 HireHub Ethiopia - Complete Render Deployment Guide

## 📋 **Overview**

This guide will help you deploy HireHub Ethiopia to [Render.com](https://dashboard.render.com/web/new) - a modern cloud platform perfect for full-stack applications.

### **What You'll Deploy:**
- ✅ **Backend API** (Node.js/Express)
- ✅ **Job Seeker Portal** (React)
- ✅ **Employer Portal** (React)
- ✅ **Auth Hub** (React)
- ✅ **Admin Panel** (Next.js)
- ✅ **PostgreSQL Database**
- ✅ **Real-time Chat** (Socket.io)
- ✅ **Payment Integration** (Chapa)

---

## 🛠️ **Prerequisites**

### **Required Accounts:**
- [Render.com Account](https://dashboard.render.com/web/new) (Free tier available)
- [GitHub Account](https://github.com) (for code repository)
- [Gmail Account](https://gmail.com) (for email service)
- [Chapa Account](https://dashboard.chapa.co/) (for payments)

### **Required Information:**
- Your GitHub repository URL: `https://github.com/Hibritu/last-hire`
- Gmail App Password (for email notifications)
- Chapa API Keys (for payment processing)

---

## 🚀 **Step-by-Step Deployment**

### **Phase 1: Database Setup**

#### **1.1 Create PostgreSQL Database**
1. Go to [Render Dashboard](https://dashboard.render.com/web/new)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure your database:
   ```
   Name: hirehub-ethiopia-db
   Database: hirehub_production
   User: hirehub_user
   Password: [Generate a strong password]
   Region: Choose closest to your users
   ```
4. Click **"Create Database"**
5. **Copy the External Database URL** (you'll need this later)

#### **1.2 Database Features**
- ✅ **Automatic backups** (daily)
- ✅ **Connection pooling** (built-in)
- ✅ **Performance monitoring**
- ✅ **SSL connections** (automatic)
- ✅ **High availability**

---

### **Phase 2: Backend Service Deployment**

#### **2.1 Create Web Service**
1. Go to [Render Dashboard](https://dashboard.render.com/web/new)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository:
   ```
   Repository: Hibritu/last-hire
   Branch: main
   ```

#### **2.2 Configure Backend Service**
```
Name: hirehub-backend
Environment: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Instance Type: Free (or Starter for production)
```

#### **2.3 Environment Variables**
Add these environment variables in Render dashboard:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Database (use the URL from Phase 1)
DATABASE_URL=postgresql://hirehub_user:password@dpg-xxxxx-a.oregon-postgres.render.com/hirehub_production

# Security
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
JWT_EXPIRES_IN=7d

# Email Service
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Chat Encryption
CHAT_ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Payment Gateway
CHAPA_SECRET_KEY=CHASECK_LIVE-your_production_secret_key
CHAPA_PUBLIC_KEY=CHAPUBK_LIVE-your_production_public_key

# Application URLs (update after deployment)
FRONTEND_URL=https://hirehub-ethiopia.onrender.com
BACKEND_URL=https://hirehub-backend.onrender.com
AUTH_HUB_URL=https://hirehub-auth.onrender.com
EMPLOYER_PORTAL_URL=https://hirehub-employer.onrender.com
ADMIN_PORTAL_URL=https://hirehub-admin.onrender.com

# CORS Configuration
CORS_ORIGINS=https://hirehub-ethiopia.onrender.com,https://hirehub-backend.onrender.com,https://hirehub-auth.onrender.com,https://hirehub-employer.onrender.com,https://hirehub-admin.onrender.com
```

#### **2.4 Deploy Backend**
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. **Copy the service URL** (e.g., `https://hirehub-backend.onrender.com`)

---

### **Phase 3: Frontend Services Deployment**

#### **3.1 Job Seeker Portal**
1. Create new **"Static Site"** on Render
2. Configure:
   ```
   Name: hirehub-jobseeker
   Build Command: cd Frontend/USER\(dagi\) && npm install && npm run build
   Publish Directory: Frontend/USER\(dagi\)/dist
   ```
3. Add environment variables:
   ```env
   VITE_AUTH_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_JOBS_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_AUTH_HUB_URL=https://hirehub-auth.onrender.com
   ```

#### **3.2 Employer Portal**
1. Create new **"Static Site"** on Render
2. Configure:
   ```
   Name: hirehub-employer
   Build Command: cd Frontend/employer-connect-pro-main && npm install && npm run build
   Publish Directory: Frontend/employer-connect-pro-main/dist
   ```
3. Add environment variables:
   ```env
   VITE_AUTH_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_JOBS_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_AUTH_HUB_URL=https://hirehub-auth.onrender.com
   ```

#### **3.3 Auth Hub**
1. Create new **"Static Site"** on Render
2. Configure:
   ```
   Name: hirehub-auth
   Build Command: cd Frontend/seekr-companion-main && npm install && npm run build
   Publish Directory: Frontend/seekr-companion-main/dist
   ```
3. Add environment variables:
   ```env
   VITE_AUTH_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_JOBS_API_BASE_URL=https://hirehub-backend.onrender.com
   VITE_AUTH_HUB_URL=https://hirehub-auth.onrender.com
   ```

#### **3.4 Admin Panel**
1. Create new **"Web Service"** on Render
2. Configure:
   ```
   Name: hirehub-admin
   Environment: Node
   Build Command: cd admin && npm install && npm run build
   Start Command: cd admin && npm start
   ```
3. Add environment variables:
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_AUTH_API_BASE_URL=https://hirehub-backend.onrender.com
   NEXT_PUBLIC_JOBS_API_BASE_URL=https://hirehub-backend.onrender.com
   NEXT_PUBLIC_ADMIN_API_BASE_URL=https://hirehub-backend.onrender.com
   NEXT_PUBLIC_PAYMENT_API_BASE_URL=https://hirehub-backend.onrender.com
   NEXT_PUBLIC_AUTH_HUB_URL=https://hirehub-auth.onrender.com
   ```

---

### **Phase 4: Update URLs and Test**

#### **4.1 Update Environment Variables**
After all services are deployed, update the URLs in each service:

1. **Backend Service** → Environment Variables:
   ```env
   FRONTEND_URL=https://hirehub-jobseeker.onrender.com
   BACKEND_URL=https://hirehub-backend.onrender.com
   AUTH_HUB_URL=https://hirehub-auth.onrender.com
   EMPLOYER_PORTAL_URL=https://hirehub-employer.onrender.com
   ADMIN_PORTAL_URL=https://hirehub-admin.onrender.com
   ```

2. **Update CORS_ORIGINS** in backend:
   ```env
   CORS_ORIGINS=https://hirehub-jobseeker.onrender.com,https://hirehub-backend.onrender.com,https://hirehub-auth.onrender.com,https://hirehub-employer.onrender.com,https://hirehub-admin.onrender.com
   ```

#### **4.2 Test Your Deployment**
1. **Backend API**: `https://hirehub-backend.onrender.com/health`
2. **Auth Hub**: `https://hirehub-auth.onrender.com`
3. **Job Seeker Portal**: `https://hirehub-jobseeker.onrender.com`
4. **Employer Portal**: `https://hirehub-employer.onrender.com`
5. **Admin Panel**: `https://hirehub-admin.onrender.com`

---

## 🔧 **Post-Deployment Configuration**

### **Database Migration**
The database will be automatically migrated when the backend starts. Check the logs to ensure:
- ✅ Database connection successful
- ✅ Tables created successfully
- ✅ Initial data seeded

### **Create Admin User**
1. Go to your backend service logs
2. Look for the admin user creation command
3. Or run: `npm run seed:admin` in the backend service

### **Test Complete Flow**
1. **Register as Employer** on Auth Hub
2. **Register as Job Seeker** on Auth Hub
3. **Post a Job** (as employer)
4. **Apply to Job** (as job seeker)
5. **Test Chat** functionality
6. **Test Payment** integration

---

## 📊 **Render Service Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Hub      │    │  Job Seeker     │    │  Employer       │
│   (Static)      │    │   Portal        │    │   Portal        │
│                 │    │   (Static)      │    │   (Static)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   (Web Service) │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

---

## 💰 **Render Pricing**

### **Free Tier (Perfect for Testing)**
- ✅ **Web Services**: 750 hours/month
- ✅ **Static Sites**: Unlimited
- ✅ **PostgreSQL**: 1GB storage
- ✅ **Custom domains**: Supported
- ✅ **SSL certificates**: Automatic

### **Starter Plan ($7/month)**
- ✅ **Always-on services**
- ✅ **Better performance**
- ✅ **Priority support**
- ✅ **Larger database**

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

#### **Database Connection Issues**
- Verify DATABASE_URL is correct
- Check database service is running
- Ensure SSL is enabled

#### **CORS Errors**
- Update CORS_ORIGINS with correct URLs
- Check frontend environment variables
- Verify backend CORS configuration

#### **Service Not Starting**
- Check environment variables
- Verify start command
- Check service logs

### **Performance Optimization**
- Use **Starter plan** for production
- Enable **connection pooling**
- Monitor **database performance**
- Set up **monitoring alerts**

---

## 🎉 **Success!**

Your HireHub Ethiopia platform is now live on Render! 

### **Access Your Application:**
- **Main Entry Point**: `https://hirehub-auth.onrender.com`
- **Job Seeker Portal**: `https://hirehub-jobseeker.onrender.com`
- **Employer Portal**: `https://hirehub-employer.onrender.com`
- **Admin Panel**: `https://hirehub-admin.onrender.com`
- **Backend API**: `https://hirehub-backend.onrender.com`

### **Next Steps:**
1. **Test all functionality**
2. **Set up custom domain** (optional)
3. **Configure monitoring**
4. **Set up automated backups**
5. **Scale as needed**

**Welcome to production! 🇪🇹**
