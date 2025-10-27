/**
 * @openapi
 * /jobs/{id}/report:
 *   post:
 *     summary: Report a job (any authenticated user)
 *     tags: [Reports]
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
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report created
 */
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const reports = require('../controllers/reportsController');

router.post('/jobs/:id/report', auth(false), reports.reportJob);

module.exports = router;
