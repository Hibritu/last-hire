const { EmployerProfile, Job, Report } = require('../models');
const { VERIFICATION_STATUS_ENUM, JOB_STATUS_ENUM, REPORT_STATUS_ENUM } = require('../models/enums');

function requireAdmin(req, res) {
  if (req.auth?.role !== 'admin') {
    res.status(403).json({ error: 'Admin only' });
    return false;
  }
  return true;
}

// PUT /admin/employers/:id/verify  body: { status: 'verified' | 'rejected' }
exports.verifyEmployer = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;
    if (!VERIFICATION_STATUS_ENUM.includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const employer = await EmployerProfile.findByPk(id);
    if (!employer) return res.status(404).json({ error: 'Employer profile not found' });

    await employer.update({ verification_status: status });
    res.json(employer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to verify employer' });
  }
};

// GET /admin/jobs?status=pending
exports.listJobs = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const jobs = await Job.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list jobs' });
  }
};

// PUT /admin/jobs/:id/approve  body: { status: 'approved' | 'rejected' }
exports.approveJob = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;
    if (!JOB_STATUS_ENUM.includes(status) || !['approved', 'rejected', 'pending', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid job status' });
    }

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    await job.update({ status });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job status' });
  }
};

// GET /admin/reports?status=pending
exports.listReports = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const reports = await Report.findAll({ where, order: [['created_at', 'DESC']] });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list reports' });
  }
};

// PUT /admin/reports/:id/resolve  body: { status: 'reviewed' | 'resolved' }
exports.resolveReport = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;
    if (!REPORT_STATUS_ENUM.includes(status) || !['reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid report status' });
    }

    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    await report.update({ status });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report status' });
  }
};
