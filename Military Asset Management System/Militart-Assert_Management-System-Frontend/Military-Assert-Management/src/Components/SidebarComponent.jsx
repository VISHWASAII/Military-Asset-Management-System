import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  DollarSign,
  Package,
  FileText,
  Settings,
  LogOut,
  CreditCard
} from 'react-feather';
import Cookies from 'js-cookie';

function Sidebar({ isOpen, onClose, currentPage, onNavigate = () => {} }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Expenditures', icon: DollarSign, page: 'expenditures' },
    { name: 'Assignment', icon: Package, page: 'assets' },
    { name: 'Transfer', icon: FileText, page: 'reports' },
    { name: 'Purchase', icon: CreditCard, page: 'settings' },
    { name: 'Logout', icon: LogOut, page: 'logout', isLogout: true }
  ];

  const handleNavigation = async (page) => {
    const pageRoutes = {
      dashboard: '/dashboardPage',
      expenditures: '/expenditurePage',
      assets: '/assignmentPage',
      reports: '/transferPage',
      settings: '/purchasePage',
      logout: '/loginPage'
    };

    if (page === 'logout') {
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      navigate('/loginPage');
      return;
    }

    const path = pageRoutes[page];
    if (path) {
      navigate(path);
    }

    if (window.innerWidth < 1024) {
      onClose();
    }

    onNavigate(page);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 30,
      display: isOpen ? 'block' : 'none',
      cursor: 'pointer',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 40,
      width: 256,
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#1a202c',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      ...(window.innerWidth >= 1024
        ? {
            position: 'static',
            transform: 'none',
            height: 'auto',
            width: 256,
          }
        : {}),
    },
    header: {
      height: 64,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      borderBottom: '1px solid #4a5568',
      backgroundColor: '#2d3748',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.125rem',
    },
    nav: {
      flex: 1,
      padding: '24px 16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    button: (isActive, isLogout) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '1rem',
      backgroundColor: isActive ? '#2563eb' : 'transparent',
      color: isActive
        ? '#fff'
        : isLogout
        ? '#f87171'
        : '#d1d5db',
      boxShadow: isActive ? '0 4px 6px rgba(37, 99, 235, 0.5)' : 'none',
      border: 'none',
      outline: 'none',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    }),
    footer: {
      padding: 16,
      borderTop: '1px solid #4a5568',
      backgroundColor: '#2d3748',
      color: '#a0aec0',
      fontSize: '0.75rem',
      textAlign: 'center',
    },
  };

  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}
      <aside style={styles.sidebar}>
        <div style={styles.header}>Navigation</div>
        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.page)}
                style={styles.button(isActive, item.isLogout)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = item.isLogout
                    ? 'rgba(220, 38, 38, 0.2)'
                    : '#2d3748';
                  e.currentTarget.style.color = item.isLogout
                    ? '#fca5a5'
                    : '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? '#2563eb'
                    : 'transparent';
                  e.currentTarget.style.color = isActive
                    ? '#fff'
                    : item.isLogout
                    ? '#f87171'
                    : '#d1d5db';
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div style={styles.footer}>© 2024 My App</div>
      </aside>
    </>
  );
}

export default Sidebar;
