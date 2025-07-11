# Grievance Management System - Setup Guide

This guide will help you set up the Grievance Management System with MySQL and Prisma.

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Configuration

1. Create a MySQL database:
```sql
CREATE DATABASE grievance_management_system;
```

2. Update the `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grievance_management_system
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# Prisma Database URL
DATABASE_URL="mysql://your_mysql_username:your_mysql_password@localhost:3306/grievance_management_system"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Other configurations...
```

### 3. Database Setup with Prisma

```bash
# Generate Prisma client
npm run db:generate

# Push database schema to MySQL
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 4. Start the Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:3001`

## Frontend Setup

### 1. Install Dependencies

```bash
# In the root directory
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Quick Setup (All-in-one)

Run this command in the root directory to set up everything:

```bash
npm run setup
```

This will:
1. Install all dependencies
2. Set up the backend with Prisma
3. Seed the database with sample data

## Default Admin Account

After seeding, you can log in with:
- **Email**: admin@grievance.com
- **Password**: admin123

## Database Schema

The system includes the following main entities:

- **Users**: System users (admin, staff, students)
- **Grievance Categories**: Academic, Administrative, Personal, Technical
- **Grievances**: Main grievance records
- **Grievance Attachments**: File uploads
- **Grievance Comments**: Comments and updates
- **Grievance Status History**: Status change tracking
- **Notifications**: User notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Grievances
- `GET /api/grievances` - Get all grievances (with pagination)
- `GET /api/grievances/:id` - Get grievance by ID
- `POST /api/grievances` - Create new grievance
- `PUT /api/grievances/:id` - Update grievance
- `DELETE /api/grievances/:id` - Delete grievance

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-grievances` - Get recent grievances
- `GET /api/dashboard/analytics` - Get analytics data

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL server is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Prisma Client Error**
   - Run `npm run db:generate` to regenerate client
   - Check DATABASE_URL format

3. **JWT Token Error**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration settings

4. **File Upload Issues**
   - Ensure `uploads/` directory exists
   - Check file permissions
   - Verify UPLOAD_PATH in `.env`

### Development Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Update database credentials for production
3. Generate a secure JWT_SECRET
4. Build frontend: `npm run build`
5. Configure reverse proxy (nginx/apache)
6. Set up SSL certificates
7. Configure environment variables
8. Run database migrations: `npm run db:migrate`

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review logs in the console
3. Verify environment configuration
4. Check database connectivity
