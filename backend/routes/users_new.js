import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation rules for user updates
const updateUserValidation = [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number format'),
  body('department').optional().trim().isLength({ min: 2 }).withMessage('Department must be at least 2 characters long'),
  body('role').optional().isIn(['ADMIN', 'USER', 'STAFF']).withMessage('Role must be ADMIN, USER, or STAFF')
];

const passwordChangeValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
];

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      role, 
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role.toUpperCase();
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          department: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              grievances: true,
              assignedGrievances: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role.toLowerCase(),
        phone: user.phone,
        department: user.department,
        is_active: user.isActive,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        grievances_count: user._count.grievances,
        assigned_grievances_count: user._count.assignedGrievances
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / take),
        totalItems: total,
        itemsPerPage: take
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch users'
    });
  }
});

// Get user by ID
router.get('/:id', requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            grievances: true,
            assignedGrievances: true,
            comments: true,
            notifications: {
              where: { isRead: false }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role.toLowerCase(),
      phone: user.phone,
      department: user.department,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      stats: {
        grievances_count: user._count.grievances,
        assigned_grievances_count: user._count.assignedGrievances,
        comments_count: user._count.comments,
        unread_notifications: user._count.notifications
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch user'
    });
  }
});

// Update user profile
router.put('/:id', requireOwnershipOrAdmin, updateUserValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { firstName, lastName, phone, department, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Prepare update data
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (department !== undefined) updateData.department = department;

    // Only admins can change roles
    if (role !== undefined && req.user.role === 'ADMIN') {
      updateData.role = role.toUpperCase();
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        role: updatedUser.role.toLowerCase(),
        phone: updatedUser.phone,
        department: updatedUser.department,
        is_active: updatedUser.isActive,
        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user'
    });
  }
});

// Change password
router.put('/:id/password', requireOwnershipOrAdmin, passwordChangeValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        passwordHash: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid current password',
        message: 'The current password provided is incorrect'
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { passwordHash: newPasswordHash }
    });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to change password'
    });
  }
});

// Toggle user active status (admin only)
router.put('/:id/toggle-status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, isActive: true, firstName: true, lastName: true }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        role: updatedUser.role.toLowerCase(),
        is_active: updatedUser.isActive,
        updated_at: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to toggle user status'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, firstName: true, lastName: true }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with the specified ID does not exist'
      });
    }

    // Check if user has active grievances
    const activeGrievancesCount = await prisma.grievance.count({
      where: {
        userId: parseInt(id),
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      }
    });

    if (activeGrievancesCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete user',
        message: 'User has active grievances. Please resolve them first.'
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user'
    });
  }
});

export default router;
