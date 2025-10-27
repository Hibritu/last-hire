const { User, Job, Application, EmployerProfile, Payment, Chat } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Admin Controller
 * Handles all admin-specific operations: analytics, user management, moderation
 */

// GET /api/admin/dashboard/metrics
exports.getDashboardMetrics = async (req, res) => {
  try {
    console.log('📊 [ADMIN] Fetching dashboard metrics...');

    // Get basic counts one by one to isolate any errors
    const totalUsers = await User.count().catch(e => { console.error('Error counting users:', e); return 0; });
    const totalEmployers = await User.count({ where: { role: 'employer' } }).catch(e => { console.error('Error counting employers:', e); return 0; });
    const totalJobs = await Job.count().catch(e => { console.error('Error counting jobs:', e); return 0; });
    const totalApplications = await Application.count().catch(e => { console.error('Error counting applications:', e); return 0; });
    const activeJobs = await Job.count({ where: { status: 'approved' } }).catch(e => { console.error('Error counting approved jobs:', e); return 0; });
    const pendingJobApprovals = await Job.count({ where: { status: 'pending' } }).catch(e => { console.error('Error counting pending jobs:', e); return 0; });
    const pendingEmployerVerifications = await User.count({ where: { role: 'employer', is_verified: false } }).catch(e => { console.error('Error counting unverified employers:', e); return 0; });

    const metrics = {
      totalUsers,
      totalEmployers,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingJobApprovals,
      pendingEmployerVerifications,
      userGrowth: 12.5,
      employerGrowth: 8.3,
      jobGrowth: 15.2,
      monthlyRevenue: 0,
      totalRevenue: 0
    };

    console.log('✅ [ADMIN] Dashboard metrics:', metrics);
    res.json(metrics);
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching dashboard metrics:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics', details: error.message });
  }
};

// GET /api/admin/users - Get all users with filtering
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, limit = 50, offset = 0 } = req.query;
    console.log('👥 [ADMIN] Fetching users:', { role, status, search });

    const where = {};
    
    if (role) where.role = role;
    if (status) {
      if (status === 'active') where.is_active = true;
      if (status === 'suspended') where.is_active = false;
      if (status === 'pending') where.is_verified = false;
    }
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: [
        'id', 'email', 'role', 'first_name', 'last_name', 
        'phone', 'gender', 'is_verified', 'is_active',
        'created_at', 'updated_at', 'suspended_at'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Get application counts for job seekers
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toJSON();
        
        if (user.role === 'job_seeker') {
          userObj.applicationCount = await Application.count({ where: { user_id: user.id } });
        } else if (user.role === 'employer') {
          userObj.jobCount = await Job.count({ where: { employer_id: user.id } });
        }
        
        return userObj;
      })
    );

    console.log(`✅ [ADMIN] Found ${usersWithStats.length} users`);
    res.json({ users: usersWithStats, total: usersWithStats.length });
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

// PUT /api/admin/users/:id/status - Update user status (suspend/activate)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    console.log(`🔧 [ADMIN] Updating user ${id} status to ${status}`);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (status === 'suspended') {
      user.is_active = false;
      user.suspended_at = new Date();
    } else if (status === 'active') {
      user.is_active = true;
      user.suspended_at = null;
    } else if (status === 'verified') {
      user.is_verified = true;
    }

    await user.save();

    console.log(`✅ [ADMIN] User ${id} status updated to ${status}`);
    res.json({ message: 'User status updated', user });
  } catch (error) {
    console.error('❌ [ADMIN] Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status', details: error.message });
  }
};

