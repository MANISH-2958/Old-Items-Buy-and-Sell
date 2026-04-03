const Item = require('../models/Item');
const fs = require('fs');
const path = require('path');

// @desc    Get all items (with search, filter, pagination)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let query = { isSold: false };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Item.find(query)
      .populate('seller', 'name email location avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments(query);

    res.json({
      items,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    console.error('Get items error:', error);
    // Fallback if text index not created yet
    if (error.code === 27) {
      try {
        const items = await Item.find({ isSold: false })
          .populate('seller', 'name email location avatar')
          .sort({ createdAt: -1 })
          .limit(Number(req.query.limit) || 12);
        return res.json({ items, page: 1, pages: 1, total: items.length });
      } catch (fallbackErr) {
        return res.status(500).json({ message: 'Server error fetching items' });
      }
    }
    res.status(500).json({ message: 'Server error fetching items' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id

const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name email phone location avatar createdAt');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const itemData = item.toObject();
    if (!req.user && itemData.seller) {
      delete itemData.seller.phone;
    }

    res.json(itemData);
  } catch (error) {
    console.error('Get item error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new item
// @route   POST /api/items

const createItem = async (req, res) => {
  try {
    const { title, description, price, currency, category, condition, location } = req.body;

    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Get uploaded image paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const item = await Item.create({
      title,
      description,
      price: Number(price),
      currency: currency || 'INR',
      category,
      condition,
      images,
      seller: req.user._id,
      location: location || req.user.location || ''
    });

    const populatedItem = await Item.findById(item._id)
      .populate('seller', 'name email location avatar');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error creating item' });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id

const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, price, currency, category, condition, location, isSold } = req.body;

    // Handle new images
    let images = item.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Handle removed images
    if (req.body.removedImages) {
      const removedImages = JSON.parse(req.body.removedImages);
      images = images.filter(img => !removedImages.includes(img));
      // Delete removed image files
      removedImages.forEach(img => {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        title: title || item.title,
        description: description || item.description,
        price: price ? Number(price) : item.price,
        currency: currency || item.currency,
        category: category || item.category,
        condition: condition || item.condition,
        location: location !== undefined ? location : item.location,
        isSold: isSold !== undefined ? isSold : item.isSold,
        images
      },
      { new: true, runValidators: true }
    ).populate('seller', 'name email location avatar');

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error updating item' });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // Delete associated images
    item.images.forEach(img => {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error deleting item' });
  }
};

// @desc    Get items by user
// @route   GET /api/items/user/:userId

const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.params.userId })
      .populate('seller', 'name email location avatar')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, getUserItems };
