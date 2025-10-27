const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * Admin Routes
 * All routes require admin authentication
 * Prefix: /api/admin
 */

// Dashboard & Analytics
router.get('/dashboard/metrics', authenticate, authorize(['admin']), admin.getDashboardMetrics);
router.get('/analytics', authenticate, authorize(['admin']), admin.getAnalytics);

// User Management
router.get('/users', authenticate, authorize(['admin']), admin.getAllUsers);
router.put('/users/:id/status', authenticate, authorize(['admin']), admin.updateUserStatus);

// Employer Management
router.get('/employers', authenticate, authorize(['admin']), admin.getAllEmployers);
router.put('/employers/:id/verify', authenticate, authorize(['admin']), admin.verifyEmployer);

// Job Moderation
router.get('/jobs', authenticate, authorize(['admin']), admin.getAllJobs);
router.put('/jobs/:id/approve', authenticate, authorize(['admin']), admin.approveJob);
router.delete('/jobs/:id', authenticate, authorize(['admin']), admin.deleteJob);

// Application Management
router.get('/applications', authenticate, authorize(['admin']), admin.getAllApplications);

module.exports = router;
