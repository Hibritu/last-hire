const { Op } = require('sequelize');
const { Application, Job, EmployerProfile } = require('../models');
const { APPLICATION_STATUS_ENUM } = require('../models/enums');
const { Chat } = require('../models');

// POST /jobs/:id/apply
exports.apply = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });

    const jobId = req.params.id.trim(); // Remove any whitespace
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'approved') return res.status(400).json({ error: 'Job is not open for applications' });

    // Prevent duplicate application
    const existing = await Application.findOne({ where: { job_id: jobId, user_id: req.user.id } });
    if (existing) return res.status(409).json({ error: 'You already applied to this job' });

    const { cover_letter } = req.body;
    
    // Get resume from uploaded file or body
    const resumePath = req.file ? req.file.path : (req.body.resume || null);

    const app = await Application.create({
      job_id: jobId,
      user_id: req.user.id,
      resume: resumePath,
      cover_letter: cover_letter || null,
      status: 'submitted',
    });

    res.status(201).json(app);
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ error: 'Failed to apply to job', details: err.message });
  }
};

// GET /applications/me - list current user's applications
exports.listMine = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });

    const applications = await Application.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'employment_type', 'salary', 'expiry_date'],
          include: [{
            model: EmployerProfile,
            as: 'employer',
            attributes: ['company_name', 'type']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
    });

    // Transform to include job details at root level
    const transformed = applications.map(app => ({
      id: app.id,
      job_id: app.job_id,
      job_title: app.job?.title || 'Unknown Job',
      employer_name: app.job?.employer?.company_name || 'Unknown Company',
      location: app.job?.location || '',
      employment_type: app.job?.employment_type || '',
      salary: app.job?.salary || null,
      status: app.status,
      cover_letter: app.cover_letter,
      resume: app.resume,
      applied_at: app.created_at,
      created_at: app.created_at,
      updated_at: app.updated_at
    }));

    res.json(transformed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load applications' });
  }
};

// GET /jobs/:id/applications (employer owner only)
exports.listByJob = async (req, res) => {
  try {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    const apps = await Application.findAll({ where: { job_id: job.id }, order: [['created_at', 'DESC']] });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list applications' });
  }
};

// GET /applications (all applications for employer's jobs)
exports.listAllForEmployer = async (req, res) => {
  try {
    console.log('📋 [APPLICATIONS] Fetching all applications for employer:', req.user.id);
    
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const employer = await EmployerProfile.findOne({ where: { user_id: req.user.id } });
    if (!employer) {
      console.log('❌ [APPLICATIONS] No employer profile found');
      return res.status(403).json({ error: 'Employer profile required' });
    }

    console.log('✅ [APPLICATIONS] Employer profile found:', employer.id);

    // Find all jobs by this employer
    const jobs = await Job.findAll({ 
      where: { employer_id: employer.id },
      attributes: ['id', 'title']
    });

    console.log('📊 [APPLICATIONS] Found', jobs.length, 'jobs for employer');

    const jobIds = jobs.map(j => j.id);

    // Find all applications for these jobs
    const { User } = require('../models');
    const applications = await Application.findAll({
      where: { job_id: jobIds },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'employment_type']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'email', 'first_name', 'last_name', 'phone']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log('✅ [APPLICATIONS] Found', applications.length, 'applications');

    // Transform to match frontend format
    const transformedApplications = applications.map(app => ({
      id: app.id,
      job_id: app.job_id,
      job_title: app.job?.title || 'Unknown Job',
      job_location: app.job?.location || '',
      employment_type: app.job?.employment_type || '',
      applicant_id: app.user_id,
      applicant_name: `${app.applicant?.first_name || ''} ${app.applicant?.last_name || ''}`.trim() || 'Unknown',
      applicant_email: app.applicant?.email || '',
      applicant_phone: app.applicant?.phone || '',
      status: app.status,
      cover_letter: app.cover_letter,
      resume: app.resume,
      applied_at: app.created_at,
      updated_at: app.updated_at
    }));

    res.json({ applications: transformedApplications });
  } catch (err) {
    console.error('❌ [APPLICATIONS] Error:', err);
    res.status(500).json({ error: 'Failed to list applications', details: err.message });
  }
};

