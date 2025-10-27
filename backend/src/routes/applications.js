/**
 * @openapi
 * /jobs/{id}/apply:
 *   post:
 *     summary: Apply to a job (job seeker)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resume: { type: string }
 *               cover_letter: { type: string }
 *     responses:
 *       201:
 *         description: Application submitted
 * /jobs/{id}/applications:
 *   get:
 *     summary: List applications for a job (employer owner)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 * /applications/{id}/status:
 *   put:
 *     summary: Update application status (employer owner)
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [submitted, shortlisted, accepted, rejected]
 *     responses:
 *       200:
 *         description: Updated
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const apps = require('../controllers/applicationsController');

// Configure multer for resume uploads
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads', 'resumes')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadResume = multer({ 
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resumes'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply to job (job seeker) - with optional resume upload
router.post('/jobs/:id/apply', authenticate, authorize(['job_seeker']), uploadResume.single('resume'), apps.apply);

// Employer view all applications across all their jobs
router.get('/applications', authenticate, authorize(['employer']), apps.listAllForEmployer);

// Employer view applications for a specific job
router.get('/jobs/:id/applications', authenticate, authorize(['employer']), apps.listByJob);
router.put('/applications/:id/status', authenticate, authorize(['employer']), apps.updateStatus);

// Admin/Debug endpoint to manually create chats for existing shortlisted/accepted applications
router.post('/applications/create-chats-for-accepted', authenticate, apps.createChatsForAccepted);

// Job seeker view their applications
router.get('/applications/me', authenticate, authorize(['job_seeker']), apps.listMine);

// Application statistics for job seekers
router.get('/applications/my/stats', authenticate, authorize(['job_seeker']), apps.getMyStats);

module.exports = router;


