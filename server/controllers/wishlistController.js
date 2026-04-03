const Wishlist = require('../models/Wishlist');
const Item = require('../models/Item');

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/:itemId

exports.toggleWishlist = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      item: req.params.itemId
    });

    if (existingWishlist) {
      // If it exists, user wants to remove it
      await Wishlist.findByIdAndDelete(existingWishlist._id);
      return res.status(200).json({ message: 'Item removed from wishlist', action: 'removed' });
    } else {
      // If not, add it
      const newWishlist = new Wishlist({
        user: req.user.id,
        item: req.params.itemId
      });
      await newWishlist.save();
      return res.status(201).json({ message: 'Item added to wishlist', action: 'added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's wishlist
// @route   GET /api/wishlist

exports.getWishlist = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .populate('item')
      .sort({ createdAt: -1 });

    // Filter out null items in case the item was deleted
    const validWishlists = wishlists.filter(w => w.item != null);

    res.status(200).json(validWishlists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Check if an item is wishlisted
// @route   GET /api/wishlist/:itemId

exports.checkWishlist = async (req, res) => {
  try {
    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      item: req.params.itemId
    });

    res.status(200).json({ isWishlisted: !!existingWishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
