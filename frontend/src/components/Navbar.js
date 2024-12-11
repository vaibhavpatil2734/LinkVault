import React from 'react';
import './Navbar.css'; // Import a CSS file for additional styling
import { FaLock } from 'react-icons/fa'; // Importing a lock icon for LinkVault

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <FaLock className="navbar-icon" />
          <h1>LinkVault</h1>
        </div>
      </div>
    </nav>
  );
}
