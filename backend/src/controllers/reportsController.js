const { Report, Job } = require('../models');

// POST /jobs/:id/report
exports.reportJob = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const jobId = req.params.id;
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const { reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ error: 'reason is required' });

    const report = await Report.create({
      reported_by: req.user.id,
      job_id: jobId,
      chat_id: null,
      reason,
      status: 'pending',
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};


