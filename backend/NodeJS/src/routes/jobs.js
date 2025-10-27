/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: List jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *   post:
 *     summary: Create a job (employer)
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Created
 * /jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *   put:
 *     summary: Update a job (employer owner)
 *     tags: [Jobs]
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
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete a job (employer owner)
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const jobs = require('../controllers/jobsController');

// Public endpoints (must come before /:id to avoid conflicts)
router.get('/categories', auth(true), jobs.categories); // Get all job categories
router.get('/featured', auth(true), jobs.featured); // Get featured/premium jobs
router.get('/search', auth(true), jobs.list); // Search jobs (alias for list)
router.get('/employer', auth(true), jobs.employerJobs); // Get jobs for current employer

// Public list & details
router.get('/', auth(true), jobs.list); // optional auth for personalization later
router.get('/:id', auth(true), jobs.details);

// Employer-only (auth optional for testing)
router.post('/', auth(true), jobs.create);
router.put('/:id', auth(true), jobs.update);
router.delete('/:id', auth(true), jobs.remove);

module.exports = router;
