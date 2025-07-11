import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Validation rules
const grievanceValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('categoryId').optional().isInt().withMessage('Category ID must be a valid integer'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority level')
];

// Get all grievances (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      categoryId,
      search,
      sortBy = 'submissionDate',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (status) {
      where.status = status.toUpperCase();
    }

    if (priority) {
      where.priority = priority.toUpperCase();
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // If not admin, only show user's own grievances
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const [grievances, total] = await Promise.all([
      prisma.grievance.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              department: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          attachments: {
            select: {
              id: true,
              fileName: true,
              fileSize: true,
              fileType: true,
              uploadedAt: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      }),
      prisma.grievance.count({ where })
    ]);

    res.json({
      grievances: grievances.map(grievance => ({
        id: grievance.id,
        title: grievance.title,
        description: grievance.description,
        status: grievance.status.toLowerCase(),
        priority: grievance.priority.toLowerCase(),
        submissionDate: grievance.submissionDate,
        dueDate: grievance.dueDate,
        resolutionDate: grievance.resolutionDate,
        resolutionNotes: grievance.resolutionNotes,
        user: grievance.user,
        category: grievance.category,
        assignedUser: grievance.assignedUser,
        attachments: grievance.attachments,
        commentsCount: grievance._count.comments,
        createdAt: grievance.createdAt,
        updatedAt: grievance.updatedAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / take),
        totalItems: total,
        itemsPerPage: take
      }
    });

  } catch (error) {
    console.error('Get grievances error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch grievances'
    });
  }
});

// Get grievance by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const grievance = await prisma.grievance.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            department: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        attachments: {
          select: {
            id: true,
            fileName: true,
            filePath: true,
            fileSize: true,
            fileType: true,
            uploadedAt: true,
            uploader: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        statusHistory: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            changedAt: 'asc'
          }
        }
      }
    });

    if (!grievance) {
      return res.status(404).json({
        error: 'Grievance not found',
        message: 'Grievance with the specified ID does not exist'
      });
    }

    // Check if user has permission to view this grievance
    if (req.user.role !== 'ADMIN' && grievance.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this grievance'
      });
    }

    res.json({
      id: grievance.id,
      title: grievance.title,
      description: grievance.description,
      status: grievance.status.toLowerCase(),
      priority: grievance.priority.toLowerCase(),
      submissionDate: grievance.submissionDate,
      dueDate: grievance.dueDate,
      resolutionDate: grievance.resolutionDate,
      resolutionNotes: grievance.resolutionNotes,
      user: grievance.user,
      category: grievance.category,
      assignedUser: grievance.assignedUser,
      attachments: grievance.attachments,
      comments: grievance.comments.map(comment => ({
        id: comment.id,
        comment: comment.comment,
        isInternal: comment.isInternal,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: comment.user
      })),
      statusHistory: grievance.statusHistory.map(history => ({
        id: history.id,
        oldStatus: history.oldStatus?.toLowerCase(),
        newStatus: history.newStatus.toLowerCase(),
        changeReason: history.changeReason,
        changedAt: history.changedAt,
        user: history.user
      })),
      createdAt: grievance.createdAt,
      updatedAt: grievance.updatedAt
    });

  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch grievance'
    });
  }
});

// Create new grievance
router.post('/', upload.array('attachments', 5), grievanceValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      title,
      description,
      categoryId,
      priority = 'MEDIUM',
      dueDate
    } = req.body;

    // Create grievance
    const grievance = await prisma.grievance.create({
      data: {
        title,
        description,
        categoryId: categoryId ? parseInt(categoryId) : null,
        userId: req.user.id,
        priority: priority.toUpperCase(),
        status: 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Create initial status history
    await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: grievance.id,
        oldStatus: null,
        newStatus: 'PENDING',
        changedBy: req.user.id,
        changeReason: 'Initial submission'
      }
    });

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const attachmentPromises = req.files.map(file => 
        prisma.grievanceAttachment.create({
          data: {
            grievanceId: grievance.id,
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.mimetype,
            uploadedBy: req.user.id
          }
        })
      );

      await Promise.all(attachmentPromises);
    }

    // Create notification for admins
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    if (adminUsers.length > 0) {
      const notificationPromises = adminUsers.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'New Grievance Submitted',
            message: `A new grievance "${title}" has been submitted by ${req.user.firstName} ${req.user.lastName}`,
            type: 'INFO',
            grievanceId: grievance.id
          }
        })
      );

      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      message: 'Grievance created successfully',
      grievance: {
        id: grievance.id,
        title: grievance.title,
        description: grievance.description,
        status: grievance.status.toLowerCase(),
        priority: grievance.priority.toLowerCase(),
        submissionDate: grievance.submissionDate,
        user: grievance.user,
        category: grievance.category,
        createdAt: grievance.createdAt
      }
    });

  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create grievance'
    });
  }
});

export default router;
