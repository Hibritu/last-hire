const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Chat, Message } = require('../models');

const router = express.Router();
router.use(authenticate);

// List user chats
router.get('/chats', async (req, res) => {
  const chats = await Chat.findAll({
    where: {
      [req.user.role === 'employer' ? 'employer_id' : 'jobseeker_id']: req.user.id
    },
    order: [['updatedAt', 'DESC']]
  });
  res.json(chats);
});

// Get chat messages
router.get('/chats/:id/messages', async (req, res) => {
  const messages = await Message.findAll({
    where: { chat_id: req.params.id },
    order: [['createdAt', 'ASC']]
  });
  res.json(messages);
});

module.exports = router;
