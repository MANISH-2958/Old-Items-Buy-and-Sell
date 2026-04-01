import './Loader.css';

const Loader = ({ fullPage = false, size = 'md' }) => {
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={`spinner spinner-${size}`}></div>
        <p className="loader-text">Loading...</p>
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`}></div>;
};

// Skeleton card for loading states
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton-body">
      <div className="skeleton skeleton-category"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-price"></div>
    </div>
  </div>
);

export default Loader;
