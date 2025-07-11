# 📁 Project Structure - Grievance Management System

## ✅ **Completed Reorganization**

The project has been successfully restructured into a clean, organized monorepo with separate frontend and backend folders.

---

## 🏗️ **Current Project Structure**

```
grievance-management-system/
├── 📁 backend/                    # Backend API Server (Node.js + Express + Prisma)
│   ├── 📁 config/                 # Database and application configuration
│   ├── 📁 middleware/             # Express middleware (auth, error handling)
│   ├── 📁 routes/                 # API route handlers
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── grievances.js         # Grievance CRUD operations
│   │   ├── users.js              # User management
│   │   └── dashboard.js          # Dashboard data
│   ├── 📁 prisma/                 # Database schema and seeding
│   │   ├── schema.prisma         # Database schema definition
│   │   └── seed.js               # Sample data seeding
│   ├── 📄 package.json           # Backend dependencies
│   ├── 📄 server.js              # Main server entry point
│   ├── 📄 verify-setup.js        # System verification script
│   └── 📄 .env                   # Environment variables
│
├── 📁 frontend/                   # Frontend React Application
│   ├── 📁 src/                    # Source code
│   │   ├── 📁 components/         # Reusable UI components
│   │   ├── 📁 pages/              # Page components
│   │   │   ├── authentication/   # Login/Register pages
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   ├── forms/            # Form components
│   │   │   └── tables/           # Table components
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 services/           # API service layer
│   │   ├── 📁 contexts/           # React contexts
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 types/              # TypeScript definitions
│   │   ├── 📁 styles/             # Global styles
│   │   └── 📁 images/             # Static images
│   ├── 📁 public/                 # Static assets
│   ├── 📄 package.json           # Frontend dependencies
│   ├── 📄 webpack.config.js      # Webpack configuration
│   ├── 📄 tsconfig.json          # TypeScript configuration
│   └── 📄 README.md              # Frontend documentation
│
├── 📄 package.json               # Root package.json (workspace management)
├── 📄 README.md                  # Main project documentation
├── 📄 SETUP_GUIDE.md             # Detailed setup instructions
├── 📄 MIGRATION_SUMMARY.md       # Migration completion summary
├── 📄 setup.ps1                  # Windows PowerShell setup script
└── 📄 setup.bat                  # Windows batch setup script
```

---

## 🔧 **Workspace Configuration**

### Root Package.json Features:
- **Workspaces**: Manages both frontend and backend as workspaces
- **Unified Scripts**: Commands to manage both parts of the application
- **Concurrency**: Run frontend and backend simultaneously
- **Cross-platform**: Works on Windows, macOS, and Linux

### Available Scripts:
```bash
# Full application
npm start                    # Start both frontend and backend
npm run dev                  # Start both in development mode
npm run setup                # Complete setup process

# Frontend specific
npm run dev:frontend         # Start only frontend
npm run build:frontend       # Build frontend for production

# Backend specific  
npm run dev:backend          # Start only backend
npm run setup:backend        # Setup backend and database

# Utilities
npm run install:all          # Install all dependencies
npm run clean               # Clean all node_modules
npm run verify              # Verify system setup
```

---

## 🚀 **Development Workflow**

### 1. **Initial Setup**
```bash
# Clone and setup
git clone <repository-url>
cd grievance-management-system
npm run setup
```

### 2. **Development Mode**
```bash
# Start full application (recommended)
npm start

# Or start individually
npm run dev:backend    # Terminal 1: Backend on :3001
npm run dev:frontend   # Terminal 2: Frontend on :3000
```

### 3. **Production Build**
```bash
# Build frontend for production
npm run build:frontend

# Backend runs directly with: cd backend && npm start
```

---

## 📂 **Key Directories Explained**

### Backend (`/backend/`)
- **Purpose**: RESTful API server with Prisma ORM
- **Tech Stack**: Node.js, Express.js, Prisma, MySQL
- **Key Features**: JWT authentication, file uploads, role-based access
- **Entry Point**: `server.js`

### Frontend (`/frontend/`)
- **Purpose**: React-based user interface
- **Tech Stack**: React 18, TypeScript, RSuite UI, Webpack
- **Key Features**: Dashboard, forms, authentication, responsive design
- **Entry Point**: `src/index.tsx`

---

## 🔗 **Integration Points**

### API Communication
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Communication**: Axios HTTP client with JWT tokens

### Database
- **System**: MySQL with Prisma ORM
- **Schema**: Comprehensive relational design
- **Seeding**: Sample data for development

---

## 📋 **Benefits of New Structure**

### ✅ **Separation of Concerns**
- Clear distinction between frontend and backend
- Independent development and deployment
- Easier team collaboration

### ✅ **Maintainability**
- Modular architecture
- Clean dependencies
- Easier troubleshooting

### ✅ **Scalability**
- Independent scaling of frontend/backend
- Microservices-ready architecture
- Easy to add new features

### ✅ **Development Experience**
- Hot reload for both parts
- Unified command interface
- Consistent tooling

---

## 🎯 **Next Steps**

### Immediate Actions:
1. **Run Setup**: Execute `npm run setup` to initialize the project
2. **Start Development**: Use `npm start` to run both frontend and backend
3. **Verify Setup**: Check `http://localhost:3000` for the application

### Development Workflow:
1. **Backend Changes**: Edit files in `/backend/` - auto-reload enabled
2. **Frontend Changes**: Edit files in `/frontend/src/` - hot-reload enabled
3. **Database Changes**: Update `/backend/prisma/schema.prisma` and run migrations

### Production Deployment:
1. **Frontend**: Build with `npm run build:frontend` and deploy static files
2. **Backend**: Deploy Node.js application with proper environment variables
3. **Database**: Set up production MySQL instance

---

## 🔐 **Security & Best Practices**

### Environment Variables:
- Database credentials in `/backend/.env`
- JWT secrets properly configured
- File upload restrictions in place

### Code Quality:
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Comprehensive error handling

---

**✨ The project is now properly organized and ready for efficient development and deployment! ✨**
