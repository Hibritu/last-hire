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
const router = express.Router();
const auth = require('../middlewares/auth');
const apps = require('../controllers/applicationsController');

// Apply to job
router.post('/jobs/:id/apply', auth(false), apps.apply);

// Employer view applications and update status
router.get('/jobs/:id/applications', auth(false), apps.listByJob);
router.put('/applications/:id/status', auth(false), apps.updateStatus);

module.exports = router;
