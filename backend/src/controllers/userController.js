const { User, Application, Job, FreelancerProfile, UserJobFavorite, Notification } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

exports.getMe = async (req, res) => {
  try {
    console.log('🔍 [GET ME] Looking for user with id:', req.user.id);
    console.log('🔍 [GET ME] Full req.user:', req.user);
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      console.log('❌ [GET ME] User not found in database!');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ [GET ME] User found:', user.email);
    return res.json(user);
  } catch (err) {
    console.error('❌ [GET ME] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};

// GET /users/all - list job seekers (authenticated)
// Query params: page, limit, search, has_profile (true|false)
exports.getAll = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const { search, has_profile } = req.query;
    const onlyWithProfile = has_profile === 'true' || has_profile === true;

    const where = { role: 'job_seeker' };
    if (search && search.trim() !== '') {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { first_name: { [Op.iLike]: q } },
        { last_name: { [Op.iLike]: q } },
        { email: { [Op.iLike]: q } },
      ];
    }

    if (onlyWithProfile) {
      // Consider a user to "have a profile" if any key profile fields are set
      where[Op.and] = [
        {
          [Op.or]: [
            { profile_picture: { [Op.ne]: null } },
            { resume: { [Op.ne]: null } },
            { education: { [Op.ne]: null } },
            { gender: { [Op.ne]: null } },
          ],
        },
      ];
    }

    const { rows, count } = await User.findAndCountAll({
      where,
      offset,
      limit,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password', 'email_otp', 'email_otp_expires_at', 'reset_token', 'reset_token_expires_at'] },
    });

    return res.json({
      data: rows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.updateMe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updateData = {};

    // Handle text fields
    const allowedFields = ['gender', 'education', 'skills', 'experience', 'preferred_categories', 'preferred_locations'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle file uploads
    if (req.files) {
      if (req.files.resume && req.files.resume[0]) {
        updateData.resume = req.files.resume[0].path;
      }
      if (req.files.profile_picture && req.files.profile_picture[0]) {
        updateData.profile_picture = req.files.profile_picture[0].path;
      }
    }

    await user.update(updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        gender: user.gender,
        education: user.education,
        skills: user.skills,
        experience: user.experience,
        profile_picture: user.profile_picture,
        resume: user.resume,
        preferred_categories: user.preferred_categories,
        preferred_locations: user.preferred_locations
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's applications count and status distribution
    const applicationStats = await Application.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [Application.sequelize.fn('COUNT', Application.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get saved jobs count
    const savedJobsCount = await UserJobFavorite.count({
      where: { user_id: userId },
      include: [{
        model: Job,
        as: 'job',
        where: { status: 'approved' },
        required: true
      }]
    });

    // Get recent applications (last 5)
    const recentApplications = await Application.findAll({
      where: { user_id: userId },
      include: [{
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'company_name', 'location', 'employment_type']
      }],
      order: [['applied_at', 'DESC']],
      limit: 5
    });

    // Get profile completion percentage
    const profileCompletion = await this.calculateProfileCompletion(userId);

    // Get unread notifications count
    const unreadNotificationsCount = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    const dashboardData = {
      stats: {
        total_applications: applicationStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
        pending_applications: applicationStats.find(s => s.status === 'submitted')?.count || 0,
        accepted_applications: applicationStats.find(s => s.status === 'accepted')?.count || 0,
        rejected_applications: applicationStats.find(s => s.status === 'rejected')?.count || 0,
        saved_jobs: savedJobsCount,
        unread_notifications: unreadNotificationsCount
      },
      application_status_distribution: applicationStats.map(stat => ({
        status: stat.status,
        count: parseInt(stat.count)
      })),
      recent_applications: recentApplications.map(app => ({
        id: app.id,
        job_title: app.job?.title,
        job_location: app.job?.location,
        job_employment_type: app.job?.employment_type,
        applied_at: app.applied_at,
        status: app.status
      })),
      profile_completion: profileCompletion,
      last_updated: new Date().toISOString()
    };

    res.json(dashboardData);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

exports.updateExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { experience } = req.body;

    if (!Array.isArray(experience)) {
      return res.status(400).json({ error: 'Experience must be an array' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ experience });
    res.json({
      message: 'Experience updated successfully',
      experience: user.experience
    });
  } catch (err) {
    console.error('Experience update error:', err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

exports.updateEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { education } = req.body;

    if (!Array.isArray(education)) {
      return res.status(400).json({ error: 'Education must be an array' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ education });
    res.json({
      message: 'Education updated successfully',
      education: user.education
    });
  } catch (err) {
    console.error('Education update error:', err);
    res.status(500).json({ error: 'Failed to update education' });
  }
};

exports.updateSkills = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ skills });
    res.json({
      message: 'Skills updated successfully',
      skills: user.skills
    });
  } catch (err) {
    console.error('Skills update error:', err);
    res.status(500).json({ error: 'Failed to update skills' });
  }
};

exports.updateCertifications = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { certifications } = req.body;

    if (!Array.isArray(certifications)) {
      return res.status(400).json({ error: 'Certifications must be an array' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ certifications });
    res.json({
      message: 'Certifications updated successfully',
      certifications: user.certifications
    });
  } catch (err) {
    console.error('Certifications update error:', err);
    res.status(500).json({ error: 'Failed to update certifications' });
  }
};

exports.getProfileCompletion = async (req, res) => {
  try {
    const completion = await this.calculateProfileCompletion(req.user.id);
    res.json({ completion_percentage: completion });
  } catch (err) {
    console.error('Profile completion error:', err);
    res.status(500).json({ error: 'Failed to calculate profile completion' });
  }
};

// Helper method to calculate profile completion
exports.calculateProfileCompletion = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        'first_name', 'last_name', 'email', 'phone', 'gender',
        'education', 'skills', 'experience', 'profile_picture',
        'resume', 'preferred_categories', 'preferred_locations'
      ]
    });

    if (!user) return 0;

    let completedFields = 0;
    const totalFields = 11; // Total number of fields we're checking

    // Required basic info
    if (user.first_name && user.first_name.trim()) completedFields++;
    if (user.last_name && user.last_name.trim()) completedFields++;
    if (user.email && user.email.trim()) completedFields++;
    if (user.phone && user.phone.trim()) completedFields++;

    // Profile details
    if (user.gender && user.gender.trim()) completedFields++;
    if (user.education && Array.isArray(user.education) && user.education.length > 0) completedFields++;
    if (user.skills && Array.isArray(user.skills) && user.skills.length > 0) completedFields++;
    if (user.experience && Array.isArray(user.experience) && user.experience.length > 0) completedFields++;

    // Media/files
    if (user.profile_picture && user.profile_picture.trim()) completedFields++;
    if (user.resume && user.resume.trim()) completedFields++;

    // Preferences
    if (user.preferred_categories && Array.isArray(user.preferred_categories) && user.preferred_categories.length > 0) completedFields++;

    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    return completionPercentage;
  } catch (err) {
    console.error('Profile completion calculation error:', err);
    return 0;
  }
};
