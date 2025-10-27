# HireHub Employer Connect Mobile

A comprehensive React Native mobile application for the HireHub Ethiopia employer platform. Built with Expo, TypeScript, and NativeWind (TailwindCSS for React Native).

## 🚀 Features

- ✅ **Complete Mobile App** - Full replication of web app functionality
- ✅ **8 Main Screens** - Dashboard, Jobs, Applications, Chat, Profile, Notifications, Payments
- ✅ **NativeWind Styling** - TailwindCSS integration for React Native
- ✅ **TypeScript** - Full type safety
- ✅ **Mock Data** - Development-ready with comprehensive mock data
- ✅ **Ethiopian Theme** - Green branding matching web app
- ✅ **Dark Mode Ready** - Theme system configured
- ✅ **Navigation** - React Navigation with Tab & Stack navigators
- ✅ **State Management** - React Query for data fetching
- ✅ **Secure Storage** - Expo SecureStore for tokens

## 📱 Screens

1. **Dashboard** - Overview stats, recent activity, quick actions
2. **Jobs** - List, create, edit, delete job postings
3. **Post Job** - Multi-step form for creating jobs
4. **Applications** - View and manage applicant submissions
5. **Chat** - Message applicants
6. **Profile** - Edit employer profile and company info
7. **Notifications** - View system notifications
8. **Payments** - Payment history and pricing plans

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS)
- **Navigation**: React Navigation v6
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Storage**: Expo SecureStore
- **Form Handling**: React Hook Form + Zod

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoints
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Run on your device**:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## 📁 Project Structure

```
employer-connect-mobile/
├── app/
│   ├── components/
│   │   └── ui/           # Reusable UI components
│   ├── screens/          # All screen components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API services
│   ├── lib/             # Utilities and mock data
│   └── hooks/           # Custom React hooks
├── assets/              # Images, fonts, icons
├── App.tsx             # Root component
└── package.json
```

## 🎨 Theme

The app uses a green-themed color palette matching the HireHub Ethiopia branding:

- **Primary**: `#22c55e` (Green 500)
- **Accent**: `#16a34a` (Green 600)
- **Background**: White / Dark gray
- **Foreground**: Dark green / Light gray

## 🔧 Configuration

### API Integration

Currently using mock data. To integrate with your Node.js backend:

1. Update `.env` with your API base URL
2. Remove mock data fallbacks from services:
   - `app/services/authService.ts`
   - `app/services/jobService.ts`
   - `app/services/paymentService.ts`

### Mock Data

Mock data is located in `app/lib/mockData.ts` and includes:
- User profiles
- Job listings
- Applications
- Payment history
- Notifications
- Chat conversations

**TODO**: Remove mock data when backend is integrated.

## 🚀 Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

### EAS Build (Recommended)

```bash
eas build --platform all
```

## 📱 Features Breakdown

### Dashboard Screen
- Stats cards (jobs, applications, views)
- Recent activity feed
- Quick action buttons

### Jobs Screen
- List all jobs with filters (all/active/expired)
- View job details and statistics
- Edit and delete jobs
- Floating action button to post new job

### Post Job Screen
- Form with validation
- Category and location selectors
- Employment type selection
- Listing type (free/basic/premium/featured)

### Applications Screen
- Filter by status (pending/shortlisted/accepted/rejected)
- View applicant details
- Update application status
- View cover letters

### Chat Screen
- List of conversations
- Unread message indicators
- Quick preview of last message

### Profile Screen
- Edit personal information
- Company details
- Logout functionality

### Notifications Screen
- Mark as read/unread
- Filter by type
- Real-time updates

### Payments Screen
- Payment history
- Pricing plans
- Payment methods (Telebirr, CBE Birr, etc.)

## 🔐 Security

- Tokens stored in Expo SecureStore
- API requests include authentication headers
- Token refresh logic implemented

## 🌍 Ethiopian Localization

- Ethiopian Birr (ETB) currency formatting
- Ethiopian cities for job locations
- Local payment methods support

## 📝 TODO

- [ ] Remove mock data when backend is ready
- [ ] Implement push notifications
- [ ] Add biometric authentication
- [ ] Implement deep linking
- [ ] Add analytics
- [ ] Implement real-time chat
- [ ] Add image upload for company logos
- [ ] Implement offline mode

## 🤝 Contributing

This is a mobile replication of the employer-connect-pro web app. Ensure all features match the web version.

## 📄 License

Proprietary - HireHub Ethiopia

## 📧 Support

For support, contact the HireHub Ethiopia development team.


