# Grievance Management System - Backend

Express.js backend API with Prisma ORM for the Grievance Management System.

## 🚀 Features

- **RESTful API** with Express.js
- **Prisma ORM** with MySQL database
- **JWT Authentication** with role-based access control
- **File Upload** support with validation
- **Rate Limiting** and security middleware
- **Comprehensive Validation** with express-validator
- **Error Handling** with proper HTTP status codes
- **Database Seeding** with sample data

## 🛠️ Tech Stack

- Node.js with Express.js
- Prisma 5.9.1 ORM
- MySQL database
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- express-validator for validation

## 📋 Prerequisites

- Node.js (version 16 or higher)
- MySQL Server (version 8.0 or higher)
- npm package manager

## 🚀 Getting Started

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="mysql://root:password@localhost:3306/grievance_management_system"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server
NODE_ENV=development
PORT=3001

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Prisma client configuration
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── grievances.js       # Grievance CRUD operations
│   ├── users.js            # User management
│   └── dashboard.js        # Dashboard data
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Sample data seeding
├── uploads/                # File upload directory
├── server.js              # Main server file
└── verify-setup.js        # Setup verification script
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Grievances
- `GET /api/grievances` - List grievances (with filtering)
- `POST /api/grievances` - Create new grievance
- `GET /api/grievances/:id` - Get grievance details
- `PUT /api/grievances/:id` - Update grievance
- `PUT /api/grievances/:id/status` - Update grievance status
- `POST /api/grievances/:id/comments` - Add comment
- `DELETE /api/grievances/:id` - Delete grievance

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/password` - Change password
- `PUT /api/users/:id/toggle-status` - Toggle user status
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

## 🗄️ Database Schema

### Core Models
- **User** - User accounts and authentication
- **Grievance** - Main grievance records
- **GrievanceCategory** - Grievance categorization
- **GrievanceAttachment** - File attachments
- **GrievanceComment** - Communication threads
- **GrievanceStatusHistory** - Status change tracking
- **Notification** - User notifications

### Relationships
- Users can have multiple grievances
- Grievances belong to categories
- Grievances can have multiple attachments and comments
- Status changes are tracked in history
- Users receive notifications

## 🔐 Authentication & Authorization

### JWT Authentication
- Stateless authentication with JWT tokens
- Token expiration and refresh handling
- Secure password hashing with bcrypt

### Role-based Access Control
- **ADMIN** - Full system access
- **STAFF** - Grievance management
- **USER** - Submit and track own grievances

### Security Features
- Password strength validation
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload security checks
- CORS configuration

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run setup        # Complete setup (push + generate + seed)
npm run verify       # Verify system setup
npm run reset        # Reset database and reseed
npm test             # Run tests
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Error description",
  "details": [ ... ]
}
```

## 🔍 Validation

### Input Validation
- All inputs validated with express-validator
- Custom validation rules for business logic
- Comprehensive error messages

### File Upload Validation
- File type restrictions
- File size limits
- Secure file storage

## 📝 Logging

- Request logging with Morgan
- Error logging with timestamps
- API response time tracking
- Database query logging in development

## 🚀 Deployment

### Production Checklist
- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secret
- Enable HTTPS
- Configure reverse proxy
- Set up monitoring

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@prod-host:3306/grievance_db"
JWT_SECRET=secure-production-secret
PORT=3001
```

## 🤝 Contributing

1. Follow existing code style
2. Add proper error handling
3. Include input validation
4. Write meaningful commit messages
5. Test your changes

## 📝 License

MIT License - see the main project LICENSE file for details.
