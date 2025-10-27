# 🔗 Backend Integration Guide

## Overview

This mobile app is currently using **mock data** for all operations. This guide will help you integrate it with your Node.js backend.

## 📋 Integration Checklist

- [ ] Update environment variables with backend URLs
- [ ] Remove mock data fallbacks from services
- [ ] Test authentication endpoints
- [ ] Test job endpoints
- [ ] Test payment endpoints
- [ ] Configure push notifications
- [ ] Update token management if needed
- [ ] Test error handling

## 🔧 Step-by-Step Integration

### 1. Environment Configuration

Update `.env` file with your backend URLs:

```env
API_BASE_URL=https://api.hirehub.et
AUTH_HUB_URL=https://auth.hirehub.et
TOKEN_STORAGE_KEY=hirehub_employer_token
REFRESH_TOKEN_STORAGE_KEY=hirehub_employer_refresh_token
```

### 2. Authentication Service Integration

**File**: `app/services/authService.ts`

#### Remove Mock Login (Lines 92-165)
```typescript
// DELETE THIS ENTIRE SECTION:
private static async mockLogin(credentials: LoginRequest): Promise<AuthResponse> {
  // ... mock implementation
}

static generateMockToken(email: string, role: string): string {
  // ... mock implementation
}
```

#### Update `checkBackendAvailability()` (Line 38)
```typescript
static async checkBackendAvailability(): Promise<void> {
  try {
    this.isBackendAvailable = await checkBackendAvailability(API_CONFIG.AUTH_BASE_URL);
    if (!this.isBackendAvailable) {
      // Show error to user instead of using mock
      throw new Error('Backend unavailable');
    }
  } catch (error) {
    throw error; // Don't fall back to mock
  }
}
```

#### Update `getCurrentUser()` (Line 69)
```typescript
static async getCurrentUser(): Promise<User | null> {
  try {
    if (!await this.isAuthenticated()) {
      return null;
    }
    
    const response = await apiWrapper.get<User>('/users/me', authApiClient);
    return response;
  } catch (error) {
    console.error('❌ [AUTH] Get user error:', error);
    return null;
  }
}
```

### 3. Job Service Integration

**File**: `app/services/jobService.ts`

#### Remove Local Storage (Line 24)
```typescript
// DELETE THESE LINES:
private static localJobs: Job[] = [...mockJobs];
private static localApplications: Application[] = [...mockApplications];
```

#### Update All Methods
Replace mock data returns with API calls only:

**Example - `getEmployerJobs()`**:
```typescript
static async getEmployerJobs(): Promise<Job[]> {
  try {
    const jobs = await apiWrapper.get<Job[]>('/api/jobs/employer', jobsApiClient);
    console.log('✅ [JOB SERVICE] Retrieved jobs from backend:', jobs.length);
    return jobs;
  } catch (error) {
    console.error('❌ [JOB SERVICE] Error fetching jobs:', error);
    throw error; // Don't fall back to mock
  }
}
```

Do the same for:
- `getJobById()`
- `createJob()`
- `updateJob()`
- `deleteJob()`
- `getJobApplications()`
- `getAllApplications()`
- `updateApplicationStatus()`

### 4. Payment Service Integration

**File**: `app/services/paymentService.ts`

#### Remove Local Storage (Line 38)
```typescript
// DELETE THIS LINE:
private static localPaymentHistory: PaymentHistory[] = [...mockPaymentHistory];
```

#### Update Methods
Remove mock fallbacks from:
- `initializePayment()`
- `verifyPayment()`
- `getPaymentHistory()`

### 5. API Endpoints Reference

Ensure your backend implements these endpoints:

#### Authentication
```
POST   /auth/login              - Login user
POST   /auth/logout             - Logout user
POST   /auth/refresh            - Refresh token
GET    /users/me                - Get current user
```

#### Jobs
```
GET    /api/jobs/employer       - Get employer's jobs
GET    /api/jobs/:id            - Get single job
POST   /api/jobs                - Create job
PUT    /api/jobs/:id            - Update job
DELETE /api/jobs/:id            - Delete job
GET    /api/jobs/:id/applications - Get job applications
GET    /api/jobs/categories     - Get categories
```

#### Applications
```
GET    /api/applications/employer - Get all applications
PATCH  /api/applications/:id      - Update application status
```

#### Payments
```
POST   /payments/initialize     - Initialize payment
POST   /payments/verify         - Verify payment
GET    /payments/history        - Get payment history
```

### 6. Request/Response Format

Ensure your backend follows this format:

#### Success Response
```json
{
  "data": { /* your data */ },
  "message": "Success message",
  "success": true
}
```

Or simply:
```json
{
  /* your data directly */
}
```

The API wrapper handles both formats.

