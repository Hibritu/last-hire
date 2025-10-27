const { Op } = require('sequelize');
const { Application, Job, EmployerProfile } = require('../models');
const { APPLICATION_STATUS_ENUM } = require('../models/enums');

// POST /jobs/:id/apply
exports.apply = async (req, res) => {
  try {
    if (req.auth.role !== 'job_seeker') return res.status(403).json({ error: 'Forbidden' });

    const jobId = req.params.id;
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'approved') return res.status(400).json({ error: 'Job is not open for applications' });

    // Prevent duplicate application
    const existing = await Application.findOne({ where: { job_id: jobId, user_id: req.auth.userId } });
    if (existing) return res.status(409).json({ error: 'You already applied to this job' });

    const { resume, cover_letter } = req.body;

    const app = await Application.create({
      job_id: jobId,
      user_id: req.auth.userId,
      resume: resume || null,
      cover_letter: cover_letter || null,
      status: 'submitted',
    });

    res.status(201).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
};

// GET /jobs/:id/applications (employer owner only)
exports.listByJob = async (req, res) => {
  try {
    if (req.auth.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
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

// PUT /applications/:id/status (employer owner only)
exports.updateStatus = async (req, res) => {
  try {
    if (req.auth.role !== 'employer') return res.status(403).json({ error: 'Forbidden' });

    const employer = await EmployerProfile.findOne({ where: { user_id: req.auth.userId } });
    if (!employer) return res.status(403).json({ error: 'Employer profile required' });

    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const job = await Job.findByPk(application.job_id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer_id !== employer.id) return res.status(403).json({ error: 'Not your job' });

    const { status } = req.body;
    if (!APPLICATION_STATUS_ENUM.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Enforce vacancies limit when accepting
    if (status === 'accepted') {
      const acceptedCount = await Application.count({ where: { job_id: job.id, status: 'accepted' } });
      if (acceptedCount >= job.vacancies) {
        return res.status(400).json({ error: 'Vacancy limit reached' });
      }
    }

    await application.update({ status });
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};
