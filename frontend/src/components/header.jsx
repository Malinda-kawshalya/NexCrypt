import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import '../style/header.css'; // Adjust the path as necessary

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navRef = useRef(null);

  const toggleNav = () => {
    setIsNavOpen((prev) => !prev);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="logo">
          <NavLink to="/" aria-label="NexCrypt Home">
            <h1>NexCrypt</h1>
          </NavLink>
        </div>

        <button
          className={`menu-icon ${isNavOpen ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isNavOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`nav ${isNavOpen ? 'active' : ''}`}
          ref={navRef}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            {[
              { to: '/', label: 'Home' },
              { to: '/file-encryption', label: 'File Encryption' },
              { to: '/digital-signature', label: 'Digital Signature' },
              { to: '/document-checker', label: 'Document Checker' },
              { to: '/message-interface', label: 'Message interface' },
            ].map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setIsNavOpen(false)}
                  end
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;