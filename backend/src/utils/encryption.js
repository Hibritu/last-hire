// Chat encryption utilities removed - using WebSocket only
// No database persistence or encryption needed for WebSocket messages

const crypto = require('crypto');

/**
 * Hash sensitive data (for comparison without storing plaintext)
 */
function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = {
  hashData,
  // Chat encryption functions removed - using WebSocket only
};
