# 🚀 HireHub Ethiopia - Quick Start Guide

## ⚡ Get Started in 5 Minutes!

---

## Step 1: Create Environment Files (2 minutes)

### **Auth Service**
Create `backend/nodejs_Hibr/.env`:
```env
PORT=4000
JWT_SECRET=your-super-secure-jwt-secret-key
NODE_ENV=development
```

### **Jobs Service**
Create `backend/NodeJS/.env`:
```env
PORT=4001
JWT_SECRET=your-super-secure-jwt-secret-key
NODE_ENV=development
```

**⚠️ IMPORTANT:** Both JWT_SECRET values **must be identical**!

---

## Step 2: Install Dependencies (2 minutes)

```bash
# Jobs Service (includes jsonwebtoken)
cd backend/NodeJS
npm install

# If Auth Service not installed yet
cd backend/nodejs_Hibr
npm install
```

---

## Step 3: Start Everything (1 minute)

### **Option A: Automatic (Recommended)**
```bash
# Windows
.\start-hirehub.bat

# Mac/Linux
chmod +x start-hirehub.sh
./start-hirehub.sh
```

### **Option B: Manual**
Open 5 terminals:

```bash
# Terminal 1: Auth Service
cd backend/nodejs_Hibr
npm start

# Terminal 2: Jobs Service
cd backend/NodeJS
npm start

# Terminal 3: Seekr Companion
cd Frontend/seekr-companion-main
npm run dev -- --port 3002

# Terminal 4: User Portal
cd Frontend/USER(dagi)
npm run dev -- --port 8081

# Terminal 5: Employer Portal
cd Frontend/employer-connect-pro-main
npm run dev -- --port 3000
```

---

## Step 4: Test the System! 🎉

### **Test 1: Register Employer**
1. Go to http://localhost:3002
2. Click **Sign Up**
3. Fill form:
   - Name: John Employer
   - Email: `employer@gmail.com` (must be @gmail.com)
   - Password: `password123`
   - Role: **Employer**
4. Click **Create Account**
5. You'll redirect to http://localhost:3000 (Employer Portal)

### **Test 2: Post a Job**
1. In Employer Portal, click **Jobs**
2. Click **Post New Job**
3. Fill in:
   - Title: "Software Developer"
   - Description: "Looking for a talented developer..."
   - Category: "programming"
   - Type: "full-time"
   - Location: "Addis Ababa"
   - Salary: 50000
   - Expiry Date: (future date)
4. Click **Post Job**

### **Test 3: Approve Job (Temporary Manual Step)**
Open database file `backend/NodeJS/database_jobs.sqlite` and run:
```sql
UPDATE jobs SET status = 'approved' WHERE title = 'Software Developer';
```

Or use a SQLite browser tool like DB Browser for SQLite.

### **Test 4: Register Job Seeker**
1. Open **new incognito/private window**
2. Go to http://localhost:3002
3. Click **Sign Up**
4. Fill form:
   - Name: Jane Seeker
   - Email: `seeker@gmail.com`
   - Password: `password123`
   - Role: **Job Seeker**
5. Click **Create Account**
6. You'll redirect to http://localhost:8081 (User Portal)

### **Test 5: Apply to Job**
1. You should see "Software Developer" job in the list
2. Click on the job
3. Click **Apply**
4. Write a cover letter
5. Click **Submit Application**
6. Success! ✅

### **Test 6: View Application**
1. Switch back to Employer window (http://localhost:3000)
2. Go to **Applications** section
3. You should see Jane's application!
4. Try changing status: **Shortlisted**, **Accepted**, or **Rejected**

---

## ✅ Success Indicators

You'll know everything is working when:
- ✅ No mock data banners appear
- ✅ Login redirects to correct portal based on role
- ✅ Jobs appear in user portal after posting
- ✅ Applications appear in employer portal after applying
- ✅ No 401 "Unauthorized" errors in console

---

## 🐛 Quick Troubleshooting

### **Problem: "Invalid or expired token"**
**Fix:** Check JWT_SECRET matches in both .env files

### **Problem: Jobs don't appear in User Portal**
**Fix:** Make sure job status is 'approved' (not 'pending')

### **Problem: CORS errors**
**Fix:** Check all services are running on correct ports

### **Problem: Application submit fails**
**Fix:** Make sure you're logged in as job_seeker role

---

## 📍 Quick Reference

### **Access Points**
- **Auth Hub**: http://localhost:3002
- **User Portal**: http://localhost:8081
- **Employer Portal**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

### **Backend Services**
- **Auth API**: http://localhost:4000
- **Jobs API**: http://localhost:4001
- **Payment API**: http://localhost:8080

### **Test Accounts**
- **Employer**: employer@gmail.com / password123
- **Job Seeker**: seeker@gmail.com / password123
- **Admin**: admin@gmail.com / password123

---

## 🎯 What You Can Do Now

### **As Employer:**
- ✅ Post jobs
- ✅ View applications
- ✅ Update application status (shortlist/accept/reject)
- ✅ Manage job listings
- ✅ View applicant details

### **As Job Seeker:**
- ✅ Browse jobs
- ✅ Apply to jobs
- ✅ Track application status
- ✅ View job details
- ✅ Search and filter jobs

### **As Admin:**
- ✅ Approve/reject jobs
- ✅ Manage users
- ✅ View reports
- ✅ Monitor platform activity

---

## 📚 More Information

- **Complete Setup Guide**: `BACKEND_SETUP_COMPLETE.md`
- **Changes Made**: `CHANGES_SUMMARY.md`
- **API Documentation**: Check `/api/docs` on Jobs Service

---

## 🎉 You're Ready!

The system is now fully functional with:
- ✅ Clean interfaces (no mock messages)
- ✅ Real backend integration
- ✅ JWT authentication
- ✅ Complete data flow

Start building amazing features! 🚀🇪🇹

