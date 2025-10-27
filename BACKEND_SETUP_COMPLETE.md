# ✅ HireHub Ethiopia - Backend Setup Complete

## 🎉 What Was Done

### 1. **Removed Mock Data Banners**
- ✅ Removed development/testing banners from Seekr Companion (Login & Signup pages)
- ✅ Removed development banner from Employer Connect Pro
- ✅ User Portal was already clean (no banners to remove)

### 2. **Fixed Backend Authentication**
- ✅ Updated Jobs Service auth middleware to use JWT tokens instead of custom headers
- ✅ Added `jsonwebtoken` package to Jobs Service dependencies
- ✅ Created environment configuration guide for Jobs Service

### 3. **Backend Integration Ready**
All endpoints are now properly configured for the complete flow:

#### **Job Posting Flow (Employer → User Portal)**
- ✅ `POST /api/jobs` - Employer creates job (requires JWT auth)
- ✅ `GET /api/jobs` - Users can see approved jobs
- ✅ `PUT /admin/jobs/:id/approve` - Admin approves job

#### **Application Flow (User → Employer)**
- ✅ `POST /api/jobs/:id/apply` - User applies to job (requires JWT auth)
- ✅ `GET /api/jobs/:id/applications` - Employer views applications
- ✅ `PUT /api/applications/:id/status` - Employer updates application status

---

## 🚀 How to Start the System

### **Step 1: Setup Environment Files**

#### **Jobs Service (.env)**
Create `backend/NodeJS/.env` with this content:
```env
PORT=4001
NODE_ENV=development
JWT_SECRET=your-super-secure-jwt-secret-key
ALLOWED_ORIGINS=http://localhost:3002,http://localhost:8081,http://localhost:3000,http://localhost:3001
```

#### **Auth Service (.env)**
Make sure `backend/nodejs_Hibr/.env` has:
```env
PORT=4000
JWT_SECRET=your-super-secure-jwt-secret-key
```

**⚠️ IMPORTANT:** Both services must use the **same JWT_SECRET**!

### **Step 2: Install Dependencies**

```bash
# Jobs Service
cd backend/NodeJS
npm install

# Auth Service
cd backend/nodejs_Hibr
npm install

# Employer Portal
cd Frontend/employer-connect-pro-main
npm install

# User Portal
cd Frontend/USER(dagi)
npm install

# Seekr Companion
cd Frontend/seekr-companion-main
npm install
```

### **Step 3: Start All Services**

**Option A: Use the startup script** (Recommended)
```bash
# Windows
.\start-hirehub.bat

# Linux/Mac
chmod +x start-hirehub.sh
./start-hirehub.sh
```

**Option B: Start services manually**
```bash
# Terminal 1: Auth Service
cd backend/nodejs_Hibr
npm start

# Terminal 2: Jobs Service
cd backend/NodeJS
npm start

# Terminal 3: Seekr Companion (Auth Hub)
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

## 🧪 Testing the Complete Flow

### **Test Scenario: Employer Posts Job → User Applies → Employer Views Application**

#### **Step 1: Register an Employer Account**
1. Go to: **http://localhost:3002** (Seekr Companion)
2. Click **Sign Up**
3. Fill in the form:
   - First Name: John
   - Last Name: Employer
   - Email: `employer@gmail.com` (must end with @gmail.com)
   - Password: `password123`
   - Role: **Employer**
4. Accept terms and **Create Account**
5. Verify your email (check console for OTP if email service is not configured)
6. You'll be redirected to **http://localhost:3000** (Employer Portal)

#### **Step 2: Employer Posts a Job**
1. In the Employer Portal (http://localhost:3000)
2. Navigate to **Jobs** section
3. Click **Post New Job**
4. Fill in job details:
   - Title: "Senior Software Engineer"
   - Description: "We are looking for an experienced developer..."
   - Category: "programming"
   - Employment Type: "full-time"
   - Location: "Addis Ababa"
   - Salary: 50000 (ETB)
   - Expiry Date: (Select a future date)
5. Click **Post Job**
6. **Note**: Job status will be "pending" (needs admin approval)

#### **Step 3: Admin Approves the Job**
For now, you can approve jobs directly via API or database:

**Option A: Direct database update (Development)**
```sql
-- Using SQLite database
UPDATE jobs SET status = 'approved' WHERE title = 'Senior Software Engineer';
```

**Option B: Use Admin API endpoint**
```bash
# Get admin JWT token first by logging in as admin
# Then call:
curl -X PUT http://localhost:4001/api/admin/jobs/{job_id}/approve \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

#### **Step 4: Register a Job Seeker Account**
1. Open a **new incognito/private window** (to avoid auth conflicts)
2. Go to: **http://localhost:3002** (Seekr Companion)
3. Click **Sign Up**
4. Fill in the form:
   - First Name: Jane
   - Last Name: Seeker
   - Email: `jobseeker@gmail.com`
   - Password: `password123`
   - Role: **Job Seeker**
5. Accept terms and **Create Account**
6. Verify your email
7. You'll be redirected to **http://localhost:8081** (User Portal)

