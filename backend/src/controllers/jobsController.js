const { Op } = require('sequelize');
const { Job, EmployerProfile, UserJobFavorite } = require('../models');
const { LISTING_TYPE_ENUM, JOB_STATUS_ENUM, EMPLOYMENT_TYPE_ENUM } = require('../models/enums');
const { sendJobAlerts } = require('./notificationsController');

exports.list = async (req, res) => {
  try {
    const {
      q,
      category,
      location,
      type,
      page = 1,
      limit = 50, // Increased default limit to show more jobs
      salary_min,
      salary_max,
      listing_type,
      sort_by = 'created_at',
      sort_order = 'DESC',
      company_name,
      skills,
      experience_level
    } = req.query;

    const where = { status: 'approved' };

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
        { requirements: { [Op.iLike]: `%${q}%` } },
      ];
    }
    if (category) where.category = category;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (type) where.employment_type = type;
    if (listing_type) where.listing_type = listing_type;

    // Salary range filters
    if (salary_min || salary_max) {
      where.salary = {};
      if (salary_min) where.salary[Op.gte] = salary_min;
      if (salary_max) where.salary[Op.lte] = salary_max;
    }

    // Skills filter (if job requirements contain skills)
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({
        [Op.or]: skillList.map(skill => ({
          requirements: { [Op.iLike]: `%${skill}%` }
        }))
      });
    }

    // Experience level filter (basic implementation)
    if (experience_level) {
      // This is a simplified implementation - in a real app you'd have more sophisticated logic
      if (experience_level === 'entry') {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({
          requirements: { [Op.notLike]: '%senior%' }
        });
      } else if (experience_level === 'senior') {
        where[Op.and] = where[Op.and] || [];
        where[Op.and].push({
          requirements: { [Op.iLike]: '%senior%' }
        });
      }
    }

    // Company name filter
    const includeOptions = [{
      model: EmployerProfile,
      as: 'employer',
      attributes: ['id', 'company_name', 'type', 'sector'],
      required: company_name ? true : false
    }];

    if (company_name) {
      includeOptions[0].where = { company_name: { [Op.iLike]: `%${company_name}%` } };
    }

    // Sorting options
    const validSortFields = ['created_at', 'title', 'salary', 'location'];
    const validSortOrders = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = validSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';

    const jobs = await Job.findAndCountAll({
      where,
      include: includeOptions,
      order: [[sortField, sortDirection]],
      limit: Math.min(Number(limit), 100), // Cap at 100 to show all jobs
      offset: (Number(page) - 1) * Number(limit),
    });

    // Get available filter options for frontend
    const filterOptions = await getJobFilterOptions();

    res.json({
      data: jobs.rows,
      pagination: {
        total: jobs.count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(jobs.count / Number(limit))
      },
      filters: filterOptions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
};

// Helper function to get available filter options
async function getJobFilterOptions() {
  try {
    const [categories, locations, employmentTypes, salaryRanges] = await Promise.all([
      Job.findAll({
        attributes: [[Job.sequelize.fn('DISTINCT', Job.sequelize.col('category')), 'category']],
        where: { status: 'approved' },
        raw: true
      }),
      Job.findAll({
        attributes: [[Job.sequelize.fn('DISTINCT', Job.sequelize.col('location')), 'location']],
        where: { status: 'approved' },
        raw: true
      }),
      Job.findAll({
        attributes: [[Job.sequelize.fn('DISTINCT', Job.sequelize.col('employment_type')), 'employment_type']],
        where: { status: 'approved' },
        raw: true
      }),
      Job.findAll({
        attributes: [
          [Job.sequelize.fn('MIN', Job.sequelize.col('salary')), 'min_salary'],
          [Job.sequelize.fn('MAX', Job.sequelize.col('salary')), 'max_salary']
        ],
        where: { status: 'approved', salary: { [Op.ne]: null } },
        raw: true
      })
    ]);

    return {
      categories: [...new Set(categories.map(c => c.category).filter(Boolean))],
      locations: [...new Set(locations.map(l => l.location).filter(Boolean))],
      employment_types: [...new Set(employmentTypes.map(e => e.employment_type).filter(Boolean))],
      salary_range: {
        min: salaryRanges[0]?.min_salary || 0,
        max: salaryRanges[0]?.max_salary || 100000
      }
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
      categories: [],
      locations: [],
      employment_types: [],
      salary_range: { min: 0, max: 100000 }
    };
  }
}

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
    console.log('📝 [JOB CREATE] User:', req.user.id, 'Role:', req.user.role);
    console.log('📝 [JOB CREATE] Payload:', JSON.stringify(req.body, null, 2));
    
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    let employer = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    
    // Auto-create employer profile in development if it doesn't exist
    if (!employer && process.env.NODE_ENV !== 'production') {
      console.log('🔧 [DEV] Auto-creating employer profile for user:', req.user.id);
      const companyName = `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || 'Company';
      employer = await EmployerProfile.create({
        user_id: req.user.id,
        company_name: companyName,
        type: 'individual',
        verification_status: 'verified', // Auto-verify in dev
      });
      console.log('✅ [DEV] Created employer profile:', employer.id);
    }
    
    if (!employer) {
      return res.status(403).json({ 
        error: 'Employer profile required',
        message: 'Please create your employer profile first'
      });
    }

    // Check if employer is verified (skip in development)
    if (employer.verification_status !== 'verified' && process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
        error: 'Employer not verified', 
        message: 'Your employer profile must be verified by an admin before you can create jobs.',
        verification_status: employer.verification_status
      });
    }

    const payload = req.body;
    if (!payload.expiry_date) return res.status(400).json({ error: 'expiry_date is required' });
    if (!payload.listing_type) payload.listing_type = 'free';
    // Auto-approve jobs in development
    if (!payload.status) payload.status = process.env.NODE_ENV !== 'production' ? 'approved' : 'pending';
    if (!payload.vacancies) payload.vacancies = 1;

    // Convert employment_type from underscore to hyphen format (full_time -> full-time)
    let employmentType = payload.employment_type || 'full-time';
    employmentType = employmentType.replace('_', '-');

    const job = await Job.create({
      employer_id: employer.id,
      title: payload.title,
      description: payload.description,
      requirements: payload.requirements,
      category: payload.category,
      employment_type: employmentType,
      location: payload.location,
      salary: payload.salary,
      expiry_date: payload.expiry_date,
      listing_type: payload.listing_type,
      status: payload.status,
      vacancies: payload.vacancies,
    });

    // Send job alerts to matching users if job is approved
    if (job.status === 'approved') {
      sendJobAlerts(job).catch(err => console.error('Failed to send job alerts:', err));
    }

    console.log('✅ [JOB CREATE] Job created successfully:', job.id);
    res.status(201).json(job);
  } catch (err) {
    console.error('❌ [JOB CREATE] Error creating job:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Full Error:', err);
    if (err.errors) {
      console.error('Validation Errors:', JSON.stringify(err.errors, null, 2));
    }
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    // Check if employer is verified
    if (employer.verification_status !== 'verified') {
      return res.status(403).json({ 
        error: 'Employer not verified', 
        message: 'Your employer profile must be verified by an admin before you can update jobs.',
        verification_status: employer.verification_status
      });
    }

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    // Only allow updating specific fields
    const allowedFields = [
      'title', 'description', 'requirements', 'category', 
      'employment_type', 'location', 'salary', 'expiry_date', 
      'listing_type', 'vacancies'
    ];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Convert employment_type from underscore to hyphen format
    if (updateData.employment_type) {
      updateData.employment_type = updateData.employment_type.replace('_', '-');
    }

    await job.update(updateData);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.remove = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

exports.saveJob = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can save jobs' });
    }

    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if already saved
    const existing = await UserJobFavorite.findOne({
      where: { user_id: req.user.id, job_id: id }
    });

    if (existing) {
      return res.status(409).json({ error: 'Job already saved' });
    }

    // Save the job
    await UserJobFavorite.create({
      user_id: req.user.id,
      job_id: id
    });

    res.json({ message: 'Job saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save job' });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can unsave jobs' });
    }

    const { id } = req.params;

    const favorite = await UserJobFavorite.findOne({
      where: { user_id: req.user.id, job_id: id }
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Job not found in saved jobs' });
    }

    await favorite.destroy();
    res.json({ message: 'Job removed from saved jobs' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can view saved jobs' });
    }

    const { page = 1, limit = 10 } = req.query;

    const { rows: jobs, count } = await UserJobFavorite.findAndCountAll({
      where: { user_id: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        where: { status: 'approved' },
        include: [{
          model: EmployerProfile,
          as: 'employer',
          attributes: ['id', 'company_name', 'type', 'sector']
        }]
      }],
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    const savedJobs = jobs.map(favorite => favorite.job).filter(Boolean);

    res.json({
      data: savedJobs,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get saved jobs' });
  }
};

// Get job categories
exports.categories = async (req, res) => {
  try {
    const categories = [
      { value: 'technology', label: 'Technology', count: 0 },
      { value: 'programming', label: 'Programming', count: 0 },
      { value: 'design', label: 'Design', count: 0 },
      { value: 'marketing', label: 'Marketing', count: 0 },
      { value: 'sales', label: 'Sales', count: 0 },
      { value: 'finance', label: 'Finance', count: 0 },
      { value: 'healthcare', label: 'Healthcare', count: 0 },
      { value: 'education', label: 'Education', count: 0 },
      { value: 'construction', label: 'Construction', count: 0 },
      { value: 'hospitality', label: 'Hospitality', count: 0 },
      { value: 'retail', label: 'Retail', count: 0 },
      { value: 'manufacturing', label: 'Manufacturing', count: 0 },
      { value: 'transportation', label: 'Transportation', count: 0 },
      { value: 'legal', label: 'Legal', count: 0 },
      { value: 'consulting', label: 'Consulting', count: 0 },
      { value: 'real_estate', label: 'Real Estate', count: 0 },
      { value: 'agriculture', label: 'Agriculture', count: 0 },
      { value: 'energy', label: 'Energy', count: 0 },
      { value: 'telecommunications', label: 'Telecommunications', count: 0 },
      { value: 'media', label: 'Media', count: 0 },
      { value: 'other', label: 'Other', count: 0 }
    ];

    // Get counts for each category
    const jobs = await Job.findAll({
      where: { status: 'approved' },
      attributes: ['category']
    });

    jobs.forEach(job => {
      const category = categories.find(c => c.value === job.category);
      if (category) {
        category.count++;
      }
    });

    res.json({ data: categories });
  } catch (err) {
    console.error('Error getting categories:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Get featured jobs
exports.featured = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const jobs = await Job.findAll({
      where: {
        status: 'approved',
        listing_type: 'premium' // Featured jobs are premium
      },
      include: [{
        model: EmployerProfile,
        as: 'employer',
        attributes: ['id', 'company_name', 'type', 'sector']
      }],
      order: [['created_at', 'DESC']],
      limit: Number(limit)
    });

    // If no premium jobs, return regular approved jobs
    if (jobs.length === 0) {
      const regularJobs = await Job.findAll({
        where: { status: 'approved' },
        include: [{
          model: EmployerProfile,
          as: 'employer',
          attributes: ['id', 'company_name', 'type', 'sector']
        }],
        order: [['created_at', 'DESC']],
        limit: Number(limit)
      });
      return res.json({ data: regularJobs });
    }

    res.json({ data: jobs });
  } catch (err) {
    console.error('Error getting featured jobs:', err);
    res.status(500).json({ error: 'Failed to get featured jobs' });
  }
};

// Search jobs (alias for list with better naming)
exports.search = async (req, res) => {
  // Just call the list function
  return exports.list(req, res);
};

// Get employer's jobs
exports.employerJobs = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Find employer profile
    let employer = await EmployerProfile.findOne({
      where: { user_id: req.user.id }
    });

    // Auto-create employer profile in development if it doesn't exist
    if (!employer && process.env.NODE_ENV !== 'production') {
      console.log('🔧 [DEV] Auto-creating employer profile for user:', req.user.id);
      employer = await EmployerProfile.create({
        user_id: req.user.id,
        company_name: req.user.name || 'Company',
        type: 'individual',
        verification_status: 'verified', // Auto-verify in dev
      });
    }

    if (!employer) {
      return res.json({ data: [] });
    }

    const jobs = await Job.findAll({
      where: { employer_id: employer.id },
      include: [{
        model: EmployerProfile,
        as: 'employer',
        attributes: ['id', 'company_name', 'type', 'sector']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ data: jobs });
  } catch (err) {
    console.error('Error getting employer jobs:', err);
    res.status(500).json({ error: 'Failed to get employer jobs', details: err.message });
  }
};


