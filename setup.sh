#!/bin/bash

# Certificate Generator Desktop Setup Script
# For macOS and Linux

echo "🚀 Setting up Certificate Generator Desktop App..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Please install Node.js v18+ from: https://nodejs.org/"
    echo "   After installation, run this script again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if pnpm is installed, install if not
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm package manager..."
    npm install -g pnpm
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install pnpm"
        echo "   Try running: sudo npm install -g pnpm"
        exit 1
    fi
fi

echo "✅ pnpm $(pnpm -v) detected"

# Install project dependencies
echo "📦 Installing application dependencies..."
echo "   This may take a few minutes..."

pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "   Try running: pnpm install --force"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment configuration
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating application configuration..."
    cat > .env.local << EOL
# Certificate Generator Desktop Configuration
NEXT_PUBLIC_APP_NAME="Certificate Generator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_ENABLE_QR_CODES=true
NEXT_PUBLIC_ENABLE_BARCODES=true
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_MAX_BATCH_SIZE=1000
NEXT_PUBLIC_OFFLINE_MODE=true
EOL
    echo "✅ Configuration file created"
fi

# Build the web application components
echo "🔨 Building application components..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    echo "   Check the error messages above and try again"
    exit 1
fi

echo "✅ Application built successfully"

# Test the desktop application
echo "🧪 Testing desktop application..."
timeout 10s pnpm electron &
ELECTRON_PID=$!

sleep 5
if ps -p $ELECTRON_PID > /dev/null; then
    echo "✅ Desktop application test successful"
    kill $ELECTRON_PID 2>/dev/null
else
    echo "⚠️ Desktop application test completed (may have closed automatically)"
fi

# Create desktop launcher for macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🖥️ Creating macOS application launcher..."
    
    APP_DIR="Certificate Generator.app"
    mkdir -p "$APP_DIR/Contents/MacOS"
    mkdir -p "$APP_DIR/Contents/Resources"
    
    # Create Info.plist
    cat > "$APP_DIR/Contents/Info.plist" << EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>certificate-generator</string>
    <key>CFBundleIdentifier</key>
    <string>com.certificategenerator.app</string>
    <key>CFBundleName</key>
    <string>Certificate Generator</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
</dict>
</plist>
EOL

    # Create launcher script
    cat > "$APP_DIR/Contents/MacOS/certificate-generator" << EOL
#!/bin/bash
cd "$(dirname "$0")/../../.."
pnpm electron
EOL
    
    chmod +x "$APP_DIR/Contents/MacOS/certificate-generator"
    echo "✅ macOS app bundle created: $APP_DIR"
fi

# Create Linux desktop entry
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🖥️ Creating Linux desktop entry..."
    
    DESKTOP_FILE="$HOME/.local/share/applications/certificate-generator.desktop"
    CURRENT_DIR=$(pwd)
    
    mkdir -p "$HOME/.local/share/applications"
    
    cat > "$DESKTOP_FILE" << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=Certificate Generator
Comment=Professional Certificate and ID Card Generator
Exec=bash -c "cd '$CURRENT_DIR' && pnpm electron"
Icon=$CURRENT_DIR/public/icon.png
Terminal=false
Categories=Office;Graphics;Utility;
StartupNotify=true
EOL
    
    chmod +x "$DESKTOP_FILE"
    echo "✅ Desktop entry created: $DESKTOP_FILE"
    
    # Update desktop database
    if command -v update-desktop-database &> /dev/null; then
        update-desktop-database "$HOME/.local/share/applications" 2>/dev/null
    fi
fi

# Create quick launch script
echo "📱 Creating quick launch script..."
cat > launch-app.sh << EOL
#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Certificate Generator..."
pnpm electron
EOL

chmod +x launch-app.sh
echo "✅ Quick launch script created: ./launch-app.sh"

echo ""
echo "🎉 Desktop Application Setup Complete!"
echo "====================================="
echo ""
echo "📋 How to use:"
echo "1. Launch app: ./launch-app.sh"
echo "2. Or run: pnpm electron"
echo "3. Build installer: pnpm dist"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS: Double-click 'Certificate Generator.app'"
fi

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Linux: Find 'Certificate Generator' in your applications menu"
fi

echo ""
echo "📖 Documentation: README.md"
echo "🆘 Support: https://github.com/your-username/certificate-generator/issues"
echo ""
echo "🎓 Ready to generate professional certificates!"
