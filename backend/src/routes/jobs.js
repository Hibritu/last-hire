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
const { authenticate, authorize } = require('../middleware/auth');
const jobs = require('../controllers/jobsController');

// Public routes (no auth required)
router.get('/categories', jobs.categories);
router.get('/featured', jobs.featured);
router.get('/search', jobs.list); // search uses the same logic as list

// Employer-only routes - MUST come before /:id to avoid matching conflicts
router.get('/employer', authenticate, authorize(['employer']), jobs.employerJobs);
router.post('/', authenticate, authorize(['employer']), jobs.create);
router.put('/:id', authenticate, authorize(['employer']), jobs.update);
router.delete('/:id', authenticate, authorize(['employer']), jobs.remove);

// Job seeker only - save/unsave jobs - MUST come before /:id
router.post('/:id/save', authenticate, authorize(['job_seeker']), jobs.saveJob);
router.delete('/:id/save', authenticate, authorize(['job_seeker']), jobs.unsaveJob);
router.get('/saved', authenticate, authorize(['job_seeker']), jobs.getSavedJobs);

// Generic routes - MUST come last to avoid catching specific routes
router.get('/', jobs.list);
router.get('/:id', jobs.details);

module.exports = router;


