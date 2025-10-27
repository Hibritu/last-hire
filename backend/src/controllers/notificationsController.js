const { Notification, User, Job } = require('../models');
const { Op } = require('sequelize');

// GET /notifications - list current user's notifications (most recent first)
exports.listMine = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { limit = 50, type } = req.query;
    const where = { user_id: req.user.id };
    
    if (type) {
      where.type = type;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Number(limit),
    });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load notifications' });
  }
};

// PATCH /notifications/:id/read - mark a notification as read
exports.markRead = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id;
    const notification = await Notification.findByPk(id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (notification.user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await notification.update({ is_read: true });
    res.json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// PUT /notifications/read-all - mark all notifications as read
exports.markAllRead = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

// GET /notifications/unread-count - get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const count = await Notification.count({
      where: { user_id: req.user.id, is_read: false }
    });

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

/**
 * Helper function to create notification
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string|null} relatedId - Related entity ID
 * @returns {Promise<any>}
 */
exports.createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    return await Notification.create({
      user_id: userId,
      type,
      title,
      message,
      related_id: relatedId,
      is_read: false
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

/**
 * Helper function to send job alerts based on user preferences
 * @param {any} job - Job object
 * @returns {Promise<void>}
 */
exports.sendJobAlerts = async (job) => {
  try {
    // Find users with matching preferences
    const users = await User.findAll({
      where: {
        role: 'job_seeker',
        [Op.or]: [
          { preferred_categories: { [Op.contains]: [job.category] } },
          { preferred_locations: { [Op.contains]: [job.location] } }
        ]
      }
    });

    // Create notifications for matching users
    const notifications = users.map(user => ({
      user_id: user.id,
      type: 'job_alert',
      title: 'New Job Match!',
      message: `A new job matching your preferences has been posted: ${job.title} at ${job.company_name || 'a company'} in ${job.location}`,
      related_id: job.id,
      is_read: false
    }));

    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
      console.log(`Sent ${notifications.length} job alerts for job ${job.id}`);
    }
  } catch (error) {
    console.error('Failed to send job alerts:', error);
  }
};

/**
 * Helper function to notify application status change
 * @param {any} application - Application object
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @returns {Promise<void>}
 */
exports.notifyApplicationStatusChange = async (application, oldStatus, newStatus) => {
  try {
    const job = await Job.findByPk(application.job_id);
    
    let title = 'Application Update';
    let message = `Your application status has been updated to ${newStatus}`;
    
    if (newStatus === 'shortlisted') {
      title = 'You\'ve Been Shortlisted!';
      message = `Great news! You've been shortlisted for ${job?.title || 'the position'}. The employer will contact you soon.`;
    } else if (newStatus === 'accepted') {
      title = 'Application Accepted!';
      message = `Congratulations! Your application for ${job?.title || 'the position'} has been accepted.`;
    } else if (newStatus === 'rejected') {
      title = 'Application Status Update';
      message = `Your application for ${job?.title || 'the position'} was not successful this time. Keep applying!`;
    }

    await exports.createNotification(
      application.user_id,
      'application_update',
      title,
      message,
      application.id
    );
  } catch (error) {
    console.error('Failed to notify application status change:', error);
  }
};


