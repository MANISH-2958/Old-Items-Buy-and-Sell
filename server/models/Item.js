const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Please provide a currency'],
    default: 'INR'
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Electronics',
      'Furniture',
      'Clothing',
      'Books',
      'Vehicles',
      'Sports',
      'Home & Garden',
      'Other'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Please select item condition'],
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    type: String
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  isSold: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search
itemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);
