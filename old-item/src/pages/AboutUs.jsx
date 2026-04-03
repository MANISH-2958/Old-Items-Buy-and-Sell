import React from 'react';
import './StaticPage.css';

const AboutUs = () => {
  return (
    <div className="static-page animate-fade-in">
      <div className="container">
        <h1 className="page-title">About <span className="gradient-text">Us</span></h1>
        <div className="glass-card content-card">
          <h2>TradeHub</h2>
          <p>
            Your trusted hub for buying and selling pre-owned items. 
            Trade smarter — find great deals or give your items a new home.
          </p>
          <p>
            Founded with the vision to make pre-owned trading accessible, secure, and delightful, 
            TradeHub connects individuals across communities. Whether you're decluttering, upgrading, 
            or searching for a rare gem, we're here to facilitate smart trades in an eco-friendly manner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
