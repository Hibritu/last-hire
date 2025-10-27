const { Notification } = require('../models');

/**
 * Create a notification for a user
 * @param {Object} data - Notification data
 * @param {string} data.user_id - User ID
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.related_id - Related entity ID (optional)
 * @returns {Promise<Object>} Created notification
 */
async function createNotification({ user_id, type, title, message, related_id = null }) {
  try {
    const notification = await Notification.create({
      user_id,
      type,
      title,
      message,
      related_id,
      is_read: false,
      created_at: new Date()
    });
    
    console.log(`Notification created for user ${user_id}: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Create bulk notifications for multiple users
 * @param {Array<Object>} notifications - Array of notification data
 * @returns {Promise<Array>} Created notifications
 */
async function createBulkNotifications(notifications) {
  try {
    const created = await Notification.bulkCreate(notifications);
    console.log(`Created ${created.length} notifications`);
    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for verification)
 * @returns {Promise<boolean>} Success status
 */
async function markAsRead(notificationId, userId) {
  try {
    const [updated] = await Notification.update(
      { is_read: true },
      { where: { id: notificationId, user_id: userId } }
    );
    return updated > 0;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of updated notifications
 */
async function markAllAsRead(userId) {
  try {
    const [updated] = await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );
    return updated;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Get unread count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Unread count
 */
async function getUnreadCount(userId) {
  try {
    const count = await Notification.count({
      where: { user_id: userId, is_read: false }
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  createBulkNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
};
