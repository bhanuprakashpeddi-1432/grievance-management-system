#!/bin/bash

# Grievance Management System - Complete Setup Script
# This script sets up the entire application with frontend and backend

echo "🚀 Setting up Grievance Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚙️  Creating backend .env file...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Created backend/.env file. Please update it with your database credentials.${NC}"
fi

# Create .env file for frontend if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Creating frontend .env file...${NC}"
    cat > .env << EOF
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
EOF
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
fi

# Create uploads directory
mkdir -p backend/uploads
echo -e "${GREEN}✅ Created uploads directory${NC}"

# Create database setup script
cat > setup-database.js << 'EOF'
const { setupDatabase } = require('./backend/database/setup');

async function main() {
    try {
        console.log('🗄️  Setting up database...');
        await setupDatabase();
        console.log('✅ Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

main();
EOF

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "${YELLOW}1. Configure your database settings in backend/.env${NC}"
echo -e "${YELLOW}2. Make sure MySQL is running on your system${NC}"
echo -e "${YELLOW}3. Run 'node setup-database.js' to initialize the database${NC}"
echo -e "${YELLOW}4. Start the backend server: cd backend && npm start${NC}"
echo -e "${YELLOW}5. Start the frontend server: npm run dev${NC}"
echo
echo -e "${GREEN}🔥 Your Grievance Management System is ready!${NC}"
