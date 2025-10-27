# HireHub-Ethiopia Endpoints Analysis

## Complete Endpoint Inventory

This document provides a comprehensive analysis of all endpoints across the HireHub-Ethiopia project, including backend APIs and frontend application structure.

## Backend Endpoints

### 1. NodeJS Backend (Port: 4000)
**Base URL**: `http://localhost:4000`

#### Jobs Endpoints (`/api/jobs`)
- **GET** `/api/jobs` - List jobs with filtering
  - Query params: `q`, `category`, `location`, `type`, `page`, `limit`
  - Auth: Optional (for personalization)
  
- **POST** `/api/jobs` - Create a job (employer only)
  - Auth: Required (employer)
  
- **GET** `/api/jobs/:id` - Get job details
  - Auth: Optional
  
- **PUT** `/api/jobs/:id` - Update a job (employer owner only)
  - Auth: Required (employer, owner)
  
- **DELETE** `/api/jobs/:id` - Delete a job (employer owner only)
  - Auth: Required (employer, owner)

#### Applications Endpoints (`/api`)
- **POST** `/api/jobs/:id/apply` - Apply to a job (job seeker)
  - Auth: Required
  - Body: `{ resume: string, cover_letter: string }`
  
- **GET** `/api/jobs/:id/applications` - List applications for a job (employer owner)
  - Auth: Required (employer, owner)
  
- **PUT** `/api/applications/:id/status` - Update application status (employer owner)
  - Auth: Required (employer, owner)
  - Body: `{ status: "submitted|shortlisted|accepted|rejected" }`

#### Reports Endpoints (`/api`)
- **POST** `/api/jobs/:id/report` - Report a job
  - Auth: Required
  - Body: `{ reason: string }`

#### Admin Endpoints (`/api/admin`)
- **PUT** `/api/admin/employers/:id/verify` - Verify or reject an employer
  - Auth: Required (admin)
  - Body: `{ status: "verified|rejected" }`
  
- **GET** `/api/admin/jobs` - List jobs for moderation
  - Auth: Required (admin)
  - Query params: `status` (pending|approved|rejected|closed)
  
- **PUT** `/api/admin/jobs/:id/approve` - Update job moderation status
  - Auth: Required (admin)
  - Body: `{ status: "approved|rejected|pending|closed" }`
  
- **GET** `/api/admin/reports` - List user reports
  - Auth: Required (admin)
  - Query params: `status` (pending|reviewed|resolved)
  
- **PUT** `/api/admin/reports/:id/resolve` - Update report status
  - Auth: Required (admin)
  - Body: `{ status: "reviewed|resolved" }`

#### Health Check
- **GET** `/health` - Health check endpoint

#### Documentation
- **GET** `/api/docs` - Swagger API documentation

### 2. NodeJS (Hibr) Backend (Port: 4000)
**Base URL**: `http://localhost:4000`

#### Authentication Endpoints (`/auth`)
- **POST** `/auth/register` - User registration
  - Body: `{ role, email, phone, password, first_name, last_name }`
  - Validation: Gmail-only emails, role must be 'job_seeker' or 'employer'
  
- **POST** `/auth/login` - User login
  - Body: `{ email, password }`
  
- **POST** `/auth/forgot-password` - Request password reset
  - Body: `{ email }`
  
- **GET** `/auth/reset-password` - Serve password reset form
  
- **POST** `/auth/reset-password` - Reset password
  - Body: `{ token, password }`
  
- **POST** `/auth/verify-email` - Verify email with OTP
  - Body: `{ email, otp }`
  
- **GET** `/auth/debug-otp` - Debug endpoint for OTP (development only)
  - Query: `email`

#### User Endpoints (`/users`)
- **GET** `/users/me` - Get current user profile
  - Auth: Required (job_seeker, employer, admin)
  
- **PUT** `/users/me` - Update user profile with file uploads
  - Auth: Required (job_seeker, employer)
  - Supports: Resume upload (PDF), Profile picture upload (images)
  - Body: Can include `gender`, `education`, `skills`, `experience`, `preferred_categories`, `preferred_locations`

#### Employer Endpoints (`/employers`)
- **GET** `/employers/me` - Get employer profile
  - Auth: Required (employer, admin)
  
- **PUT** `/employers/me` - Update employer profile
  - Auth: Required (employer)
  
- **GET** `/employers/me/status` - Get employer verification status
  - Auth: Required (employer, admin)

#### Health & Info
- **GET** `/` - API information endpoint
- **GET** `/health` - Health check endpoint
- **GET** `/api/docs` - Swagger documentation

