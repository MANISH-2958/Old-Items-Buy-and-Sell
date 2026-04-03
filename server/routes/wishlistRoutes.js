const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist, checkWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getWishlist);

router.route('/:itemId')
  .post(protect, toggleWishlist)
  .get(protect, checkWishlist); // GET to check if it's wishlisted based on item ID

module.exports = router;
