#!/bin/bash
# HireHub Ethiopia - Quick Render Deployment Script
# This script helps you prepare for Render deployment

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         🇪🇹 HIREHUB ETHIOPIA - RENDER DEPLOYMENT PREP 🇪🇹        ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "🚀 Preparing HireHub Ethiopia for Render deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the HireHub Ethiopia root directory"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Create necessary directories
echo "📁 Creating deployment directories..."
mkdir -p deploy/render
mkdir -p deploy/logs
echo "✅ Directories created"
echo ""

# Copy configuration files
echo "📋 Copying configuration files..."
cp render.yaml deploy/render/
cp env.render.example deploy/render/
cp backend/Dockerfile.render deploy/render/
echo "✅ Configuration files copied"
echo ""

# Generate secure keys
echo "🔐 Generating secure keys..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
CHAT_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "Generated JWT Secret: $JWT_SECRET"
echo "Generated Chat Key: $CHAT_KEY"
echo ""

# Create deployment checklist
cat > deploy/DEPLOYMENT_CHECKLIST.md << EOF
# HireHub Ethiopia - Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] Create PostgreSQL database on Render
- [ ] Copy DATABASE_URL
- [ ] Test database connection

### 2. Environment Variables
- [ ] Set NODE_ENV=production
- [ ] Set JWT_SECRET=$JWT_SECRET
- [ ] Set CHAT_ENCRYPTION_KEY=$CHAT_KEY
- [ ] Set DATABASE_URL (from step 1)
- [ ] Set GMAIL_USER and GMAIL_APP_PASSWORD
- [ ] Set CHAPA_SECRET_KEY and CHAPA_PUBLIC_KEY

### 3. Service URLs (update after deployment)
- [ ] FRONTEND_URL=https://your-jobseeker.onrender.com
- [ ] BACKEND_URL=https://your-backend.onrender.com
- [ ] AUTH_HUB_URL=https://your-auth.onrender.com
- [ ] EMPLOYER_PORTAL_URL=https://your-employer.onrender.com
- [ ] ADMIN_PORTAL_URL=https://your-admin.onrender.com

### 4. CORS Configuration
- [ ] Update CORS_ORIGINS with all service URLs

## 🚀 Deployment Steps

### 1. Backend Service
1. Go to https://dashboard.render.com/web/new
2. Create "Web Service"
3. Connect GitHub repository: Hibritu/last-hire
4. Configure:
   - Name: hirehub-backend
   - Build Command: cd backend && npm install
   - Start Command: cd backend && npm start
   - Instance Type: Free (or Starter for production)
5. Add environment variables from checklist
6. Deploy and copy service URL

### 2. Frontend Services
Repeat for each frontend service:
- Job Seeker Portal (Static Site)
- Employer Portal (Static Site)
- Auth Hub (Static Site)
- Admin Panel (Web Service)

### 3. Update URLs
After all services are deployed, update URLs in backend environment variables.

## 🧪 Testing
- [ ] Test backend health: https://your-backend.onrender.com/health
- [ ] Test auth hub: https://your-auth.onrender.com
- [ ] Test job seeker portal: https://your-jobseeker.onrender.com
- [ ] Test employer portal: https://your-employer.onrender.com
- [ ] Test admin panel: https://your-admin.onrender.com

## 📊 Monitoring
- [ ] Check service logs
- [ ] Monitor database performance
- [ ] Set up alerts for downtime
- [ ] Test payment integration

## 🎉 Success!
Your HireHub Ethiopia platform is now live on Render!
EOF

echo "📋 Deployment checklist created: deploy/DEPLOYMENT_CHECKLIST.md"
echo ""

# Create quick start script
cat > deploy/quick-start.sh << 'EOF'
#!/bin/bash
# Quick start script for Render deployment

echo "🚀 HireHub Ethiopia - Quick Render Start"
echo "========================================"
echo ""
echo "1. Go to https://dashboard.render.com/web/new"
echo "2. Create PostgreSQL database"
echo "3. Create Web Service for backend"
echo "4. Create Static Sites for frontend"
echo "5. Follow the checklist in DEPLOYMENT_CHECKLIST.md"
echo ""
echo "📋 Open deploy/DEPLOYMENT_CHECKLIST.md for detailed steps"
echo ""
EOF

chmod +x deploy/quick-start.sh
echo "✅ Quick start script created"
echo ""

# Create environment template
cat > deploy/render-env-template.env << EOF
# HireHub Ethiopia - Render Environment Template
# Copy these to your Render service environment variables

NODE_ENV=production
PORT=10000

# Database (replace with your actual DATABASE_URL)
DATABASE_URL=postgresql://hirehub_user:password@dpg-xxxxx-a.oregon-postgres.render.com/hirehub_production

# Security (use the generated keys above)
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
CHAT_ENCRYPTION_KEY=$CHAT_KEY

# Email Service
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Payment Gateway
CHAPA_SECRET_KEY=CHASECK_LIVE-your_production_secret_key
CHAPA_PUBLIC_KEY=CHAPUBK_LIVE-your_production_public_key

# Application URLs (update after deployment)
FRONTEND_URL=https://hirehub-jobseeker.onrender.com
BACKEND_URL=https://hirehub-backend.onrender.com
AUTH_HUB_URL=https://hirehub-auth.onrender.com
EMPLOYER_PORTAL_URL=https://hirehub-employer.onrender.com
ADMIN_PORTAL_URL=https://hirehub-admin.onrender.com

# CORS Configuration
CORS_ORIGINS=https://hirehub-jobseeker.onrender.com,https://hirehub-backend.onrender.com,https://hirehub-auth.onrender.com,https://hirehub-employer.onrender.com,https://hirehub-admin.onrender.com
EOF

echo "✅ Environment template created: deploy/render-env-template.env"
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                     ✅ DEPLOYMENT PREP COMPLETE!                 ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo "1. Open deploy/DEPLOYMENT_CHECKLIST.md"
echo "2. Follow the step-by-step instructions"
echo "3. Go to https://dashboard.render.com/web/new"
echo "4. Start with the PostgreSQL database"
echo ""
echo "🔗 Useful Links:"
echo "   • Render Dashboard: https://dashboard.render.com/web/new"
echo "   • Your Repository: https://github.com/Hibritu/last-hire"
echo "   • Deployment Guide: RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Ready to deploy to Render!"
echo ""
