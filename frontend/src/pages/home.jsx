import React from 'react';
import { Link } from 'react-router-dom';
import '../style/main.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="main-header">
        <h1>NexCrypt</h1>
        <p>Advanced Cryptographic Solutions for Modern Security Needs</p>
      </header>

      <div className="feature-grid">
        <Link to="/document-integrity" className="feature-box">
          <div className="feature-icon">📄</div>
          <h2>Document Integrity</h2>
          <p>Verify and secure document authenticity with our hash verification system</p>
        </Link>
        
        <Link to="/encrypted-messaging" className="feature-box">
          <div className="feature-icon">💬</div>
          <h2>Encrypted Messaging</h2>
          <p>Send secure end-to-end encrypted messages with military-grade encryption</p>
        </Link>
        
        <Link to="/key-management" className="feature-box">
          <div className="feature-icon">🔑</div>
          <h2>Key Management</h2>
          <p>Generate, store and manage cryptographic keys securely</p>
        </Link>
        
        <Link to="/encryption-tools" className="feature-box">
          <div className="feature-icon">🛡️</div>
          <h2>Encryption Tools</h2>
          <p>Access various encryption and decryption utilities for data protection</p>
        </Link>
      </div>

      <footer className="main-footer">
        <p>
          Built with React and Web Cryptography API
          <br />
          For educational purposes only
        </p>
      </footer>
    </div>
  );
};

export default Home;