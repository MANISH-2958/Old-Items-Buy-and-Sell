const express = require('express');
const router = express.Router();
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getUserItems
} = require('../controllers/itemController');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getItems);
router.get('/:id', optionalAuth, getItem);
router.get('/user/:userId', getUserItems);

// Protected routes
router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
