# Grievance Management System - Windows Setup Script
# Run this script in PowerShell as Administrator

Write-Host "🚀 Grievance Management System - Windows Setup" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if MySQL is accessible
Write-Host "`n2. Checking MySQL connection..." -ForegroundColor Yellow
$mysqlTest = Read-Host "Enter MySQL root password (or press Enter if no password)"

try {
    if ($mysqlTest -eq "") {
        mysql -u root -e "SELECT 1;" 2>$null
    } else {
        mysql -u root -p$mysqlTest -e "SELECT 1;" 2>$null
    }
    Write-Host "✅ MySQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL connection failed. Please ensure MySQL is running" -ForegroundColor Red
    Write-Host "   Install MySQL: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
    exit 1
}

# Create database
Write-Host "`n3. Creating database..." -ForegroundColor Yellow
try {
    if ($mysqlTest -eq "") {
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS grievance_management_system;" 2>$null
    } else {
        mysql -u root -p$mysqlTest -e "CREATE DATABASE IF NOT EXISTS grievance_management_system;" 2>$null
    }
    Write-Host "✅ Database 'grievance_management_system' created/verified" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    exit 1
}

# Setup backend
Write-Host "`n4. Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Blue
    $databaseUrl = "mysql://root:$mysqlTest@localhost:3306/grievance_management_system"
    
    @"
# Environment Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grievance_management_system
DB_USER=root
DB_PASSWORD=$mysqlTest

# Prisma Database URL
DATABASE_URL="$databaseUrl"

# Seed database with sample data (true/false)
SEED_DATABASE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Bcrypt Configuration
BCRYPT_ROUNDS=10

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Blue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Setup Prisma
Write-Host "`n🔧 Setting up Prisma..." -ForegroundColor Blue
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    exit 1
}

npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database setup completed" -ForegroundColor Green

# Setup frontend
Write-Host "`n5. Setting up frontend..." -ForegroundColor Yellow
Set-Location ..

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Blue
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Verify setup
Write-Host "`n6. Verifying setup..." -ForegroundColor Yellow
Set-Location backend
npm run verify
Set-Location ..

Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

Write-Host "`n🚀 To start the application:" -ForegroundColor Cyan
Write-Host "   1. Backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "   2. Frontend: npm start" -ForegroundColor White

Write-Host "`n🌐 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White

Write-Host "`n👨‍💼 Default Admin Login:" -ForegroundColor Cyan
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   Setup Guide: SETUP_GUIDE.md" -ForegroundColor White
Write-Host "   README: README.md" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