// POST /applications/create-chats-for-accepted - Manually create chats for existing accepted/shortlisted applications
exports.createChatsForAccepted = async (req, res) => {
  try {
    console.log('🔧 [CHAT] Manually creating chats for accepted/shortlisted applications...');
    
    const { Chat } = require('../models');
    const applications = await Application.findAll({
      where: {
        status: ['accepted', 'shortlisted']
      },
      include: [
        {
          model: Job,
          as: 'job',
          include: [{ model: EmployerProfile, as: 'employer' }]
        }
      ]
    });
    
    console.log(`📋 Found ${applications.length} accepted/shortlisted applications`);
    
    let created = 0;
    let existing = 0;
    const errors = [];
    
    for (const app of applications) {
      try {
        const existingChat = await Chat.findOne({ where: { application_id: app.id } });
        
        if (!existingChat) {
          await Chat.create({
            application_id: app.id,
            employer_id: app.job.employer_id,
            jobseeker_id: app.user_id
          });
          console.log(`✅ Created chat for application ${app.id}`);
          created++;
        } else {
          console.log(`ℹ️ Chat already exists for application ${app.id}`);
          existing++;
        }
      } catch (err) {
        console.error(`❌ Error creating chat for application ${app.id}:`, err.message);
        errors.push({ application_id: app.id, error: err.message });
      }
    }
    
    res.json({
      message: 'Chat creation completed',
      total_applications: applications.length,
      chats_created: created,
      chats_already_existed: existing,
      errors: errors
    });
  } catch (error) {
    console.error('❌ Error in createChatsForAccepted:', error);
    res.status(500).json({
      error: 'Failed to create chats',
      details: error.message
    });
  }
};

exports.updateStatus = async (req, res) => {
  try{
    const { id } = req.params;
    const { status } = req.body;
    const employerUserId = req.user.id; // from token

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [{ model: EmployerProfile, as: 'employer' }], // Important
        },
      ],
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify employer owns this job
    if (application.job.employer.user_id !== employerUserId) {
      return res.status(403).json({ error: 'You are not authorized to update this application' });
    }

    // Update status
    application.status = status;
    await application.save();

    // If accepted or shortlisted, create a Chat automatically
    if (['accepted', 'shortlisted'].includes(application.status)) {
      try {
        console.log('💬 [CHAT] Creating chat for application:', application.id);
        const { Chat } = require('../models');
        const existingChat = await Chat.findOne({ where: { application_id: application.id } });
        
        if (!existingChat) {
          console.log('💬 [CHAT] No existing chat, creating new one');
          console.log('💬 [CHAT] Employer ID:', application.job.employer_id);
          console.log('💬 [CHAT] Job Seeker ID:', application.user_id);
          
          const newChat = await Chat.create({
            application_id: application.id,
            employer_id: application.job.employer_id,
            jobseeker_id: application.user_id
          });
          
          console.log('✅ [CHAT] Chat created successfully:', newChat.id);
        } else {
          console.log('ℹ️ [CHAT] Chat already exists:', existingChat.id);
        }
      } catch (chatError) {
        console.error('❌ [CHAT] Error creating chat:', chatError);
        console.error('❌ [CHAT] Error details:', chatError.message);
        // Don't fail the status update if chat creation fails
      }
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      error: 'Failed to update application status',
      details: error.message,
    });
  }
};




exports.getMyStats = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can view their application stats' });
    }

    const userId = req.user.id;

    // Get application statistics
    const totalApplications = await Application.count({
      where: { user_id: userId }
    });

    const statusCounts = await Application.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get recent applications (last 10)
    const recentApplications = await Application.findAll({
      where: { user_id: userId },
      include: [{
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'company_name', 'location', 'employment_type', 'salary']
      }],
      order: [['applied_at', 'DESC']],
      limit: 10
    });

    // Get application success rate (accepted vs total)
    const acceptedCount = statusCounts.find(s => s.status === 'accepted')?.count || 0;
    const successRate = totalApplications > 0 ? (acceptedCount / totalApplications) * 100 : 0;

    // Get average response time (days between application and status change)
    const applicationsWithResponse = await Application.findAll({
      where: {
        user_id: userId,
        status: { [Op.ne]: 'submitted' }
      },
      attributes: [
        'applied_at',
        'status',
        [Application.sequelize.fn('DATEDIFF', Application.sequelize.col('updated_at'), Application.sequelize.col('applied_at')), 'response_days']
      ],
      raw: true
    });

    const avgResponseTime = applicationsWithResponse.length > 0
      ? Math.round(applicationsWithResponse.reduce((sum, app) => sum + (parseInt(app.response_days) || 0), 0) / applicationsWithResponse.length)
      : 0;

    const stats = {
      total_applications: totalApplications,
      status_distribution: statusCounts.map(stat => ({
        status: stat.status,
        count: parseInt(stat.count)
      })),
      success_rate: Math.round(successRate * 100) / 100, // Round to 2 decimal places
      average_response_time_days: avgResponseTime,
      recent_applications: recentApplications.map(app => ({
        id: app.id,
        job_title: app.job?.title,
        job_company: app.job?.company_name,
        job_location: app.job?.location,
        job_employment_type: app.job?.employment_type,
        job_salary: app.job?.salary,
        applied_at: app.applied_at,
        status: app.status
      })),
      last_updated: new Date().toISOString()
    };

    res.json(stats);
  } catch (err) {
    console.error('Application stats error:', err);
    res.status(500).json({ error: 'Failed to get application statistics' });
  }
};


