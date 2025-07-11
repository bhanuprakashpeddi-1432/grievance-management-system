# Grievance Management System

Complete grievance management system with React frontend and Node.js backend.

## 🚀 Features

- **Modern React 18** with TypeScript
- **RSuite UI Components** for professional interface
- **Responsive Design** for all devices
- **Real-time Dashboard** with charts and statistics
- **Authentication** with JWT tokens
- **Form Validation** with comprehensive error handling
- **File Upload** support for attachments
- **Search & Filter** functionality
- **Prisma ORM** with MySQL database
- **Role-based Access Control** (Admin, Staff, User)

## 🛠️ Tech Stack

**Frontend:**
- React 18.2.0 with TypeScript
- RSuite 5.28.2 UI Framework
- React Router 6.16.0 for navigation
- Axios for API communication
- Webpack for bundling
- Less for styling

**Backend:**
- Node.js with Express.js
- Prisma ORM 5.9.1
- MySQL database
- JWT authentication
- bcrypt for password hashing
- Express middleware (CORS, Helmet, Rate limiting)

**Database:**
- MySQL 8.0+ with Prisma ORM
- Database migrations and seeding
- Connection pooling
- Transaction support

## 📁 Project Structure

```
grievance-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── package.json
│   └── webpack.config.js
├── backend/                 # Node.js backend API
│   ├── prisma/             # Database schema and migrations
│   ├── routes/             # API route handlers
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   ├── database/           # Database utilities
│   ├── package.json
│   └── server.js
├── package.json            # Workspace configuration
└── README.md

## � Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning the repository)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhanuprakashpeddi-1432/grievance-management-system.git
   cd grievance-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   cd ..
   ```

3. **Configure Database**
   
   Create a MySQL database and update the connection string in `backend/.env`:
   ```env
   DATABASE_URL="mysql://root:admin@localhost:3306/grievance_management_system"
   ```

4. **Setup Database Schema**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the Application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   # Backend runs on http://localhost:3002
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

## 🗄️ Database Schema

The application uses Prisma ORM with a normalized MySQL database schema:

- **User** - User accounts and authentication
- **Grievance** - Main grievance records  
- **GrievanceCategory** - Categories for organizing grievances
- **GrievanceComment** - Comments and updates on grievances
- **GrievanceAttachment** - File attachments
- **GrievanceStatusHistory** - Status change tracking
- **Notification** - User notifications

## 🔐 Default Login Credentials

### Admin Account
- **Email:** admin@grievance.com
- **Password:** admin123
- **Role:** Admin

### Staff Accounts
- **Email:** jane.smith@company.com
- **Password:** password123
- **Role:** Staff

### User Accounts
- **Email:** john.doe@company.com
- **Password:** password123
- **Role:** User

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile

### Grievances
- `GET /api/grievances` - Get all grievances
- `POST /api/grievances` - Create new grievance
- `GET /api/grievances/:id` - Get specific grievance
- `PUT /api/grievances/:id` - Update grievance
- `DELETE /api/grievances/:id` - Delete grievance
- `PATCH /api/grievances/:id/status` - Update grievance status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts` - Get chart data
- `GET /api/dashboard/recent` - Get recent activities

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

## 📱 Usage

### For Users
1. **Register/Login** - Create an account or login with existing credentials
2. **Submit Grievance** - Navigate to "Submit Grievance" and fill out the form
3. **Track Status** - Monitor your grievances in the dashboard
4. **Add Comments** - Communicate with staff through comments
5. **View Notifications** - Stay updated with real-time notifications

### For Staff/Admins
1. **Dashboard Overview** - Monitor all grievances and statistics
2. **Manage Grievances** - Assign, update status, and resolve grievances
3. **User Management** - View and manage user accounts (Admin only)
4. **Reports** - Generate and view analytical reports
5. **System Settings** - Configure system preferences (Admin only)

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Environment Configuration
NODE_ENV=development
PORT=3002

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grievance_management_system
DB_USER=root
DB_PASSWORD=admin

# Prisma Database URL
DATABASE_URL="mysql://root:admin@localhost:3306/grievance_management_system"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Security
BCRYPT_ROUNDS=10
```

### Frontend Configuration

The frontend API URL is configured in `webpack.config.js`:
```javascript
REACT_APP_API_URL: 'http://localhost:3002/api'
```

## 🚀 Deployment

### Production Build

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set Production Environment:**
   ```bash
   # Update backend/.env
   NODE_ENV=production
   PORT=3002
   ```

3. **Deploy with Docker (Recommended):**
   ```bash
   # Build and run with docker-compose
   docker-compose up -d
   ```

### Database Migration in Production

```bash
cd backend
npx prisma migrate deploy
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Database Operations
```bash
# Reset database
cd backend
npx prisma migrate reset

# View database
npx prisma studio
```

## 📊 Performance

### Frontend Optimization
- Code splitting with React.lazy
- Memoization with React.memo
- Efficient state management
- Lazy loading of components

### Backend Optimization
- Database connection pooling
- Query optimization with indexes
- Caching strategies
- Rate limiting

### Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Regular maintenance

## 🔒 Security

### Implemented Security Measures
- **Authentication:** JWT tokens with secure headers
- **Authorization:** Role-based access control
- **Input Validation:** Comprehensive validation on all inputs
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Input sanitization
- **CSRF Protection:** CSRF tokens
- **Rate Limiting:** API rate limiting
- **File Upload Security:** Type and size validation
- **Password Security:** Bcrypt hashing
- **HTTPS:** SSL/TLS encryption (production)

## 📈 Monitoring

### Logging
- Application logs with Winston
- Database query logs
- Error tracking and reporting
- Performance monitoring

### Metrics
- API response times
- Database query performance
- User activity tracking
- System resource usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- **GitHub:** [bhanuprakashpeddi-1432](https://github.com/bhanuprakashpeddi-1432)
- **Issues:** [GitHub Issues](https://github.com/bhanuprakashpeddi-1432/grievance-management-system/issues)

---

Made with ❤️ by [Bhanuprakash Peddi](https://github.com/bhanuprakashpeddi-1432)
