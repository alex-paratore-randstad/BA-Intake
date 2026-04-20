import React from 'react';
import styles from './Dashboard.module.css';
import { mockSubmissions } from '../../data/mockData';

const Dashboard = () => {
  return (
    <div>
      <section className={styles.header}>
        <div>
          <h1 className={styles.title}>My Submissions</h1>
          <p className={styles.subtitle}>
            Track and manage your ongoing business analysis intakes. Maintain precision through every phase of the lifecycle.
          </p>
        </div>
      </section>

      <div className={styles.grid}>
        {mockSubmissions.map((sub) => (
          <div key={sub.id} className={styles.card}>
            <span className={styles.cardTag}>#{sub.id}</span>
            <h3 className={styles.cardTitle}>{sub.project}</h3>
            <p className={styles.cardSubtitle}>{sub.client}</p>
            
            <div className={styles.cardFooter}>
              <div className={styles.status}>
                <span 
                  className={styles.statusDot} 
                  style={{ backgroundColor: sub.status === 'In-Progress' ? 'var(--color-primary)' : 'var(--color-warning)' }}
                />
                <span style={{ color: sub.status === 'In-Progress' ? 'var(--color-primary)' : 'var(--color-warning)' }}>
                  {sub.status}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontWeight: 700, display: 'block' }}>DATE</span>
                <span style={{ fontSize: '12px' }}>{sub.date}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Large Feature Card */}
        <div className={styles.card} style={{ 
          gridColumn: 'span 2', 
          background: 'linear-gradient(135deg, var(--color-primary), #00A1E1)', 
          color: 'white',
          border: 'none'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '99px', width: 'fit-content' }}>
            Special Assignment
          </span>
          <h2 style={{ fontSize: '28px', marginTop: '16px', marginBottom: '8px' }}>Automated Data Pipeline Reconstruction</h2>
          <p style={{ opacity: 0.8, fontSize: '14px', marginBottom: '24px' }}>
            Urgent intake required for the modernization of the legacy SAP integration layers. Scheduled for high-priority review.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC7atiagB9H73VhQzz1IawkmpYLm0AU9qi70L5_bydOl6cz1U4iROv9lw9C-aKLxCXfCvIzWVl711s-tWPu80fH6Luw7kl3--AxatNT6i0ju0r54rrZuPCrIZVVnCU-DML3wbyC2YfLvFq4Xi1cjqk2UEIwmJI_QRkfK6m4VHOVd3g_O4mQ7EkbafOkSFFcM--vEko8ELbp7VXsWJaBVTouq3casmS2AvF16QIBqKwhU9yRFEkkIVvs6PD9hHwwuQ7rZtoIuRlDA" 
                  alt="Analyst" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
             <div>
               <p style={{ fontSize: '10px', opacity: 0.6 }}>Assigned To</p>
               <p style={{ fontSize: '14px', fontWeight: 700 }}>Elena Rodriguez</p>
             </div>
             <button style={{ marginLeft: 'auto', backgroundColor: 'white', color: 'var(--color-primary)', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
               View Details
             </button>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>ACTIVE QUESTIONS</span>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>check_circle</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>112</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>+5 added this month</div>
        </div>
        <div className={styles.statCard}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>MANDATORY COMPLETION</span>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-warning)' }}>priority_high</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>84%</div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#eee', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '84%', height: '100%', backgroundColor: 'var(--color-primary)' }} />
          </div>
        </div>
        <div className={styles.statCard}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>SYSTEM STATUS</span>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-success)' }}>auto_awesome</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>Optimal</div>
          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>All data streams are currently healthy.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
