# 🚀 How to Run the App

## ✅ Prerequisites

Before running, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ npm or yarn installed
- ✅ Dependencies installed (already done!)

## 📱 Option 1: Run on Your Phone (Recommended)

### Step 1: Start the Development Server
```bash
cd employer-connect-mobile
npm start
```

### Step 2: Install Expo Go on Your Phone
- **iOS**: Download "Expo Go" from the App Store
- **Android**: Download "Expo Go" from Google Play Store

### Step 3: Scan the QR Code
- **iOS**: Open Camera app and scan the QR code in the terminal
- **Android**: Open Expo Go app and tap "Scan QR Code"

### Step 4: App Loads!
The app will download and open on your phone. You can now test all features!

## 💻 Option 2: Run on iOS Simulator (Mac Only)

### Step 1: Install Xcode
Download Xcode from the Mac App Store

### Step 2: Start Simulator
```bash
cd employer-connect-mobile
npm start
```

Press `i` in the terminal to open iOS Simulator

## 🤖 Option 3: Run on Android Emulator

### Step 1: Install Android Studio
Download Android Studio and set up an emulator

### Step 2: Start Emulator
```bash
cd employer-connect-mobile
npm start
```

Press `a` in the terminal to open Android Emulator

## 🌐 Option 4: Run in Web Browser

```bash
cd employer-connect-mobile
npm start
```

Press `w` in the terminal to open in browser

**Note**: Some native features may not work in web mode

## 🧪 Testing the App

Once the app loads, you can test:

### 1. Dashboard (Landing Screen)
- ✅ View stats cards
- ✅ Check recent activity
- ✅ Try quick action buttons

### 2. Jobs Tab
- ✅ View job list
- ✅ Try filter tabs (All, Active, Expired)
- ✅ Tap floating "+" button
- ✅ Test edit/delete buttons

### 3. Post Job
- ✅ Fill out the form
- ✅ Try submitting (creates mock job)
- ✅ Test validation by leaving fields empty
- ✅ Test selectors (Category, Location, etc.)

### 4. Applications Tab
- ✅ View applications
- ✅ Try status filters
- ✅ Test status update buttons
- ✅ View applicant details

### 5. Chat Tab
- ✅ View conversations
- ✅ Check unread badges
- ✅ Tap a conversation

### 6. More → Profile
- ✅ View profile
- ✅ Tap "Edit Profile"
- ✅ Update fields
- ✅ Try "Save Changes"
- ✅ Test "Logout" (with confirmation)

### 7. More → Notifications
- ✅ View notifications
- ✅ Check unread indicators
- ✅ Tap to mark as read
- ✅ Try "Mark all as read"

### 8. More → Payments
- ✅ View payment history
- ✅ Switch to "Pricing Plans" tab
- ✅ View plan details
- ✅ Check payment methods

## 🔄 Pull-to-Refresh

On all list screens, **pull down** to refresh data:
- Dashboard
- Jobs list
- Applications list
- Chat list
- Notifications
- Payment history

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution**:
```bash
cd employer-connect-mobile
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: "Metro bundler error"
**Solution**:
```bash
npx expo start -c
```
(The `-c` clears the cache)

### Issue: "Expo Go connection timeout"
**Solution**:
- Make sure your phone and computer are on the same WiFi
- Try restarting the development server
- Try scanning the QR code again

### Issue: "TypeScript errors"
**Solution**:
```bash
npx tsc --noEmit
```
Check for any type errors and fix them

### Issue: "App crashes on load"
**Solution**:
- Check the terminal for error messages
- Look for red error screens in the app
- Check that all files were created correctly

## ✅ Verification Checklist

After running, verify:
- [ ] App loads successfully
- [ ] Dashboard shows stats
- [ ] Can navigate between tabs
- [ ] Jobs list displays
- [ ] Can open Post Job form
- [ ] Applications display
- [ ] Chat conversations show
- [ ] Profile loads
- [ ] Notifications display
- [ ] Payments screen works
- [ ] Pull-to-refresh works
- [ ] All buttons are functional
- [ ] Forms submit successfully
- [ ] No console errors

## 📊 What You Should See

### Dashboard Screen
- 4 colorful stat cards
- Recent activity list
- 2 quick action buttons

### Jobs Screen
- 3 filter tabs at top
- List of 5 jobs
- Floating "+" button at bottom right
- Edit/Delete buttons on each job

### Applications Screen
- 5 filter tabs (scrollable)
- 6 applications
- Status badges (colored)
- Action buttons based on status

### Notifications Screen
- "X unread" header
- "Mark all as read" button
- 5 notifications with icons
- Unread indicators (blue dot)

### Payments Screen
- Tab switcher (History / Pricing)
- 4 payment transactions
- 3 pricing plan cards
- Payment method list

## 🎉 Success!

If everything loads and works, **congratulations!** You have a fully functional mobile app!

## 📝 Next Steps

1. **Play around** - Test all features
2. **Check the code** - See how it's built
3. **Customize** - Change colors, text, etc.
4. **Integrate backend** - See `INTEGRATION_GUIDE.md`
5. **Deploy** - Build for app stores

## 🆘 Need Help?

Check these files:
- `README.md` - Full documentation
- `QUICK_START.md` - Quick start guide
- `INTEGRATION_GUIDE.md` - Backend integration
- `PROJECT_SUMMARY.md` - What was built
- `FEATURES.md` - Feature list

## 📱 App Demo Data

The app comes with:
- 1 employer account (auto-logged in)
- 5 sample jobs
- 6 applications
- 4 payment transactions
- 5 notifications
- 3 chat conversations

All data is **mock data** and can be changed in `app/lib/mockData.ts`

## 🚀 Quick Commands

```bash
# Start development server
npm start

# Clear cache and restart
npx expo start -c

# Check for TypeScript errors
npx tsc --noEmit

# Build for production
eas build --platform all

# Install new dependency
npm install <package-name>
```

That's it! Enjoy your new mobile app! 🎉


