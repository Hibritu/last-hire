# 🚀 Complete Chat System Testing Guide

## Overview
The HireHub chat system allows **encrypted messaging** between employers and job seekers, but only for applications that have been **shortlisted** or **accepted**. Here's how to test it from start to finish.

## 📋 Prerequisites

### 1. Database Setup
- PostgreSQL database running
- All models synced (`npm run db:sync` or start server)
- Environment variables configured (`.env` file)

### 2. Server Running
```bash
npm start
# or
node app.js
```
Server should be running on `http://localhost:4000`

### 3. Swagger UI Access
Open: `http://localhost:4000/docs` or `http://localhost:4000/api-docs`

## 🔄 Complete Testing Workflow

### Step 1: Create Test Users

**A. Create Employer Account**
```bash
POST /auth/register
{
  "role": "employer",
  "email": "employer.test@hirehub.com",
  "password": "password123",
  "first_name": "Test",
  "last_name": "Employer",
  "phone": "+251911111111"
}
```

**B. Create Job Seeker Account**
```bash
POST /auth/register
{
  "role": "job_seeker", 
  "email": "jobseeker.test@hirehub.com",
  "password": "password123",
  "first_name": "Test",
  "last_name": "JobSeeker",
  "phone": "+251922222222"
}
```

### Step 2: Login and Get Tokens

**A. Login as Employer**
```bash
POST /auth/login
{
  "email": "employer.test@hirehub.com",
  "password": "password123"
}
```
**Copy the JWT token** - you'll need this for employer actions.

**B. Login as Job Seeker**
```bash
POST /auth/login
{
  "email": "jobseeker.test@hirehub.com", 
  "password": "password123"
}
```
**Copy this JWT token** - you'll need this for job seeker actions.

### Step 3: Create Job Posting (As Employer)

**Set Authorization:** Use employer JWT token in Swagger
```bash
POST /api/jobs
{
  "title": "Senior React Developer",
  "description": "We need an experienced React developer",
  "requirements": "3+ years React experience",
  "category": "programming",
  "employment_type": "full-time",
  "location": "Addis Ababa",
  "salary": 50000,
  "expiry_date": "2025-12-31"
}
```
**Copy the job ID** from response.

### Step 4: Apply to Job (As Job Seeker)

**Switch Authorization:** Use job seeker JWT token
```bash
POST /jobs/{job_id}/apply
{
  "cover_letter": "I am very interested in this position and have the required skills."
}
```
**Copy the application ID** from response.

### Step 5: Shortlist Application (As Employer)

**Switch Authorization:** Back to employer JWT token
```bash
PUT /applications/{application_id}/status
{
  "status": "shortlisted"
}
```

**⚠️ CRITICAL:** Only `shortlisted` or `accepted` applications can create chats!

### Step 6: Create Chat (Either User)

**Use either employer or job seeker token**
```bash
GET /api/chat/application/{application_id}
```

**Expected Response:**
```json
{
  "data": {
    "id": "chat-uuid-here",
    "application_id": "your-application-id",
    "job_id": "job-uuid",
    "employer_id": "employer-uuid", 
    "candidate_id": "candidate-uuid",
    "is_active": true,
    "employer": {
      "id": "employer-uuid",
      "first_name": "Test",
      "last_name": "Employer"
    },
    "candidate": {
      "id": "candidate-uuid",
      "first_name": "Test", 
      "last_name": "JobSeeker"
    }
  }
}
```

**Copy the chat ID** (`data.id`) - this is your `chat_id` for messaging!

### Step 7: Send Messages

**A. Send Text Message**
```bash
POST /api/chat/{chat_id}/send
Content-Type: application/json

{
  "content": "Hello! I'm excited to discuss this opportunity.",
  "content_type": "text"
}
```

**B. Send Job Details Message**
```bash
POST /api/chat/{chat_id}/send
Content-Type: application/json

{
  "content": "Here are the updated job details:",
  "content_type": "job_details",
  "job_details": {
    "salary": "55000",
    "start_date": "2025-11-01",
    "benefits": ["Health Insurance", "Remote Work"]
  }
}
```

**C. Send Message with File Attachment**
```bash
POST /api/chat/{chat_id}/send
Content-Type: multipart/form-data

content: "Please find my portfolio attached"
content_type: text
attachments: [Upload file - PDF, images, docs allowed]
```

### Step 8: Retrieve Messages

```bash
GET /api/chat/{chat_id}/messages?page=1&limit=20
```

**Response includes:**
- Decrypted message content
- Sender information
- Attachments (if any)
- Timestamps
- Read status

### Step 9: Additional Chat Operations

**A. Get All My Chats**
```bash
GET /api/chat/my-chats?page=1&limit=10
```

**B. Mark Messages as Read**
```bash
PUT /api/chat/{chat_id}/mark-read
```

**C. Get Unread Count**
```bash
GET /api/chat/unread-count
```

**D. Close Chat (Employer Only)**
```bash
PUT /api/chat/{chat_id}/close
```

## 🔧 Key Features Tested

### ✅ Security Features
- **JWT Authentication** required for all endpoints
- **Role-based access** (only employer/job seeker involved)
- **Message encryption** (automatic encrypt/decrypt)
- **File upload validation** (type, size limits)

### ✅ Business Logic
- **Application status validation** (shortlisted/accepted only)
- **Automatic chat creation** on first access
- **Email notifications** sent on new messages
- **Unread message tracking**
- **File attachment support** (max 5 files, 10MB each)

### ✅ Message Types
- **Text messages** - Regular chat
- **Job details** - Structured job information
- **Feedback** - Application feedback
- **System messages** - Automated notifications

## 🚨 Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Application not found` | Invalid application ID | Check application exists |
| `Chat only available for shortlisted/accepted` | Wrong application status | Update status to `shortlisted` or `accepted` |
| `Chat not found` | Invalid chat ID | Create chat via application endpoint first |
| `Access denied` | Wrong user | Login as employer or job seeker involved |
| `Invalid file type` | Unsupported file | Use: images, PDF, docs, zip only |

## 📝 Testing Checklist

- [ ] User registration (employer + job seeker)
- [ ] User authentication (JWT tokens)
- [ ] Job creation (employer)
- [ ] Job application (job seeker)
- [ ] Application status update (shortlist/accept)
- [ ] Chat creation via application
- [ ] Text message sending
- [ ] Job details message
- [ ] File attachment upload
- [ ] Message retrieval
- [ ] Mark as read functionality
- [ ] Unread count tracking
- [ ] Chat listing
- [ ] Access control validation

## 🎯 Quick Test Script

For rapid testing, you can use this sequence:
1. Register both users → Get tokens
2. Create job → Apply → Shortlist
3. Create chat → Send messages → Verify encryption
4. Test file uploads → Check notifications
5. Verify access controls → Test edge cases

The chat system is fully functional with enterprise-grade security and features!
