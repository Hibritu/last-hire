/**
 * @openapi
 * /freelancers:
 *   get:
 *     summary: List freelancers
 *     tags: [Freelancers]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: skill
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: min_rate
 *         schema: { type: number }
 *       - in: query
 *         name: max_rate
 *         schema: { type: number }
 *       - in: query
 *         name: availability
 *         schema: { type: string, enum: [available, busy, unavailable] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List of freelancers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FreelancerProfile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     summary: Create a freelancer profile (job seeker)
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               hourly_rate:
 *                 type: number
 *               availability:
 *                 type: string
 *                 enum: [available, busy, unavailable]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience_years:
 *                 type: integer
 *               portfolio_url:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               website_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Freelancer profile created
 * /freelancers/{id}:
 *   get:
 *     summary: Get freelancer details
 *     tags: [Freelancers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Freelancer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FreelancerProfile'
 *   put:
 *     summary: Update freelancer profile (owner only)
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               hourly_rate:
 *                 type: number
 *               availability:
 *                 type: string
 *                 enum: [available, busy, unavailable]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience_years:
 *                 type: integer
 *               portfolio_url:
 *                 type: string
 *               linkedin_url:
 *                 type: string
 *               github_url:
 *                 type: string
 *               website_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete freelancer profile (owner only)
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 * /freelancers/me:
 *   get:
 *     summary: Get my freelancer profile
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My freelancer profile
 * /freelancers/contact-requests:
 *   get:
 *     summary: Get contact requests (freelancer sees only approved, admin sees all)
 *     tags: [Freelancers]
 *     description: Freelancers can only view contact requests that have been approved by admin. Admins can view all requests with any status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by status (admin only - freelancers always see approved)
 *       - in: query
 *         name: freelancer_id
 *         schema:
 *           type: string
 *         description: Filter by freelancer ID (admin only)
 *     responses:
 *       200:
 *         description: List of contact requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Freelancer profile not found
 * /freelancers/contact-requests/{id}:
 *   put:
 *     summary: Approve or reject contact request (admin only)
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 description: Approve or reject the contact request
 *     responses:
 *       200:
 *         description: Contact request updated
 *       400:
 *         description: Invalid status or already processed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Contact request not found
 * /freelancers/{id}/contact:
 *   post:
 *     summary: Contact a freelancer for hire
 *     tags: [Freelancers]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - message
 *               - email
 *             properties:
 *               message:
 *                 type: string
 *                 description: Your message to the freelancer
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Your email address for the freelancer to reply to
 *               name:
 *                 type: string
 *                 description: Your name (optional, will use account name if authenticated)
 *     responses:
 *       200:
 *         description: Contact request sent successfully
 */
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const freelancers = require('../controllers/freelancerController');

// Public routes
router.get('/', freelancers.list);

// Protected routes for job seekers - MUST come before /:id routes
router.post('/', authenticate, authorize(['job_seeker']), freelancers.create);
router.get('/me', authenticate, authorize(['job_seeker']), freelancers.getMyProfile);
router.put('/me', authenticate, authorize(['job_seeker']), freelancers.update);
router.delete('/me', authenticate, authorize(['job_seeker']), freelancers.delete);

// Contact request management
router.get('/contact-requests', authenticate, authorize(['job_seeker', 'admin']), freelancers.getContactRequests);
router.put('/contact-requests/:id', authenticate, authorize(['admin']), freelancers.respondToContactRequest);

// Public detail route - MUST come after /me routes
router.get('/:id', freelancers.details);
router.put('/:id', authenticate, authorize(['job_seeker']), freelancers.update);
router.delete('/:id', authenticate, authorize(['job_seeker']), freelancers.delete);

// Contact freelancer (any authenticated user)
router.post('/:id/contact', authenticate, freelancers.contact);

module.exports = router;