// GET /api/admin/employers - Get all employer profiles with verification status
exports.getAllEmployers = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    console.log('🏢 [ADMIN] Fetching employers:', { status, search });

    const where = {};
    
    if (status) {
      if (status === 'pending') where.is_verified = false;
      if (status === 'approved') where.is_verified = true;
      // TODO: Add suspended status when implemented
    }

    const employers = await User.findAll({
      where: {
        role: 'employer',
        ...where
      },
      include: [{
        model: EmployerProfile,
        as: 'employerProfile',
        required: false
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Get job counts for each employer
    const employersWithStats = await Promise.all(
      employers.map(async (employer) => {
        const empObj = employer.toJSON();
        empObj.totalJobs = await Job.count({ where: { employer_id: employer.id } });
        empObj.activeJobs = await Job.count({ where: { employer_id: employer.id, status: 'approved' } });
        return empObj;
      })
    );

    console.log(`✅ [ADMIN] Found ${employersWithStats.length} employers`);
    res.json({ employers: employersWithStats, total: employersWithStats.length });
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching employers:', error);
    res.status(500).json({ error: 'Failed to fetch employers', details: error.message });
  }
};

// PUT /api/admin/employers/:id/verify - Verify or reject employer
exports.verifyEmployer = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    console.log(`🔧 [ADMIN] Updating employer ${id} verification to ${status}`);

    const user = await User.findByPk(id);
    if (!user || user.role !== 'employer') {
      return res.status(404).json({ error: 'Employer not found' });
    }

    if (status === 'approved') {
      user.is_verified = true;
    } else if (status === 'rejected') {
      user.is_verified = false;
      // TODO: Store rejection reason
    }

    await user.save();

    console.log(`✅ [ADMIN] Employer ${id} verification updated to ${status}`);
    res.json({ message: 'Employer verification updated', user });
  } catch (error) {
    console.error('❌ [ADMIN] Error verifying employer:', error);
    res.status(500).json({ error: 'Failed to verify employer', details: error.message });
  }
};

// GET /api/admin/jobs - Get all jobs for moderation
exports.getAllJobs = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    console.log('💼 [ADMIN] Fetching jobs for moderation:', { status, search });

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const jobs = await Job.findAll({
      where,
      include: [{
        model: EmployerProfile,
        as: 'employer',
        attributes: ['company_name', 'type']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    // Get application counts
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const jobObj = job.toJSON();
        jobObj.applicationCount = await Application.count({ where: { job_id: job.id } });
        return jobObj;
      })
    );

    console.log(`✅ [ADMIN] Found ${jobsWithStats.length} jobs`);
    res.json({ jobs: jobsWithStats, total: jobsWithStats.length });
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
};

// PUT /api/admin/jobs/:id/approve - Approve or reject a job posting
exports.approveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    console.log(`🔧 [ADMIN] Updating job ${id} status to ${status}`);

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (status === 'approved') {
      job.status = 'active';
    } else if (status === 'rejected') {
      job.status = 'rejected';
      // TODO: Store rejection reason
    } else if (status === 'flagged') {
      job.status = 'flagged';
    }

    await job.save();

    console.log(`✅ [ADMIN] Job ${id} status updated to ${status}`);
    res.json({ message: 'Job status updated', job });
  } catch (error) {
    console.error('❌ [ADMIN] Error approving job:', error);
    res.status(500).json({ error: 'Failed to update job status', details: error.message });
  }
};

// DELETE /api/admin/jobs/:id - Delete a job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ [ADMIN] Deleting job ${id}`);

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await job.destroy();

    console.log(`✅ [ADMIN] Job ${id} deleted`);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('❌ [ADMIN] Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job', details: error.message });
  }
};

// GET /api/admin/applications - Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    console.log('📝 [ADMIN] Fetching all applications:', { status });

    const where = {};
    if (status) where.status = status;

    const applications = await Application.findAll({
      where,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'employer_id'],
          include: [{
            model: EmployerProfile,
            as: 'employer',
            attributes: ['company_name']
          }]
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    console.log(`✅ [ADMIN] Found ${applications.length} applications`);
    res.json({ applications, total: applications.length });
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
  }
};

// GET /api/admin/analytics - Get platform analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    console.log(`📈 [ADMIN] Fetching analytics for ${period} days`);

    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const [
      newUsers,
      newJobs,
      newApplications,
      topCategories
    ] = await Promise.all([
      User.findAll({
        where: { created_at: { [Op.gte]: daysAgo } },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      }),
      Job.findAll({
        where: { created_at: { [Op.gte]: daysAgo } },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      }),
      Application.findAll({
        where: { created_at: { [Op.gte]: daysAgo } },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
      }),
      Job.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
      })
    ]);

    res.json({
      newUsers,
      newJobs,
      newApplications,
      topCategories
    });
  } catch (error) {
    console.error('❌ [ADMIN] Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
};

module.exports = exports;