#### **Step 5: Job Seeker Views and Applies**
1. In the User Portal (http://localhost:8081)
2. You should see the **"Senior Software Engineer"** job in the listings
3. Click on the job to view details
4. Click **Apply** button
5. Fill in application form:
   - Cover Letter: Write a brief cover letter
   - Upload Resume (optional for now)
6. Click **Submit Application**
7. You'll see a success message

#### **Step 6: Employer Views Application**
1. Switch back to Employer Portal (http://localhost:3000)
2. Navigate to **Applications** section
3. You should see Jane's application for the "Senior Software Engineer" position
4. Click to view application details
5. You can update the status:
   - **Shortlisted** - Mark for further review
   - **Accepted** - Offer the position
   - **Rejected** - Decline the application

---

## 📋 API Endpoints Reference

### **Authentication** (Port 4000)
```
POST /auth/register    - Register new user
POST /auth/login       - Login user
POST /auth/verify-email - Verify email with OTP
GET  /users/me         - Get current user profile
```

### **Jobs** (Port 4001)
```
GET    /api/jobs                      - List all approved jobs (public)
GET    /api/jobs/:id                  - Get job details
POST   /api/jobs                      - Create job (employer only)
PUT    /api/jobs/:id                  - Update job (employer only)
DELETE /api/jobs/:id                  - Delete job (employer only)
```

### **Applications** (Port 4001)
```
POST /api/jobs/:id/apply             - Apply to job (job seeker only)
GET  /api/jobs/:id/applications      - Get job applications (employer only)
PUT  /api/applications/:id/status    - Update application status (employer only)
```

### **Admin** (Port 4001)
```
GET  /api/admin/jobs                  - List all jobs
PUT  /api/admin/jobs/:id/approve      - Approve/reject job
GET  /api/admin/reports               - List reports
PUT  /api/admin/reports/:id/resolve   - Resolve report
```

---

## 🔑 Authentication Flow

### **1. How JWT Tokens Work**
```
User logs in → Backend generates JWT token → Token contains {id, role, email}
→ Frontend stores token → All API calls include token in header
→ Backend verifies token → Extracts user info → Processes request
```

### **2. Token Format**
```javascript
// JWT Payload
{
  id: "user-uuid",
  role: "employer" | "job_seeker" | "admin",
  email: "user@example.com",
  iat: 1234567890,  // Issued at
  exp: 1237246290   // Expires (30 days later)
}
```

### **3. How Frontends Send Tokens**
```javascript
// All API calls include this header:
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## 🔍 Troubleshooting

### **Problem: "Invalid or expired token" error**
**Solution**: Make sure both Auth Service and Jobs Service use the **same JWT_SECRET** in their .env files.

### **Problem: Jobs don't appear in User Portal**
**Causes**:
1. Job status is still "pending" (needs admin approval)
2. Jobs Service is not running
3. CORS error (check browser console)

**Solutions**:
1. Approve the job manually or via admin API
2. Start Jobs Service: `cd backend/NodeJS && npm start`
3. Check CORS configuration in backend

### **Problem: Application submission fails**
**Causes**:
1. User not logged in
2. Job is not approved
3. User already applied to this job

**Solutions**:
1. Make sure you're logged in as a job seeker
2. Check job status is "approved"
3. Each user can only apply once per job

### **Problem: CORS errors in browser console**
**Solution**: Make sure backend CORS configuration includes your frontend origins:
```javascript
// In backend/NodeJS/app.js
const corsOptions = {
  origin: [
    'http://localhost:3002',  // Seekr Companion
    'http://localhost:8081',  // User Portal
    'http://localhost:3000',  // Employer Portal
    'http://localhost:3001'   // Admin Panel
  ],
  credentials: true
};
```

---

## 📊 Database Schema

### **Jobs Table**
```sql
- id (UUID, Primary Key)
- employer_id (UUID, Foreign Key → EmployerProfiles)
- title (VARCHAR)
- description (TEXT)
- requirements (TEXT)
- category (VARCHAR)
- employment_type (ENUM: full-time, part-time, contract, internship)
- location (VARCHAR)
- salary (DECIMAL)
- expiry_date (DATE)
- listing_type (ENUM: free, premium)
- status (ENUM: pending, approved, rejected, closed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Applications Table**
```sql
- id (UUID, Primary Key)
- job_id (UUID, Foreign Key → Jobs)
- user_id (UUID, Foreign Key → Users)
- resume (VARCHAR - file path)
- cover_letter (TEXT)
- status (ENUM: submitted, shortlisted, accepted, rejected)
- applied_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🎯 Next Steps

### **Immediate Improvements**
1. **Admin Panel Integration**: Connect admin panel to approve jobs
2. **Email Notifications**: Send emails when:
   - Job is posted
   - Application is submitted
   - Application status changes
3. **File Uploads**: Implement resume/document upload functionality
4. **Real-time Updates**: Add WebSocket for live notifications

### **Production Readiness**
1. **Database**: Switch from SQLite to PostgreSQL
2. **Environment Secrets**: Use secure secret management
3. **SSL/HTTPS**: Configure HTTPS for all services
4. **Rate Limiting**: Add API rate limiting
5. **Logging**: Implement comprehensive logging
6. **Monitoring**: Add health checks and alerting
7. **Backup**: Automated database backups

---

## ✨ Summary

You now have a **fully functional backend** with:
- ✅ JWT-based authentication
- ✅ Job posting by employers
- ✅ Job listing for all users
- ✅ Application submission by job seekers
- ✅ Application management by employers
- ✅ Admin approval workflow
- ✅ Proper role-based access control
- ✅ Clean frontend (no mock data banners)

The system is ready for development and testing! 🚀

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the backend terminal for error logs
3. Verify all services are running on correct ports
4. Ensure JWT_SECRET matches in all services
5. Check database connections

**Happy coding! 🇪🇹**