#### Error Response
```json
{
  "message": "Error message",
  "status": 400,
  "errors": {
    "field": ["Error message"]
  }
}
```

### 7. Token Management

The app already handles:
- Storing tokens in SecureStore
- Adding Authorization header to requests
- Token refresh on 401 errors
- Clearing tokens on logout

Ensure your backend:
- Returns JWT tokens on login
- Validates Bearer tokens on protected routes
- Returns 401 on expired tokens
- Supports token refresh endpoint

### 8. Testing Integration

#### Test Authentication
```typescript
import AuthService from './app/services/authService';

// Test login
const result = await AuthService.login({
  email: 'test@example.com',
  password: 'password'
});
console.log('Login result:', result);

// Test get user
const user = await AuthService.getCurrentUser();
console.log('Current user:', user);
```

#### Test Jobs
```typescript
import JobService from './app/services/jobService';

// Test get jobs
const jobs = await JobService.getEmployerJobs();
console.log('Jobs:', jobs);

// Test create job
const newJob = await JobService.createJob({
  title: 'Test Job',
  description: 'Test Description',
  // ... other fields
});
console.log('Created job:', newJob);
```

### 9. Error Handling

The app handles errors at multiple levels:

1. **API Level** (`app/lib/api.ts`)
   - Network errors
   - 401 errors (token expiration)
   - Response parsing

2. **Service Level** (각 service file)
   - Service-specific errors
   - Fallback behavior

3. **UI Level** (각 screen)
   - Loading states
   - Error messages
   - Retry logic

### 10. Push Notifications (Optional)

To add push notifications:

1. Install Expo Notifications:
```bash
expo install expo-notifications expo-device expo-constants
```

2. Configure in `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#22c55e"
        }
      ]
    ]
  }
}
```

3. Implement notification service:
```typescript
// app/services/notificationService.ts
import * as Notifications from 'expo-notifications';

export class NotificationService {
  static async registerForPushNotifications() {
    // Implementation
  }
  
  static async scheduleNotification(title: string, body: string) {
    // Implementation
  }
}
```

### 11. Deep Linking (Optional)

Configure deep linking for payment returns:

**app.json**:
```json
{
  "expo": {
    "scheme": "employerconnect"
  }
}
```

**Navigation**:
```typescript
// Handle payment return URLs
const linking = {
  prefixes: ['employerconnect://'],
  config: {
    screens: {
      PaymentReturn: 'payments/return',
      PaymentCancel: 'payments/cancel'
    }
  }
};
```

## 🧪 Testing Checklist

After integration, test:

- [ ] Login works
- [ ] Token is stored securely
- [ ] Protected routes require authentication
- [ ] Job listing loads from backend
- [ ] Job creation works
- [ ] Job update works
- [ ] Job deletion works
- [ ] Applications load correctly
- [ ] Application status updates
- [ ] Payment initialization works
- [ ] Payment history loads
- [ ] Notifications receive
- [ ] Logout clears tokens
- [ ] Token refresh works on 401

## 🔍 Debugging Tips

### Enable Debug Mode
In `app/lib/api.ts`, requests/responses are logged to console.

### Check Network Requests
```typescript
// Add to any service call
try {
  const result = await JobService.getEmployerJobs();
  console.log('Success:', result);
} catch (error) {
  console.error('Error:', error);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
}
```

### Use React Native Debugger
```bash
npm install -g react-native-debugger
```

## 📝 Migration Timeline

**Phase 1: Authentication** (Day 1)
- Update auth endpoints
- Test login/logout
- Verify token storage

**Phase 2: Core Features** (Day 2-3)
- Integrate job endpoints
- Test CRUD operations
- Update application endpoints

**Phase 3: Additional Features** (Day 4)
- Payment integration
- Notification setup
- Error handling refinement

**Phase 4: Testing** (Day 5)
- End-to-end testing
- Error scenario testing
- Performance testing

## ✅ Post-Integration

After successful integration:

1. Delete `app/lib/mockData.ts`
2. Remove TODO comments
3. Update README.md
4. Test on real devices
5. Prepare for app store submission

## 🆘 Common Issues

### Issue: 401 Errors
**Solution**: Check token format, ensure Bearer prefix, verify expiration

### Issue: CORS Errors (on web)
**Solution**: Configure backend CORS to allow Expo domains

### Issue: Network Request Failed
**Solution**: Check API_BASE_URL, ensure backend is accessible

### Issue: Data Not Updating
**Solution**: Check React Query cache settings, force refetch

## 📞 Need Help?

Review:
- `README.md` - Complete documentation
- `app/lib/api.ts` - API configuration
- Service files - Business logic
- Screen files - UI implementation

The architecture is designed to make backend integration as simple as possible. All the heavy lifting (token management, error handling, state management) is already done!


