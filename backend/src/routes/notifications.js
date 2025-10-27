const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const notifications = require('../controllers/notificationsController');

router.get('/notifications', authenticate, notifications.listMine);
router.patch('/notifications/:id/read', authenticate, notifications.markRead);
router.put('/notifications/read-all', authenticate, notifications.markAllRead);
router.get('/notifications/unread-count', authenticate, notifications.getUnreadCount);

module.exports = router;


