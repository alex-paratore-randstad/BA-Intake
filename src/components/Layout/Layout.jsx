import React from 'react';
import styles from './Layout.module.css';

const Sidebar = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'intake', icon: 'assignment_add', label: 'Active Intake' },
    { id: 'checklist', icon: 'fact_check', label: 'Checklist' },
    { id: 'admin', icon: 'admin_panel_settings', label: 'Admin Panel' },
    { id: 'archives', icon: 'inventory_2', label: 'Archives' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <h1 className={styles.logo}>BA Portal</h1>
        <p className={styles.subLogo}>Precision Intake</p>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${currentView === item.id ? styles.navItemActive : ''}`}
            onClick={() => setView(item.id)}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <button className={styles.startBtn} onClick={() => setView('intake')}>
        <span className="material-symbols-outlined">add</span>
        Start New Intake
      </button>
    </aside>
  );
};

const TopBar = () => {
  return (
    <header className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)' }}>
          Analytical Atelier BA
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span className="material-symbols-outlined" style={{ cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
          notifications
        </span>
        <span className="material-symbols-outlined" style={{ cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
          settings
        </span>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden' }}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrxYDUUeE2KcegR_A3vHDO9f6rGBycpWRulOG7ieknGhXBF2Iw3iaoC0PQdPsCMuf9KGmElaoVi7Ehz_E5Si7d6FxQl695Yh0GRJTCb-oXD3uFwQmgnpJuuApqL5yI3hOSVsegPN7W1AqD8CnLVnVNJrlRA1YLTyrkKobzDSw3RYZxrj0BpPQAJmHrZkfJ-RAsxjrlzAWWI5SnRLPN508_3FutaxsUizLEBX-ehdGjNtTybn9hb9XVemDRaQRfIzoRgCTmU3twSA" 
            alt="User"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children, currentView, setView }) => {
  return (
    <div className={styles.container}>
      <Sidebar currentView={currentView} setView={setView} />
      <div className={styles.main}>
        <TopBar />
        <main style={{ padding: '40px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
