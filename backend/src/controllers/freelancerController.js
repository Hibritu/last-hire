const { Op } = require('sequelize');
const { FreelancerProfile, User, ContactRequest } = require('../models');
const { sendContactEmail } = require('../services/emailService');

exports.list = async (req, res) => {
  try {
    const { 
      q, 
      skill, 
      location, 
      min_rate, 
      max_rate, 
      availability,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const where = { is_verified: true }; // Only show verified freelancers in public list
    const userWhere = {};

    // Search by name, title, or description
    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
      userWhere[Op.or] = [
        { first_name: { [Op.iLike]: `%${q}%` } },
        { last_name: { [Op.iLike]: `%${q}%` } },
      ];
    }

    // Filter by skill
    if (skill) {
      where.skills = { [Op.contains]: [skill] };
    }

    // Filter by location (from user's preferred_locations)
    if (location) {
      userWhere.preferred_locations = { [Op.contains]: [location] };
    }

    // Filter by hourly rate range
    if (min_rate) {
      where.hourly_rate = { ...where.hourly_rate, [Op.gte]: parseFloat(min_rate) };
    }
    if (max_rate) {
      where.hourly_rate = { ...where.hourly_rate, [Op.lte]: parseFloat(max_rate) };
    }

    // Filter by availability
    if (availability) {
      where.availability = availability;
    }

    const freelancers = await FreelancerProfile.findAndCountAll({
      where,
      order: [['rating', 'DESC'], ['total_reviews', 'DESC']],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      include: [{
        model: User,
        as: 'user',
        where: userWhere,
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'preferred_locations'],
        required: true,
      }],
    });

    res.json({
      data: freelancers.rows,
      pagination: { 
        total: freelancers.count, 
        page: Number(page), 
        limit: Number(limit),
        totalPages: Math.ceil(freelancers.count / Number(limit))
      },
    });
  } catch (err) {
    console.error('Freelancer list error:', err);
    res.status(500).json({ error: 'Failed to list freelancers', details: err.message });
  }
};

exports.details = async (req, res) => {
  try {
    const freelancer = await FreelancerProfile.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'preferred_locations', 'email', 'phone'],
      }],
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }

    res.json(freelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get freelancer details' });
  }
};

exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can create freelancer profiles' });
    }

    // Check if user already has a freelancer profile
    const existingProfile = await FreelancerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Freelancer profile already exists' });
    }

    const payload = req.body;
    const freelancer = await FreelancerProfile.create({
      user_id: req.user.id,
      title: payload.title,
      description: payload.description,
      hourly_rate: payload.hourly_rate,
      availability: payload.availability || 'available',
      skills: payload.skills || [],
      languages: payload.languages || [],
      experience_years: payload.experience_years || 0,
      portfolio_url: payload.portfolio_url,
      linkedin_url: payload.linkedin_url,
      github_url: payload.github_url,
      website_url: payload.website_url,
    });

    // Fetch the created profile with user data
    const createdProfile = await FreelancerProfile.findByPk(freelancer.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'preferred_locations'],
      }],
    });

    res.status(201).json(createdProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create freelancer profile' });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can update freelancer profiles' });
    }

    const freelancer = await FreelancerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer profile not found' });
    }

    await freelancer.update(req.body);

    // Fetch updated profile with user data
    const updatedProfile = await FreelancerProfile.findByPk(freelancer.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'preferred_locations'],
      }],
    });

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update freelancer profile' });
  }
};

exports.delete = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can delete freelancer profiles' });
    }

    const freelancer = await FreelancerProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer profile not found' });
    }

    await freelancer.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete freelancer profile' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can access freelancer profiles' });
    }

    const freelancer = await FreelancerProfile.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'profile_picture', 'preferred_locations', 'email', 'phone'],
      }],
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer profile not found' });
    }

    res.json(freelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get freelancer profile' });
  }
};

exports.contact = async (req, res) => {
  try {
    const { message, email, name } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required for the freelancer to reply to you' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const freelancer = await FreelancerProfile.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email'],
      }],
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }

    // Use provided name and email, or fall back to authenticated user if available
    let senderName = name;
    let senderEmail = email;
    
    if (req.user) {
      const sender = await User.findByPk(req.user.id);
      if (!senderName) {
        senderName = `${sender.first_name} ${sender.last_name}`;
      }
      if (!senderEmail) {
        senderEmail = sender.email;
      }
    }
    
    if (!senderName) {
      senderName = 'A potential client';
    }

    // Create contact request (pending approval)
    const contactRequest = await ContactRequest.create({
      freelancer_id: req.params.id,
      sender_name: senderName,
      sender_email: senderEmail,
      message: message,
      status: 'pending'
    });

    res.json({ 
      success: true, 
      message: 'Contact request sent successfully. The freelancer will review your request and contact you if interested.',
      request: {
        id: contactRequest.id,
        status: 'pending'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send contact request' });
  }
};

// Get contact requests for freelancer (job seeker) or all requests (admin)
exports.getContactRequests = async (req, res) => {
  try {
    const { status, freelancer_id } = req.query;
    const where = {};

    // Admin can view all contact requests, freelancer only their own approved ones
    if (req.user.role === 'admin') {
      if (freelancer_id) {
        where.freelancer_id = freelancer_id;
      }
      // Admin sees all if no freelancer_id specified
    } else {
      // Job seeker only sees their own approved requests
      const freelancer = await FreelancerProfile.findOne({ where: { user_id: req.user.id } });
      if (!freelancer) {
        return res.status(404).json({ error: 'Freelancer profile not found' });
      }
      where.freelancer_id = freelancer.id;
      where.status = 'approved'; // Freelancers only see approved requests
    }

    // Admin can filter by status, but freelancer filter is ignored (always approved)
    if (status && req.user.role === 'admin') {
      where.status = status;
    }

    const requests = await ContactRequest.findAll({
      where,
      include: [{
        model: FreelancerProfile,
        as: 'freelancer',
        include: [{
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'email']
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get contact requests' });
  }
};

// Approve or reject contact request (admin only)
exports.respondToContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const contactRequest = await ContactRequest.findByPk(id, {
      include: [{
        model: FreelancerProfile,
        as: 'freelancer',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }]
      }]
    });

    if (!contactRequest) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    if (contactRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Contact request already processed' });
    }

    await contactRequest.update({ status });

    // If approved, send email to sender with freelancer's contact info
    if (status === 'approved') {
      const freelancerUser = contactRequest.freelancer.user;
      const freelancerName = `${freelancerUser.first_name} ${freelancerUser.last_name}`;
      
      const emailResult = await sendContactEmail(
        contactRequest.sender_email,
        contactRequest.sender_name,
        freelancerName,
        freelancerUser.email,
        `Great news! ${freelancerName} has accepted your contact request. You can now reach out directly at ${freelancerUser.email}.`
      );

      if (!emailResult.success) {
        console.error('Failed to send approval email:', emailResult.error);
      }
    }

    res.json({ 
      success: true,
      message: `Contact request ${status}`,
      request: contactRequest
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to respond to contact request' });
  }
};
