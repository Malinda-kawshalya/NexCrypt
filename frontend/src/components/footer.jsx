import React from 'react';
import { NavLink } from 'react-router-dom';
import '../style/footer.css'; // Adjust the path as necessary

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-brand">
          <NavLink to="/" aria-label="NexCrypt Home">
            <h2>NexCrypt</h2>
          </NavLink>
          <p>Securing the future with advanced cryptography</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul className="footer-nav-list">
            {[
              { to: '/', label: 'Home' },
              { to: '/file-encryption', label: 'File Encryption' },
              { to: '/digital-signature', label: 'Digital Signature' },
              { to: '/document-checker', label: 'Document Checker' },
              { to: '/message-interface', label: 'Message Interface' },
            ].map((item) => (
              <li className="footer-nav-item" key={item.to}>
                <NavLink to={item.to} end>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-info">
          <h3>Information</h3>
          <p>
            Built with React and Web Cryptography API
            <br />
            For educational purposes only
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NexCrypt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;