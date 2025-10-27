const { Op } = require('sequelize');
const { Job, EmployerProfile } = require('../models');
const { LISTING_TYPE_ENUM, JOB_STATUS_ENUM, EMPLOYMENT_TYPE_ENUM } = require('../models/enums');

exports.list = async (req, res) => {
  try {
    const { q, category, location, type, page = 1, limit = 10 } = req.query;
    const where = { status: 'approved' };

    // Use Op.like for SQLite compatibility (SQLite LIKE is case-insensitive by default)
    // For PostgreSQL in production, consider using Op.iLike
    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { requirements: { [Op.like]: `%${q}%` } },
      ];
    }
    if (category) where.category = category;
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (type) where.employment_type = type;

    const jobs = await Job.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      include: [{ model: EmployerProfile, as: 'employer', attributes: ['id', 'company_name', 'type', 'sector'] }],
    });

    res.json({
      data: jobs.rows,
      pagination: { total: jobs.count, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
};

exports.details = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: EmployerProfile, as: 'employer', attributes: ['id', 'company_name', 'type', 'sector', 'verification_status'] }],
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get job details' });
  }
};

exports.create = async (req, res) => {
  try {
    // Temporarily skip auth check for testing - TODO: Re-enable for production
    // For testing: Use any existing employer profile
    let employer;
    
    // Try to find employer by userId if authenticated
    if (req.auth && req.auth.userId) {
      employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
      if (employer) {
        console.log('✅ [DEV] Using authenticated employer:', employer.company_name);
      }
    }
    
    // If no employer found, use the first available employer profile (for testing)
    if (!employer) {
      employer = await EmployerProfile.findOne();
      if (employer) {
        console.log('🔧 [DEV] Using test employer profile:', employer.company_name);
      }
    }
    
    // If still no employer exists, return error
    if (!employer) {
      return res.status(400).json({ 
        error: 'No employer profile found in the system', 
        hint: 'Please register as an employer first'
      });
    }

    const payload = req.body;
    // Enforce constraints: listing_type and expiry_date
    if (!payload.expiry_date) return res.status(400).json({ error: 'expiry_date is required' });
    // Convert listing_type if missing
    if (!payload.listing_type) payload.listing_type = 'free';
    // Auto-approve jobs (skip payment for testing)
    if (!payload.status) payload.status = 'approved';
    if (!payload.vacancies) payload.vacancies = 1;

    const job = await Job.create({
      employer_id: employer.id,
      title: payload.title,
      description: payload.description,
      requirements: payload.requirements,
      category: payload.category,
      employment_type: payload.employment_type,
      location: payload.location,
      salary: payload.salary,
      expiry_date: payload.expiry_date,
      listing_type: payload.listing_type,
      status: payload.status,
      vacancies: payload.vacancies,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Error creating job:', err);
    console.error('Error details:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.auth.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    await job.update(req.body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.remove = async (req, res) => {
  try {
    if (req.auth.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

// Get jobs for current employer
exports.employerJobs = async (req, res) => {
  try {
    // For testing: use any employer profile
    let employer;
    
    if (req.auth && req.auth.userId) {
      employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
    }
    
    if (!employer) {
      employer = await EmployerProfile.findOne();
      console.log('🔧 [DEV] Using test employer for fetching jobs:', employer?.company_name);
    }
    
    if (!employer) {
      return res.json([]);
    }

    const jobs = await Job.findAll({
      where: { employer_id: employer.id },
      order: [['created_at', 'DESC']],
      include: [{ model: EmployerProfile, as: 'employer', attributes: ['id', 'company_name', 'type', 'sector'] }],
    });

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching employer jobs:', err);
    res.status(500).json({ error: 'Failed to fetch employer jobs' });
  }
};

// Get job categories
exports.categories = async (req, res) => {
  try {
    const { CATEGORY_VALUES } = require('../models/enums');
    
    // Return categories as array of objects with name and value
    const categories = CATEGORY_VALUES.map(cat => ({
      value: cat,
      label: cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));
    
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get featured/premium jobs
exports.featured = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const jobs = await Job.findAll({
      where: { 
        status: 'approved',
        listing_type: 'premium'
      },
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      include: [{ model: EmployerProfile, as: 'employer', attributes: ['id', 'company_name', 'type', 'sector'] }],
    });

    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch featured jobs' });
  }
};
