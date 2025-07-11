# Grievance Management System - Setup Guide

## Project Overview
A comprehensive grievance management system built with React (frontend) and Express.js with Prisma ORM (backend).

## Prerequisites
- Node.js (version 16 or higher)
- MySQL Server
- npm or yarn package manager

## Database Setup

### 1. Install MySQL
Make sure MySQL Server is installed and running on your system.

### 2. Create Database
```sql
CREATE DATABASE grievance_management_system;
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grievance_management_system
DB_USER=root
DB_PASSWORD=your_mysql_password

# Prisma Database URL
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/grievance_management_system"

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
```

## Installation Steps

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Push database schema:**
   ```bash
   npx prisma db push
   ```

5. **Seed the database (optional):**
   ```bash
   npm run db:seed
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to root directory:**
   ```bash
   cd ..
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

## Database Schema

The system uses the following main entities:

### Users
- User authentication and authorization
- Role-based access (ADMIN, USER, STAFF)
- Profile management

### Grievances
- Grievance submission and tracking
- Category-based organization
- Status workflow (PENDING → IN_PROGRESS → RESOLVED → CLOSED)
- File attachments support

### Comments & Communication
- Threaded comments on grievances
- Real-time notifications
- Status change history

## API Endpoints

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

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data

## Default Admin User

After seeding the database, you can login with:
- **Username:** admin
- **Password:** admin123

## Development Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm test             # Run tests
```

### Frontend Scripts
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run lint         # Run ESLint
```

## Features

### User Features
- User registration and authentication
- Submit grievances with file attachments
- Track grievance status and progress
- Add comments and updates
- Receive notifications
- Dashboard with personal statistics

### Admin Features
- User management
- Grievance assignment and workflow management
- Category management
- System-wide dashboard and analytics
- Advanced filtering and search
- Export functionality

### Technical Features
- JWT-based authentication
- Role-based authorization
- File upload with validation
- Real-time notifications
- Responsive design
- Search and filtering
- Pagination
- Error handling and validation

## Troubleshooting

### Database Connection Issues
1. Verify MySQL server is running
2. Check database credentials in `.env` file
3. Ensure database exists
4. Check firewall settings

### Prisma Issues
1. Run `npx prisma generate` after schema changes
2. Use `npx prisma db push` to sync schema
3. Check DATABASE_URL format

### Common Errors
- **Port already in use:** Change PORT in `.env` file
- **JWT errors:** Ensure JWT_SECRET is set
- **File upload errors:** Check file size and type restrictions

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure proper database credentials
4. Set up SSL certificates
5. Configure reverse proxy (nginx/Apache)

### Security Considerations
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Sanitize file uploads
- Regular security updates

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify environment configuration
4. Check database connectivity

## License
MIT License - see LICENSE file for details.