#### Static Files
- **GET** `/uploads/*` - Serve uploaded files (resumes, pictures, licenses)

### 3. Go Backend (Payment Service)
**Base URL**: `http://localhost:PORT` (configurable)

#### Payment Endpoints
- **POST** `/payments/initiate` - Initiate payment
  - Body: `{ job_id, employer_id, amount, currency, email, first_name, last_name }`
  
- **POST** `/payments/confirm` - Confirm payment (POST)
  - Body: `{ tx_ref }`
  
- **GET** `/payments/confirm` - Confirm payment (GET callback)
  - Query: `tx_ref`

#### Health Checks
- **GET** `/healthz` - Basic health check
- **GET** `/readyz` - Database readiness check

## Frontend Applications

### 1. Employer Frontend (React - Letera)
**Path**: `Frontend/Employer(letera)`
**Port**: Typically 3000

#### Current Status: 
- **No Active API Integration**: Currently uses mock data
- **Placeholder Endpoints**: Comments indicate where API calls should be implemented

#### Pages & Components:
- `EmployerDashboard.jsx` - Main dashboard (mock data only)
- `JobPostingForm.jsx` - Job creation form (no API integration)
- `JobManagement.jsx` - Job management interface (no API integration)
- `Applications.jsx` - Application management (no API integration)
- `EmployerProfile.jsx` - Profile management (no API integration)
- `EmployerChat.jsx` - Chat interface (no API integration)
- `PaymentPage.jsx` - Payment processing (no API integration)
- `Notifications.jsx` - Notifications system (no API integration)

#### Required API Integrations:
- Job CRUD operations → NodeJS backend `/api/jobs`
- Application management → NodeJS backend `/api/applications`
- Payment processing → Go backend `/payments`
- Profile management → NodeJS(Hibr) backend `/employers`

### 2. User Frontend (React/TypeScript - Dagi)
**Path**: `Frontend/USER(dagi)`
**Port**: Typically 5173 (Vite)

#### Current Status:
- **No Active API Integration**: All components use mock data or placeholders
- **TODO Comments**: Extensive TODO comments indicating where API calls need implementation

#### Key Pages:
- `JobDetails.tsx` - Job details view (TODO: API integration)
- `BrowseJobs.tsx` - Job browsing interface (TODO: API integration)
- `MyApplications.tsx` - User applications dashboard (TODO: API integration)
- `Profile.tsx` - User profile management (TODO: API integration)
- `Index.tsx` - Homepage with job listings (TODO: API integration)

#### Required API Integrations:
- Job browsing → NodeJS backend `/api/jobs`
- Job applications → NodeJS backend `/api/jobs/:id/apply`
- User profile → NodeJS(Hibr) backend `/users`
- Authentication → NodeJS(Hibr) backend `/auth`

### 3. Admin Panel (Next.js)
**Path**: `admin`
**Port**: Typically 3000 (Next.js)

#### Current Status:
- **No Active API Integration**: Uses mock/placeholder data
- **Dashboard Only**: Basic dashboard with static metrics

#### Pages:
- `Dashboard` (`page.js`) - Admin dashboard with metrics (no API integration)

#### Required API Integrations:
- Admin operations → NodeJS backend `/api/admin/*`
- User management → NodeJS(Hibr) backend
- System monitoring → Multiple backends

### 4. Seekr Companion (React/TypeScript)
**Path**: `seekr-companion-main`
**Port**: Typically 5173 (Vite)

#### Current Status:
- **No Active API Integration**: Static pages only
- **Landing Page Focus**: Primarily marketing/landing pages

#### Pages:
- `Landing.tsx` - Landing page
- `About.tsx` - About page
- `Login.tsx` - Login page (no API integration)
- `Signup.tsx` - Signup page (no API integration)

#### Required API Integrations:
- Authentication → NodeJS(Hibr) backend `/auth`
- Job data → NodeJS backend `/api/jobs`

## Summary

### Active Backend Endpoints: 
- **NodeJS Backend**: 15 endpoints (Jobs, Applications, Reports, Admin)
- **NodeJS(Hibr) Backend**: 10 endpoints (Auth, Users, Employers)
- **Go Backend**: 5 endpoints (Payments, Health checks)
- **Total**: 30 active backend endpoints

### Frontend API Integration Status:
- **Employer Frontend**: 0% integrated (all mock data)
- **User Frontend**: 0% integrated (all TODOs)
- **Admin Panel**: 0% integrated (static dashboard)
- **Seekr Companion**: 0% integrated (static pages)

