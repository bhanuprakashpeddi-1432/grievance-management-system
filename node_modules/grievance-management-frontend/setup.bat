@echo off
echo.
echo 🚀 Setting up Grievance Management System with Prisma...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Setup Prisma
echo.
echo 🗄️  Setting up database with Prisma...
call npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    echo Make sure to configure your DATABASE_URL in .env file
    pause
    exit /b 1
)

call npm run db:push
if %errorlevel% neq 0 (
    echo ❌ Failed to push database schema
    echo Make sure MySQL is running and DATABASE_URL is correct in .env file
    pause
    exit /b 1
)

call npm run db:seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

cd ..

REM Create .env file for backend if it doesn't exist
if not exist "backend\.env" (
    echo.
    echo ⚙️  Creating backend .env file...
    copy "backend\.env.example" "backend\.env"
    echo ✅ Created backend/.env file. Please update it with your database credentials.
)

REM Create .env file for frontend if it doesn't exist
if not exist ".env" (
    echo.
    echo ⚙️  Creating frontend .env file...
    (
        echo # Frontend Environment Variables
        echo REACT_APP_API_URL=http://localhost:3001/api
        echo REACT_APP_ENVIRONMENT=development
    ) > .env
    echo ✅ Created frontend .env file
)

REM Create uploads directory
if not exist "backend\uploads" (
    mkdir "backend\uploads"
    echo ✅ Created uploads directory
)

REM Create database setup script
(
    echo const { setupDatabase } = require('./backend/database/setup'^);
    echo.
    echo async function main(^) {
    echo     try {
    echo         console.log('🗄️  Setting up database...'^);
    echo         await setupDatabase(^);
    echo         console.log('✅ Database setup completed successfully!'^);
    echo         process.exit(0^);
    echo     } catch (error^) {
    echo         console.error('❌ Database setup failed:', error.message^);
    echo         process.exit(1^);
    echo     }
    echo }
    echo.
    echo main(^);
) > setup-database.js

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Configure your database settings in backend/.env
echo 2. Make sure MySQL is running on your system
echo 3. Run 'node setup-database.js' to initialize the database
echo 4. Start the backend server: cd backend && npm start
echo 5. Start the frontend server: npm run dev
echo.
echo 🔥 Your Grievance Management System is ready!
echo.
pause
