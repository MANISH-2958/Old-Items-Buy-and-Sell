import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';
import { SkeletonCard } from '../components/Loader';
import './Browse.css';

const categories = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Vehicles', 'Sports', 'Home & Garden', 'Other'];
const conditions = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || 'All',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchItems();
  }, [filters.page, filters.category, filters.condition, filters.sort]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category !== 'All') params.set('category', filters.category);
      if (filters.condition !== 'All') params.set('condition', filters.condition);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      params.set('sort', filters.sort);
      params.set('page', filters.page);
      params.set('limit', '12');

      const { data } = await API.get(`/items?${params.toString()}`);
      setItems(data.items || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);

      // Update URL
      setSearchParams(params);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    fetchItems();
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      condition: 'All',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      page: 1,
    });
  };

  const hasActiveFilters = filters.search || filters.category !== 'All' ||
    filters.condition !== 'All' || filters.minPrice || filters.maxPrice;

  return (
    <div className="browse-page">
      <div className="container">
        {/* Header */}
        <div className="browse-header animate-fade-in">
          <div>
            <h1 className="browse-title">Browse <span className="gradient-text">Items</span></h1>
            <p className="browse-subtitle">{totalItems} items available</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="browse-controls animate-fade-in-delay-1">
          <form className="browse-search" onSubmit={handleSearch} id="browse-search-form">
            <FiSearch className="browse-search-icon" />
            <input
              type="text"
              placeholder="Search for items..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="form-input browse-search-input"
              id="browse-search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm" id="browse-search-btn">
              Search
            </button>
          </form>

          <div className="browse-filter-actions">
            <button
              className={`btn btn-secondary btn-sm ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              id="browse-filter-toggle"
            >
              <FiFilter /> Filters
            </button>
            {hasActiveFilters && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters} id="browse-clear-filters">
                <FiX /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel glass-card animate-scale-in" id="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  id="filter-category"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="form-label">Condition</label>
                <select
                  className="form-input"
                  value={filters.condition}
                  onChange={(e) => updateFilter('condition', e.target.value)}
                  id="filter-condition"
                >
                  {conditions.map(con => (
                    <option key={con} value={con}>{con}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  id="filter-min-price"
                />
              </div>

              <div className="filter-group">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  id="filter-max-price"
                />
              </div>

              <div className="filter-group">
                <label className="form-label">Sort By</label>
                <select
                  className="form-input"
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  id="filter-sort"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group filter-apply">
                <button className="btn btn-primary" onClick={fetchItems} id="filter-apply-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="active-filters">
            {filters.search && (
              <span className="filter-tag">
                Search: "{filters.search}"
                <button onClick={() => updateFilter('search', '')}><FiX /></button>
              </span>
            )}
            {filters.category !== 'All' && (
              <span className="filter-tag">
                {filters.category}
                <button onClick={() => updateFilter('category', 'All')}><FiX /></button>
              </span>
            )}
            {filters.condition !== 'All' && (
              <span className="filter-tag">
                {filters.condition}
                <button onClick={() => updateFilter('condition', 'All')}><FiX /></button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="filter-tag">
                {filters.minPrice || '0'} - {filters.maxPrice || '∞'}
                <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}><FiX /></button>
              </span>
            )}
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="items-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length > 0 ? (
          <div className="items-grid">
            {items.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination" id="pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={filters.page <= 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              <FiChevronLeft /> Previous
            </button>
            <div className="pagination-info">
              Page {filters.page} of {totalPages}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
