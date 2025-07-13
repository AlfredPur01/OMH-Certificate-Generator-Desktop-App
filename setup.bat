@echo off
title Certificate Generator Desktop Setup
color 0A

echo 🚀 Setting up Certificate Generator Desktop App...
echo ==================================================
echo.

REM Check if Node.js is installed
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed.
    echo    Please install Node.js v18+ from: https://nodejs.org/
    echo    After installation, run this script again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if pnpm is installed, install if not
echo.
echo 🔍 Checking pnpm package manager...
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing pnpm package manager...
    npm install -g pnpm
    
    if %errorlevel% neq 0 (
        echo ❌ Failed to install pnpm
        echo    Try running this script as administrator
        pause
        exit /b 1
    )
)

echo ✅ pnpm detected:
pnpm --version

REM Install project dependencies
echo.
echo 📦 Installing application dependencies...
echo    This may take a few minutes...
pnpm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    echo    Try running: pnpm install --force
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment configuration
if not exist ".env.local" (
    echo.
    echo ⚙️ Creating application configuration...
    (
        echo # Certificate Generator Desktop Configuration
        echo NEXT_PUBLIC_APP_NAME="Certificate Generator"
        echo NEXT_PUBLIC_APP_VERSION="1.0.0"
        echo NEXT_PUBLIC_ENABLE_QR_CODES=true
        echo NEXT_PUBLIC_ENABLE_BARCODES=true
        echo NEXT_PUBLIC_MAX_FILE_SIZE=10485760
        echo NEXT_PUBLIC_MAX_BATCH_SIZE=1000
        echo NEXT_PUBLIC_OFFLINE_MODE=true
    ) > .env.local
    echo ✅ Configuration file created
)

REM Build the web application components
echo.
echo 🔨 Building application components...
pnpm build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    echo    Check the error messages above and try again
    pause
    exit /b 1
)

echo ✅ Application built successfully

REM Test the desktop application
echo.
echo 🧪 Testing desktop application...
start /B pnpm electron
timeout /t 5 /nobreak >nul
taskkill /f /im electron.exe >nul 2>&1
echo ✅ Desktop application test completed

REM Create desktop shortcuts and launchers
echo.
echo 🖥️ Creating desktop shortcuts...

set CURRENT_DIR=%CD%
set DESKTOP=%USERPROFILE%\Desktop
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs

REM Create desktop shortcut
(
    echo @echo off
    echo title Certificate Generator
    echo cd /d "%CURRENT_DIR%"
    echo echo Starting Certificate Generator...
    echo pnpm electron
    echo if errorlevel 1 pause
) > "%DESKTOP%\Certificate Generator.bat"

REM Create start menu shortcut
mkdir "%START_MENU%\Certificate Generator" 2>nul
(
    echo @echo off
    echo title Certificate Generator
    echo cd /d "%CURRENT_DIR%"
    echo pnpm electron
) > "%START_MENU%\Certificate Generator\Certificate Generator.bat"

REM Create quick launch script in project directory
(
    echo @echo off
    echo title Certificate Generator
    echo echo Starting Certificate Generator Desktop App...
    echo echo.
    echo pnpm electron
    echo if errorlevel 1 (
    echo     echo.
    echo     echo ❌ Failed to start application
    echo     echo    Make sure all dependencies are installed
    echo     pause
    echo ^)
) > launch-app.bat

echo ✅ Desktop shortcuts created
echo ✅ Start menu shortcut created
echo ✅ Quick launch script created: launch-app.bat

echo.
echo 🎉 Desktop Application Setup Complete!
echo =====================================
echo.
echo 📋 How to use:
echo 1. Double-click "Certificate Generator" on desktop
echo 2. Or run: launch-app.bat
echo 3. Or run: pnpm electron
echo 4. Build installer: pnpm dist
echo.
echo 📁 Project location: %CURRENT_DIR%
echo 🖥️ Desktop shortcut: %DESKTOP%\Certificate Generator.bat
echo 📖 Documentation: README.md
echo.
echo 🎓 Ready to generate professional certificates!
echo.
pause