### Critical Integration Points:
1. **Authentication Flow**: All frontends need to connect to NodeJS(Hibr) `/auth` endpoints
2. **Job Management**: Employer frontend needs NodeJS `/api/jobs` integration
3. **Job Browsing**: User frontend needs NodeJS `/api/jobs` integration
4. **Payment Processing**: Employer frontend needs Go backend `/payments` integration
5. **Admin Operations**: Admin panel needs NodeJS `/api/admin` integration

### Recommendations:
1. **Priority 1**: Implement authentication across all frontends
2. **Priority 2**: Connect job-related functionality between frontends and NodeJS backend
3. **Priority 3**: Integrate payment system with Go backend
4. **Priority 4**: Connect admin panel with backend admin endpoints
5. **Priority 5**: Implement file upload functionality for resumes and profile pictures

### Missing Implementations:
- No frontend applications are currently making HTTP requests to backend APIs
- All frontend applications contain placeholder/mock data
- Extensive TODO comments indicate planned but unimplemented API integrations
- Authentication flows are not connected between frontend and backend systems

## 📋 COMPREHENSIVE TODO LIST - LINKING ALL APPLICATIONS

### Phase 1: Foundation Setup (Critical)

#### 1.1 Environment Configuration
- [ ] **Create unified environment configuration**
  - [ ] Set up `.env` files for all applications with consistent API URLs
  - [ ] Configure CORS settings in all backend services
  - [ ] Set up proxy configurations in frontend development servers
  - [ ] Document port assignments and service discovery

#### 1.2 HTTP Client Setup
- [ ] **Install HTTP clients in all frontends**
  - [ ] Add axios to Employer frontend: `npm install axios`
  - [ ] Add axios to User frontend: `npm install axios`
  - [ ] Add axios to Admin panel: `npm install axios`
  - [ ] Add axios to Seekr Companion: `npm install axios`

#### 1.3 API Client Libraries
- [ ] **Create reusable API client libraries**
  - [ ] `Frontend/Employer(letera)/src/api/client.js` - Axios instance with base config
  - [ ] `Frontend/USER(dagi)/src/lib/api.ts` - TypeScript API client
  - [ ] `admin/src/lib/api.ts` - Admin API client
  - [ ] `seekr-companion-main/src/lib/api.ts` - Companion API client

### Phase 2: Authentication Integration (High Priority)

#### 2.1 Authentication Service
- [ ] **Create auth service for each frontend**
  - [ ] `Frontend/Employer(letera)/src/services/authService.js`
    - [ ] `login(email, password)` → `/auth/login`
    - [ ] `register(userData)` → `/auth/register`
    - [ ] `logout()` - Clear tokens
    - [ ] `forgotPassword(email)` → `/auth/forgot-password`
    - [ ] `resetPassword(token, password)` → `/auth/reset-password`
  - [ ] `Frontend/USER(dagi)/src/services/authService.ts` (Same functions)
  - [ ] `admin/src/services/authService.ts` (Same functions)
  - [ ] `seekr-companion-main/src/services/authService.ts` (Same functions)

#### 2.2 Token Management
- [ ] **Implement JWT token handling**
  - [ ] Create token storage utilities (localStorage/sessionStorage)
  - [ ] Add axios interceptors for automatic token attachment
  - [ ] Implement token refresh logic
  - [ ] Add automatic logout on token expiration

#### 2.3 Authentication Context/State
- [ ] **Create authentication state management**
  - [ ] `Frontend/Employer(letera)/src/contexts/AuthContext.jsx`
  - [ ] `Frontend/USER(dagi)/src/contexts/AuthContext.tsx`
  - [ ] `admin/src/contexts/AuthContext.tsx`
  - [ ] `seekr-companion-main/src/contexts/AuthContext.tsx`

#### 2.4 Protected Routes
- [ ] **Implement route protection**
  - [ ] Create `ProtectedRoute` components for each frontend
  - [ ] Wrap authenticated pages with protection
  - [ ] Implement role-based access control
  - [ ] Add redirect logic for unauthenticated users

### Phase 3: Core API Integration (High Priority)

#### 3.1 User Frontend (dagi) - Job Seeker Integration
- [ ] **Job Service (`Frontend/USER(dagi)/src/services/jobService.ts`)**
  - [ ] `getJobs(filters)` → `GET /api/jobs`
  - [ ] `getJobById(id)` → `GET /api/jobs/:id`
  - [ ] `searchJobs(query, filters)` → `GET /api/jobs?q=...`
  - [ ] `reportJob(jobId, reason)` → `POST /api/jobs/:id/report`

