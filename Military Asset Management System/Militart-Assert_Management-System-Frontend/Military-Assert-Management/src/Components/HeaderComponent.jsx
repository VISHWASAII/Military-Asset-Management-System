import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'react-feather'; // react-feather icons

function Header({ onToggleSidebar, isSidebarOpen, currentPage }) {
  const navigate = useNavigate();

  const getPageTitle = (page) => {
    const titles = {
      dashboard: 'Dashboard',
      expenditures: 'Expenditure Management',
      assets: 'Asset Management',
      reports: 'Reports & Analytics',
      settings: 'Settings'
    };
    return titles[page] || 'Military Asset Management';
  };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #e5e7eb',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 16px',
  };

  const leftGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const buttonStyle = {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'background-color 0.2s',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  };

  const rightGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const navLinkStyle = {
    fontSize: '0.875rem',
    color: '#2563eb',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  };

  const userInfoStyle = {
    display: window.innerWidth >= 768 ? 'flex' : 'none',
    alignItems: 'center',
    gap: '8px',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 500,
    fontSize: '0.875rem',
  };

  const userNameStyle = {
    fontSize: '0.875rem',
    color: '#4b5563',
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Left group with toggle and title */}
        <div style={leftGroupStyle}>
          <h1 style={titleStyle}>{getPageTitle(currentPage)}</h1>
        </div>

        {/* Right group with nav links and user info */}
        <div style={rightGroupStyle}>
          <span
            style={navLinkStyle}
            onClick={() => navigate('/logPage')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Logs
          </span>
          <span
            style={navLinkStyle}
            onClick={() => navigate('/assetPage')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Assets
          </span>
          <span
            style={navLinkStyle}
            onClick={() => navigate('/basePage')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Base
          </span>

          <div style={userInfoStyle}>
            <div style={avatarStyle}>SV</div>
            <span style={userNameStyle}>Sai Vishwa</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
