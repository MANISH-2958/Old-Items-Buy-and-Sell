import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiX, FiDollarSign } from 'react-icons/fi';
import API from '../api/axios';
import toast from 'react-hot-toast';
import './SellItem.css';

const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Sports', 'Home & Garden', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY', 'RUB'];

const SellItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'INR',
    category: '',
    condition: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (images.length + acceptedFiles.length > 5) {
      return toast.error('Maximum 5 images allowed');
    }
    const newFiles = acceptedFiles.slice(0, 5 - images.length);
    setImages(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
  });

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition) {
      return toast.error('Please fill in all required fields');
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      images.forEach(img => data.append('images', img));

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Item listed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="container">
        <div className="sell-container animate-fade-in">
          <div className="sell-header">
            <h1 className="sell-title">Sell Your <span className="gradient-text">Item</span></h1>
            <p className="sell-subtitle">Fill in the details to list your item on the marketplace</p>
          </div>

          <form onSubmit={handleSubmit} className="sell-form glass-card" id="sell-form">
            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Photos (up to 5)</label>
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
                id="image-dropzone"
              >
                <input {...getInputProps()} />
                <FiUploadCloud className="dropzone-icon" />
                <p className="dropzone-text">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images or click to browse'}
                </p>
                <span className="dropzone-hint">JPG, PNG, GIF, WebP • Max 5MB each</span>
              </div>
              {previews.length > 0 && (
                <div className="image-previews">
                  {previews.map((preview, i) => (
                    <div key={i} className="preview-item">
                      <img src={preview} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="preview-remove"
                        onClick={() => removeImage(i)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., iPhone 13 Pro - 256GB"
                id="sell-title"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Describe your item's features, condition, and any defects..."
                rows={5}
                id="sell-description"
              />
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">Price *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '120px' }}
                  id="sell-currency"
                >
                  {currencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="input-icon-wrapper" style={{ flex: 1 }}>
                  <FiDollarSign className="input-icon" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="Enter price"
                    min="0"
                    id="sell-price"
                  />
                </div>
              </div>
            </div>

            {/* Category & Condition */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input"
                  id="sell-category"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-input"
                  id="sell-condition"
                >
                  <option value="">Select Condition</option>
                  {conditions.map(con => (
                    <option key={con} value={con}>{con}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Mumbai, Maharashtra"
                id="sell-location"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
              id="sell-submit"
            >
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellItem;
