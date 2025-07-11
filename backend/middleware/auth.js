import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token or user not found'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token verification failed'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
  next();
};

// Middleware to check if user can access resource (own data or admin)
const requireOwnershipOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user.role === 'admin' || req.user.id == resourceUserId) {
    next();
  } else {
    return res.status(403).json({
      error: 'Access denied',
      message: 'You can only access your own data'
    });
  }
};

export {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin
};
