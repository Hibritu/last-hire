@echo off
echo.
echo ============================================
echo    QUICK RESTART - HireHub
echo ============================================
echo.

echo [1/3] Stopping all services...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 >nul

echo [2/3] Starting backend...
cd backend
start "Backend" cmd /k "npm run dev"
timeout /t 5 >nul

echo [3/3] Starting frontends...
cd ..\Frontend\employer-connect-pro-main
start "Employer Portal" cmd /k "npm run dev"
timeout /t 2 >nul

cd ..\USER(dagi)
start "Job Seeker Portal" cmd /k "npm run dev"
timeout /t 2 >nul

cd ..\seekr-companion-main
start "Auth Hub" cmd /k "npm run dev"

cd ..\..

echo.
echo ============================================
echo    ALL SERVICES STARTED!
echo ============================================
echo.
echo  Backend:         http://localhost:4000
echo  Employer Portal: http://localhost:3000
echo  Job Seeker:      http://localhost:8081
echo  Auth Hub:        http://localhost:3002
echo.
echo  DEBUG PAGE:      http://localhost:3000/debug-auth.html
echo.
echo ============================================
echo.
echo IMPORTANT: RE-LOGIN REQUIRED!
echo.
echo Your old token is expired. Please login again:
echo.
echo Option 1 - Debug Page (Recommended):
echo   1. Go to: http://localhost:3000/debug-auth.html
echo   2. Login with: hib@gmail.com / 123
echo   3. Test endpoints
echo   4. Return to: http://localhost:3000
echo.
echo Option 2 - Auth Hub:
echo   1. Go to: http://localhost:3002/login
echo   2. Login with: hib@gmail.com / 123
echo   3. Click "Sign In as Employer"
echo   4. Will redirect to employer portal
echo.
echo ============================================
echo.
pause

