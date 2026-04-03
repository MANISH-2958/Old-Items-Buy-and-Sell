const express = require('express');
const router = express.Router();
const { sendMessage, getConversations, getThread } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, sendMessage)
  .get(protect, getConversations);


router.route('/thread/:otherUserId')
  .get(protect, getThread);

router.route('/thread/:otherUserId/:itemId')
  .get(protect, getThread);

module.exports = router;
