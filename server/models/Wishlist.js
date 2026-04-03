const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }
}, { timestamps: true });

// Ensure a user can only wishlist an item once
wishlistSchema.index({ user: 1, item: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
