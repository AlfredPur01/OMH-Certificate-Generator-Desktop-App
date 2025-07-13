# Desktop Application Installation Guide

## 📋 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Display**: 1024x768 minimum resolution

### Recommended Requirements
- **RAM**: 8GB or more
- **Storage**: 2GB free space for templates and generated files
- **Display**: 1920x1080 or higher
- **No internet required** after installation

## 🚀 Installation Methods

### Method 1: Automated Desktop Setup (Recommended)

#### Windows
1. **Download** the repository as ZIP or clone it
2. **Extract** to your desired location (e.g., `C:\Certificate-Generator\`)
3. **Right-click** on `setup.bat` and select **"Run as administrator"**
4. **Wait** for automatic installation to complete (5-10 minutes)
5. **Desktop shortcut** will be created automatically

#### macOS/Linux
1. **Open Terminal**
2. **Clone** the repository:
\`\`\`bash
git clone https://github.com/your-username/certificate-generator.git
cd certificate-generator
\`\`\`
3. **Run** the setup script:
\`\`\`bash
chmod +x setup.sh
./setup.sh
\`\`\`
4. **Application** will be configured for desktop use

### Method 2: Manual Desktop Installation

#### Step 1: Install Node.js
1. Visit [nodejs.org](https://nodejs.org/)
2. Download and install **Node.js v18+ LTS**
3. Verify installation:
\`\`\`bash
node --version  # Should show v18.0.0 or higher
\`\`\`

#### Step 2: Install pnpm Package Manager
\`\`\`bash
npm install -g pnpm
pnpm --version  # Verify installation
\`\`\`

#### Step 3: Setup Application
\`\`\`bash
# Clone repository
git clone https://github.com/your-username/certificate-generator.git
cd certificate-generator

# Install all dependencies (this may take 5-10 minutes)
pnpm install

# Build the web components
pnpm build

# Test desktop application
pnpm electron
\`\`\`

## 🖥️ Desktop Application Usage

### Starting the Application

#### Windows
- **Double-click** "Certificate Generator" on desktop
- **Or** double-click `launch-app.bat` in project folder
- **Or** run `pnpm electron` in command prompt

#### macOS
- **Double-click** "Certificate Generator.app"
- **Or** run `./launch-app.sh` in terminal
- **Or** run `pnpm electron` in terminal

#### Linux
- **Find** "Certificate Generator" in applications menu
- **Or** run `./launch-app.sh` in terminal
- **Or** run `pnpm electron` in terminal

### Building Desktop Installer

Create distributable installer files:

\`\`\`bash
# Build installer for your platform
pnpm dist

# Output files:
# Windows: dist/Certificate Generator Setup.exe
# macOS: dist/Certificate Generator.dmg  
# Linux: dist/Certificate Generator.AppImage
\`\`\`

## 🔧 Configuration

### Application Settings
The app creates `.env.local` automatically with these settings:

\`\`\`env
# Certificate Generator Desktop Configuration
NEXT_PUBLIC_APP_NAME="Certificate Generator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_ENABLE_QR_CODES=true
NEXT_PUBLIC_ENABLE_BARCODES=true
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_MAX_BATCH_SIZE=1000     # 1000 certificates
NEXT_PUBLIC_OFFLINE_MODE=true
\`\`\`

### Template Configuration
1. Place certificate templates in `public/templates/`
2. The app automatically detects Medical Certificate templates
3. Use the built-in configurator for custom templates

## 📁 File Structure After Installation

\`\`\`
certificate-generator/
├── Certificate Generator.app/     # macOS app bundle
├── launch-app.bat                # Windows launcher
├── launch-app.sh                 # Unix launcher
├── .next/                        # Built application
├── dist/                         # Desktop installers (after pnpm dist)
├── node_modules/                 # Dependencies
├── public/
│   ├── templates/                # Certificate templates
│   └── manifest.json             # App configuration
├── app/                          # Application source
├── components/                   # React components
├── lib/                          # Utility libraries
├── scripts/                      # Electron scripts
├── .env.local                    # Environment config
└── package.json                  # Project config
\`\`\`

## ✅ Verification

### Test Desktop Application
1. **Start** the application using any method above
2. **Upload** a test Excel file with columns: Name, NIN, DOB, Gender
3. **Upload** the medical certificate template
4. **Generate** a test certificate
5. **Verify** PDF download and print functionality

### Verify Installation
\`\`\`bash
# Check dependencies
pnpm run verify

# Manual checks
node --version    # Should be 18+
pnpm --version    # Should be 8+
pnpm list         # Should show all dependencies
\`\`\`

## 🔍 Troubleshooting

### Common Issues

#### 1. Node.js Version Error
\`\`\`
Error: Node.js version 18+ required
\`\`\`
**Solution**: Update Node.js from [nodejs.org](https://nodejs.org/)

#### 2. pnpm Not Found
\`\`\`
'pnpm' is not recognized as an internal or external command
\`\`\`
**Solution**: Install pnpm globally:
\`\`\`bash
npm install -g pnpm
\`\`\`

#### 3. Permission Denied (macOS/Linux)
\`\`\`
Permission denied: ./setup.sh
\`\`\`
**Solution**: Make script executable:
\`\`\`bash
chmod +x setup.sh
\`\`\`

#### 4. Dependencies Installation Failed
\`\`\`
Error: Failed to install dependencies
\`\`\`
**Solution**: Clear cache and reinstall:
\`\`\`bash
pnpm store prune
rm -rf node_modules .next
pnpm install --force
\`\`\`

#### 5. Electron Won't Start
\`\`\`
Error: Electron failed to start
\`\`\`
**Solution**: Rebuild for your platform:
\`\`\`bash
pnpm install --force
pnpm build
pnpm electron
\`\`\`

#### 6. Build Failed
\`\`\`
Error: Build failed with errors
\`\`\`
**Solution**: Clean and rebuild:
\`\`\`bash
pnpm clean
pnpm install
pnpm build
\`\`\`

### Platform-Specific Issues

#### Windows
- **Antivirus blocking**: Add project folder to antivirus exclusions
- **PowerShell execution policy**: Run as administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