- [ ] **Application Service (`Frontend/USER(dagi)/src/services/applicationService.ts`)**
  - [ ] `applyToJob(jobId, resume, coverLetter)` → `POST /api/jobs/:id/apply`
  - [ ] `getMyApplications()` → Custom endpoint needed
  - [ ] `withdrawApplication(applicationId)` → Custom endpoint needed

- [ ] **User Profile Service (`Frontend/USER(dagi)/src/services/userService.ts`)**
  - [ ] `getProfile()` → `GET /users/me`
  - [ ] `updateProfile(data, files)` → `PUT /users/me`
  - [ ] `uploadResume(file)` → `PUT /users/me` (with file)
  - [ ] `uploadProfilePicture(file)` → `PUT /users/me` (with file)

- [ ] **Update Pages with Real Data**
  - [ ] `pages/BrowseJobs.tsx` - Replace mock data with `jobService.getJobs()`
  - [ ] `pages/JobDetails.tsx` - Replace TODO with `jobService.getJobById()`
  - [ ] `pages/MyApplications.tsx` - Replace mock with `applicationService.getMyApplications()`
  - [ ] `pages/Profile.tsx` - Connect form to `userService.updateProfile()`
  - [ ] `pages/Index.tsx` - Replace mock featured jobs with real data

#### 3.2 Employer Frontend (letera) - Employer Integration
- [ ] **Job Management Service (`Frontend/Employer(letera)/src/services/jobService.js`)**
  - [ ] `createJob(jobData)` → `POST /api/jobs`
  - [ ] `updateJob(jobId, jobData)` → `PUT /api/jobs/:id`
  - [ ] `deleteJob(jobId)` → `DELETE /api/jobs/:id`
  - [ ] `getMyJobs()` → `GET /api/jobs` (filtered by employer)
  - [ ] `getJobApplications(jobId)` → `GET /api/jobs/:id/applications`

- [ ] **Application Management Service (`Frontend/Employer(letera)/src/services/applicationService.js`)**
  - [ ] `updateApplicationStatus(applicationId, status)` → `PUT /api/applications/:id/status`
  - [ ] `getApplicationDetails(applicationId)` → Custom endpoint needed
  - [ ] `downloadResume(applicationId)` → File serving endpoint

- [ ] **Employer Profile Service (`Frontend/Employer(letera)/src/services/employerService.js`)**
  - [ ] `getProfile()` → `GET /employers/me`
  - [ ] `updateProfile(data)` → `PUT /employers/me`
  - [ ] `getVerificationStatus()` → `GET /employers/me/status`
  - [ ] `uploadLicense(file)` → Custom endpoint needed

- [ ] **Payment Service (`Frontend/Employer(letera)/src/services/paymentService.js`)**
  - [ ] `initiatePayment(paymentData)` → `POST /payments/initiate` (Go backend)
  - [ ] `confirmPayment(txRef)` → `GET /payments/confirm` (Go backend)
  - [ ] `getPaymentHistory()` → Custom endpoint needed

- [ ] **Update Components with Real Data**
  - [ ] `components/JobPostingForm.jsx` - Connect to `jobService.createJob()`
  - [ ] `components/JobManagement.jsx` - Connect to `jobService.getMyJobs()`
  - [ ] `components/Applications.jsx` - Connect to `jobService.getJobApplications()`
  - [ ] `components/EmployerProfile.jsx` - Connect to `employerService`
  - [ ] `pages/PaymentPage.jsx` - Connect to `paymentService`
  - [ ] `pages/EmployerDashboard.jsx` - Replace mock data with real metrics

#### 3.3 Admin Panel Integration
- [ ] **Admin Service (`admin/src/services/adminService.ts`)**
  - [ ] `getJobs(status)` → `GET /api/admin/jobs`
  - [ ] `approveJob(jobId, status)` → `PUT /api/admin/jobs/:id/approve`
  - [ ] `getReports(status)` → `GET /api/admin/reports`
  - [ ] `resolveReport(reportId, status)` → `PUT /api/admin/reports/:id/resolve`
  - [ ] `getEmployers()` → Custom endpoint needed
  - [ ] `verifyEmployer(employerId, status)` → `PUT /api/admin/employers/:id/verify`
  - [ ] `getDashboardMetrics()` → Custom endpoint needed

