@echo off
echo ==========================================
echo  Madhav Portfolio - First Time Setup
echo ==========================================
echo.

REM Copy photo to public folder
echo [1/3] Copying profile photo to public folder...
copy /Y "Madhav.jpeg" "public\Madhav.jpeg" >nul 2>&1
echo      Done.

REM Install dependencies
echo [2/3] Installing npm dependencies (this takes 2-3 minutes)...
npm install
echo      Done.

REM Start dev server
echo [3/3] Starting development server...
echo.
echo  ✓ Portfolio will open at: http://localhost:3000
echo  ✓ Admin panel at:         http://localhost:3000/admin
echo.
npm run dev
