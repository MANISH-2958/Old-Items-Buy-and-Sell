import React from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './StaticPage.css';

const ContactUs = () => {
  return (
    <div className="static-page animate-fade-in">
      <div className="container">
        <h1 className="page-title">Contact <span className="gradient-text">Us</span></h1>
        <div className="glass-card content-card text-center">
          <h2>Get in Touch</h2>
          <p className="contact-subtitle">Contact the developers directly for any inquiries or support.</p>
          
          <div className="contact-list">
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>manishmanish5006@gmail.com</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>thanish914@gmail.com</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>shreedhyanvg7@gmail.com</span>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <span>tanzilsheiks100@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