- [ ] **Create Admin Pages**
  - [ ] `app/dashboard/jobs/page.tsx` - Job moderation interface
  - [ ] `app/dashboard/employers/page.tsx` - Employer verification interface
  - [ ] `app/dashboard/reports/page.tsx` - Report management interface
  - [ ] `app/dashboard/users/page.tsx` - User management interface
  - [ ] Update main dashboard with real metrics

### Phase 4: Advanced Features (Medium Priority)

#### 4.1 Real-time Features
- [ ] **Implement WebSocket/SSE for real-time updates**
  - [ ] Add socket.io to backends for real-time notifications
  - [ ] Implement real-time chat system (EmployerChat.jsx)
  - [ ] Add real-time application status updates
  - [ ] Implement real-time admin notifications

#### 4.2 File Upload Enhancement
- [ ] **Improve file upload functionality**
  - [ ] Add drag-and-drop file upload components
  - [ ] Implement file preview and validation
  - [ ] Add progress bars for file uploads
  - [ ] Implement file compression for large uploads

#### 4.3 Search and Filtering
- [ ] **Enhanced search functionality**
  - [ ] Implement elasticsearch or advanced search in backend
  - [ ] Add autocomplete for job search
  - [ ] Implement saved searches
  - [ ] Add advanced filtering options

### Phase 5: Backend API Extensions (Medium Priority)

#### 5.1 Missing Endpoints
- [ ] **Add missing endpoints to backends**
  - [ ] `GET /api/applications/me` - Get user's applications
  - [ ] `GET /api/jobs/my` - Get employer's jobs
  - [ ] `GET /api/admin/dashboard/metrics` - Admin dashboard data
  - [ ] `GET /api/employers/verification` - Employer verification details
  - [ ] `POST /api/employers/license` - License upload
  - [ ] `GET /api/payments/history` - Payment history

#### 5.2 Data Relationships
- [ ] **Ensure proper data relationships**
  - [ ] Add user profile data to job applications
  - [ ] Include employer info in job listings
  - [ ] Add application counts to job listings
  - [ ] Include payment status in job postings

### Phase 6: Testing and Quality Assurance (Medium Priority)

#### 6.1 API Testing
- [ ] **Test all API endpoints**
  - [ ] Create Postman/Insomnia collections for all endpoints
  - [ ] Test authentication flows end-to-end
  - [ ] Verify file upload functionality
  - [ ] Test error handling and edge cases

#### 6.2 Frontend Integration Testing
- [ ] **Test frontend-backend integration**
  - [ ] Test user registration and login flows
  - [ ] Test job posting and application workflows
  - [ ] Test payment processing integration
  - [ ] Test admin moderation workflows

### Phase 7: Performance and Security (Low Priority)

#### 7.1 Performance Optimization
- [ ] **Optimize API performance**
  - [ ] Implement pagination for large datasets
  - [ ] Add caching for frequently accessed data
  - [ ] Optimize database queries
  - [ ] Implement lazy loading for images

#### 7.2 Security Enhancements
- [ ] **Enhance security measures**
  - [ ] Implement rate limiting
  - [ ] Add input validation and sanitization
  - [ ] Implement HTTPS in production
  - [ ] Add API key authentication for service-to-service calls

### Phase 8: Deployment and DevOps (Low Priority)

#### 8.1 Containerization
- [ ] **Create Docker configurations**
  - [ ] Dockerfile for each backend service
  - [ ] Dockerfile for each frontend application
  - [ ] Docker-compose for local development
  - [ ] Docker-compose for production deployment

#### 8.2 CI/CD Pipeline
- [ ] **Set up automated deployment**
  - [ ] GitHub Actions for automated testing
  - [ ] Automated deployment to staging
  - [ ] Automated deployment to production
  - [ ] Environment-specific configurations

## 🚀 Implementation Priority Order

1. **Week 1-2**: Phase 1 (Foundation) + Phase 2 (Authentication)
2. **Week 3-4**: Phase 3.1 (User Frontend Integration)
3. **Week 5-6**: Phase 3.2 (Employer Frontend Integration)
4. **Week 7**: Phase 3.3 (Admin Panel Integration)
5. **Week 8+**: Phases 4-8 (Advanced features and optimization)

## 📝 Notes for Implementation

- **Start with authentication** - This is the foundation for all other integrations
- **Use TypeScript** where possible for better type safety
- **Implement error handling** at every API integration point
- **Add loading states** for all async operations
- **Create reusable components** for common UI patterns
- **Test incrementally** - Don't wait until the end to test integrations
- **Document API changes** as you discover missing endpoints
- **Use environment variables** for all configuration