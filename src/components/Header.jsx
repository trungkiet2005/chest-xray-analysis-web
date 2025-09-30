import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' || path === '/predict') {
      return location.pathname === '/' || location.pathname === '/predict';
    }
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-container">
          <div className="logo-section">
            <div className="logo">
              CX
            </div>
            <h1 className="app-title">ChestXray AI</h1>
          </div>
          
          <nav className="nav-section">
            <ul className="nav-links">
              <li>
                <Link 
                  to="/predict" 
                  className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
                >
                    Predict Detection
                </Link>
              </li>
                <li>
                  <Link 
                    to="/classification" 
                    className={`nav-link ${isActive('/classification') ? 'active' : ''}`}
                  >
                    Predict Classification
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  >
                    About
                  </Link>
                </li>
            </ul>
            
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              data-theme={theme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="theme-toggle-slider">
                {theme === 'light' ? '☀️' : '🌙'}
              </div>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
