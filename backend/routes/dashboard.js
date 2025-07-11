import express from 'express';
import prisma from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total counts
    const totalGrievances = await prisma.grievance.count();
    
    const pendingGrievances = await prisma.grievance.count({
      where: { status: 'PENDING' }
    });

    const inProgressGrievances = await prisma.grievance.count({
      where: { status: 'IN_PROGRESS' }
    });

    const resolvedGrievances = await prisma.grievance.count({
      where: { 
        status: { 
          in: ['RESOLVED', 'CLOSED'] 
        } 
      }
    });

    const closedGrievances = await prisma.grievance.count({
      where: { status: 'CLOSED' }
    });

    const urgentGrievances = await prisma.grievance.count({
      where: { priority: 'URGENT' }
    });

    const highPriorityGrievances = await prisma.grievance.count({
      where: { priority: 'HIGH' }
    });

    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });

    // Get grievances by priority
    const priorityStats = await prisma.grievance.groupBy({
      by: ['priority'],
      _count: {
        id: true
      }
    });

    // Get grievances by status
    const statusStats = await prisma.grievance.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get grievances by category
    const categoryStats = await prisma.grievance.groupBy({
      by: ['categoryId'],
      _count: {
        id: true
      },
      where: {
        categoryId: {
          not: null
        }
      }
    });

    // Get category names
    const categories = await prisma.grievanceCategory.findMany({
      select: {
        id: true,
        name: true
      }
    });

    // Map category stats with names
    const categoryStatsWithNames = categoryStats.map(stat => {
      const category = categories.find(cat => cat.id === stat.categoryId);
      return {
        category: category?.name || 'Unknown',
        count: stat._count.id
      };
    });

    // Get today's grievances
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayGrievances = await prisma.grievance.count({
      where: {
        submissionDate: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get this week's grievances
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const thisWeekGrievances = await prisma.grievance.count({
      where: {
        submissionDate: {
          gte: startOfWeek
        }
      }
    });

    // Get this month's grievances
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const thisMonthGrievances = await prisma.grievance.count({
      where: {
        submissionDate: {
          gte: startOfMonth
        }
      }
    });

    res.json({
      totalStats: {
        total_grievances: totalGrievances,
        pending_grievances: pendingGrievances,
        in_progress_grievances: inProgressGrievances,
        resolved_grievances: resolvedGrievances,
        closed_grievances: closedGrievances,
        urgent_grievances: urgentGrievances,
        high_priority_grievances: highPriorityGrievances,
        active_users: activeUsers,
        today_grievances: todayGrievances,
        this_week_grievances: thisWeekGrievances,
        this_month_grievances: thisMonthGrievances
      },
      priorityBreakdown: priorityStats.map(stat => ({
        priority: stat.priority.toLowerCase(),
        count: stat._count.id
      })),
      statusBreakdown: statusStats.map(stat => ({
        status: stat.status.toLowerCase(),
        count: stat._count.id
      })),
      categoryBreakdown: categoryStatsWithNames,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get recent grievances
router.get('/recent-grievances', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentGrievances = await prisma.grievance.findMany({
      take: limit,
      orderBy: {
        submissionDate: 'desc'
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
        }
      }
    });

    const formattedGrievances = recentGrievances.map(grievance => ({
      id: grievance.id,
      title: grievance.title,
      description: grievance.description,
      status: grievance.status.toLowerCase(),
      priority: grievance.priority.toLowerCase(),
      submission_date: grievance.submissionDate,
      due_date: grievance.dueDate,
      resolution_date: grievance.resolutionDate,
      user: {
        id: grievance.user.id,
        name: `${grievance.user.firstName} ${grievance.user.lastName}`,
        email: grievance.user.email,
        department: grievance.user.department
      },
      category: grievance.category ? {
        id: grievance.category.id,
        name: grievance.category.name
      } : null,
      assignee: grievance.assignedUser ? {
        id: grievance.assignedUser.id,
        name: `${grievance.assignedUser.firstName} ${grievance.assignedUser.lastName}`,
        email: grievance.assignedUser.email
      } : null,
      created_at: grievance.createdAt,
      updated_at: grievance.updatedAt
    }));

    res.json({
      grievances: formattedGrievances,
      total: formattedGrievances.length
    });

  } catch (error) {
    console.error('Recent grievances error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch recent grievances'
    });
  }
});

// Get monthly statistics (Admin only)
router.get('/monthly-stats', requireAdmin, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    // Get monthly grievance counts
    const monthlyData = await prisma.$queryRaw`
      SELECT 
        MONTH(submission_date) as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'RESOLVED' OR status = 'CLOSED' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress
      FROM grievances 
      WHERE YEAR(submission_date) = ${year}
      GROUP BY MONTH(submission_date)
      ORDER BY MONTH(submission_date)
    `;

    // Fill missing months with zeros
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedData = monthNames.map((name, index) => {
      const monthData = monthlyData.find(data => Number(data.month) === index + 1);
      return {
        month: name,
        total: monthData ? Number(monthData.total) : 0,
        resolved: monthData ? Number(monthData.resolved) : 0,
        pending: monthData ? Number(monthData.pending) : 0,
        in_progress: monthData ? Number(monthData.in_progress) : 0
      };
    });

    res.json({
      year,
      data: formattedData
    });

  } catch (error) {
    console.error('Monthly stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch monthly statistics'
    });
  }
});

// Get performance metrics (Admin only)
router.get('/performance', requireAdmin, async (req, res) => {
  try {
    // Average resolution time
    const resolvedGrievances = await prisma.grievance.findMany({
      where: {
        status: {
          in: ['RESOLVED', 'CLOSED']
        },
        resolutionDate: {
          not: null
        }
      },
      select: {
        submissionDate: true,
        resolutionDate: true
      }
    });

    let averageResolutionTime = 0;
    if (resolvedGrievances.length > 0) {
      const totalResolutionTime = resolvedGrievances.reduce((total, grievance) => {
        const resolutionTime = new Date(grievance.resolutionDate) - new Date(grievance.submissionDate);
        return total + resolutionTime;
      }, 0);
      
      averageResolutionTime = Math.round(totalResolutionTime / resolvedGrievances.length / (1000 * 60 * 60 * 24)); // Convert to days
    }

    // User satisfaction rate (mock data - implement survey system later)
    const satisfactionRate = 94;

    // Most active departments
    const departmentStats = await prisma.user.groupBy({
      by: ['department'],
      _count: {
        grievances: true
      },
      where: {
        department: {
          not: null
        }
      },
      orderBy: {
        _count: {
          grievances: 'desc'
        }
      },
      take: 5
    });

    res.json({
      averageResolutionTime,
      satisfactionRate,
      activeDepartments: departmentStats.map(dept => ({
        department: dept.department,
        grievanceCount: dept._count.grievances
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch performance metrics'
    });
  }
});

export default router;
