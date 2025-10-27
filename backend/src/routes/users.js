const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Combined storage for multiple file types
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, path.join(process.cwd(), 'uploads', 'resumes'));
    } else if (file.fieldname === 'profile_picture') {
      cb(null, path.join(process.cwd(), 'uploads', 'pictures'));
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploadFiles = multer({ 
  storage: combinedStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      // Accept PDF files for resume
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Resume must be a PDF file'), false);
      }
    } else if (file.fieldname === 'profile_picture') {
      // Accept image files for profile picture
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Profile picture must be an image file'), false);
      }
    } else {
      cb(new Error('Invalid field name'), false);
    }
  }
});

router.get('/me', authenticate, authorize(['job_seeker', 'employer', 'admin']), userController.getMe);
router.get('/all', authenticate, authorize(['job_seeker', 'employer', 'admin']), userController.getAll);
// Combined endpoint for all profile updates including file uploads
const profileValidation = [
  body('gender').optional().isIn(['male', 'female']),
  body('education').optional().isString(),
  body('skills').optional().isString(),
  body('experience').optional().isString(),
  body('preferred_categories').optional().isString(),
  body('preferred_locations').optional().isString(),
];

router.put('/me',
  authenticate,
  authorize(['job_seeker', 'employer']),
  uploadFiles.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profile_picture', maxCount: 1 }
  ]),
  profileValidation,
  userController.updateMe
);

// Dashboard and profile completion
router.get('/dashboard', authenticate, authorize(['job_seeker', 'employer']), userController.getDashboard);
router.get('/me/completion', authenticate, authorize(['job_seeker', 'employer']), userController.getProfileCompletion);

// Granular profile updates
const experienceValidation = [body('experience').isArray().withMessage('Experience must be an array')];
const educationValidation = [body('education').isArray().withMessage('Education must be an array')];
const skillsValidation = [body('skills').isArray().withMessage('Skills must be an array')];
const certificationsValidation = [body('certifications').isArray().withMessage('Certifications must be an array')];

router.put('/me/experience', authenticate, authorize(['job_seeker', 'employer']), experienceValidation, userController.updateExperience);
router.put('/me/education', authenticate, authorize(['job_seeker', 'employer']), educationValidation, userController.updateEducation);
router.put('/me/skills', authenticate, authorize(['job_seeker', 'employer']), skillsValidation, userController.updateSkills);
router.put('/me/certifications', authenticate, authorize(['job_seeker', 'employer']), certificationsValidation, userController.updateCertifications);

module.exports = router;
