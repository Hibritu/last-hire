/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin moderation endpoints
 * /admin/employers/{id}/verify:
 *   put:
 *     summary: Verify or reject an employer
 *     tags: [Admin]
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
 *                 enum: [verified, rejected]
 *     responses:
 *       200:
 *         description: Employer verification updated
 * /admin/jobs:
 *   get:
 *     summary: List jobs for moderation
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected, closed] }
 *     responses:
 *       200:
 *         description: List of jobs
 * /admin/jobs/{id}/approve:
 *   put:
 *     summary: Update a job's moderation status
 *     tags: [Admin]
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
 *                 enum: [approved, rejected, pending, closed]
 *     responses:
 *       200:
 *         description: Job status updated
 * /admin/reports:
 *   get:
 *     summary: List user reports
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, reviewed, resolved] }
 *     responses:
 *       200:
 *         description: List of reports
 * /admin/reports/{id}/resolve:
 *   put:
 *     summary: Update a report's status
 *     tags: [Admin]
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
 *                 enum: [reviewed, resolved]
 *     responses:
 *       200:
 *         description: Report status updated
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../controllers/adminController');

// Admin-only routes
router.put('/admin/employers/:id/verify', auth(false), admin.verifyEmployer);
router.get('/admin/jobs', auth(false), admin.listJobs);
router.put('/admin/jobs/:id/approve', auth(false), admin.approveJob);
router.get('/admin/reports', auth(false), admin.listReports);
router.put('/admin/reports/:id/resolve', auth(false), admin.resolveReport);

module.exports = router;
