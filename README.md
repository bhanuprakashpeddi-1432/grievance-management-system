# Grievance Management System - Frontend

React-based frontend application for the Grievance Management System.

## 🚀 Features

- **Modern React 18** with TypeScript
- **RSuite UI Components** for professional interface
- **Responsive Design** for all devices
- **Real-time Dashboard** with charts and statistics
- **Authentication** with JWT tokens
- **Form Validation** with comprehensive error handling
- **File Upload** support for attachments
- **Search & Filter** functionality

## 🛠️ Tech Stack

- React 18.2.0 with TypeScript
- RSuite 5.28.2 UI Framework
- React Router 6.16.0 for navigation
- Axios for API communication
- Webpack for bundling
- Less for styling

**Database:**
- MySQL 8.0+
- Connection pooling
- Transaction support
- Backup and recovery

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for cloning the repository)

## 🔧 Installation

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grievance-management-system.git
   cd grievance-management-system
   ```

2. **Run the setup script**
   
   **For Windows:**
   ```cmd
   setup.bat
   ```
   
   **For macOS/Linux:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grievance-management-system.git
   cd grievance-management-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   **Backend Configuration:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=grievance_management_system
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   
   # Other configurations...
   ```

   **Frontend Configuration:**
   ```bash
   # Create .env file in root directory
   echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
   echo "REACT_APP_ENVIRONMENT=development" >> .env
   ```

5. **Setup Database**
   ```bash
   # Make sure MySQL is running
   # Run the database setup script
   node setup-database.js
   ```

6. **Start the application**
   
   **Start Backend (Terminal 1):**
   ```bash
   cd backend
   npm start
   ```
   
   **Start Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses a normalized MySQL database schema with the following main tables:

- **users** - User accounts and authentication
- **grievances** - Main grievance records
- **grievance_categories** - Categories for organizing grievances
- **grievance_comments** - Comments and updates on grievances
- **grievance_attachments** - File attachments
- **grievance_status_history** - Status change tracking
- **notifications** - User notifications

## 🔐 Authentication

The application uses JWT-based authentication with the following default accounts:

### Default Admin Account
- **Email:** admin@company.com
- **Password:** password123
- **Role:** Admin

### Default Staff Account
- **Email:** jane.smith@company.com
- **Password:** password123
- **Role:** Staff

### Default User Account
- **Email:** john.doe@company.com
- **Password:** password123
- **Role:** User

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Grievances
- `GET /api/grievances` - Get all grievances
- `POST /api/grievances` - Create new grievance
- `GET /api/grievances/:id` - Get specific grievance
- `PUT /api/grievances/:id` - Update grievance
- `DELETE /api/grievances/:id` - Delete grievance
- `PATCH /api/grievances/:id/status` - Update status

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts/:type` - Get chart data
- `GET /api/dashboard/activities` - Get recent activities

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/change-password` - Change password

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

### Environment Variables

**Backend (.env):**
```env
# Server Configuration
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grievance_management_system
DB_USER=root
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### Database Configuration

The application automatically creates the database schema on first run. You can customize the database connection in `backend/config/database.js`.

## 🚀 Deployment

### Production Build

1. **Build Frontend:**
   ```bash
   npm run build
   ```

2. **Set Production Environment:**
   ```bash
   # Update backend/.env
   NODE_ENV=production
   PORT=3001
   
   # Update frontend build configuration
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

3. **Deploy Backend:**
   - Use PM2 for process management
   - Configure reverse proxy (nginx)
   - Set up SSL certificates
   - Configure database backups

4. **Deploy Frontend:**
   - Serve static files from `build` directory
   - Configure CDN for assets
   - Set up proper caching headers

### Docker Deployment

```dockerfile
# Dockerfile example included in repository
docker-compose up -d
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Integration tests
npm run test:integration
```

### Test Coverage
```bash
npm run test:coverage
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- **Email:** support@grievance-system.com
- **Documentation:** [Wiki](https://github.com/yourusername/grievance-management-system/wiki)
- **Issues:** [GitHub Issues](https://github.com/yourusername/grievance-management-system/issues)

## 🎯 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Real-time chat system
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] API documentation with Swagger
- [ ] Automated testing suite
- [ ] Performance monitoring dashboard

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added user authentication and dashboard
- **v1.2.0** - Enhanced form validation and file uploads
- **v1.3.0** - Backend API integration and MySQL database

## 🙏 Acknowledgments

- RSuite UI Framework for the amazing components
- React community for the excellent ecosystem
- Node.js and Express for the robust backend
- MySQL for the reliable database
- All contributors and testers

---

Made with ❤️ by [Your Name]
