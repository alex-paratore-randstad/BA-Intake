import React from 'react';
import { checklistSeed } from '../../data/mockData';

const AdminPanel = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Question Bank</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>Manage the master list of analytical assessment questions.</p>
        </div>
        <button style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>
          Add New Question
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--color-surface-container-high)', fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>
            <tr>
              <th style={{ padding: '16px' }}>QUESTION NAME</th>
              <th style={{ padding: '16px' }}>SECTION</th>
              <th style={{ padding: '16px' }}>TYPE</th>
              <th style={{ padding: '16px' }}>WARNING TRIGGER</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            {checklistSeed.map((q, i) => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--color-outline)', backgroundColor: i % 2 === 0 ? 'white' : 'var(--color-surface-container-low)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{q.item}</td>
                <td style={{ padding: '16px' }}>
                   <span style={{ backgroundColor: 'var(--color-surface-container-high)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                    {q.section}
                   </span>
                </td>
                <td style={{ padding: '16px' }}>{q.type}</td>
                <td style={{ padding: '16px' }}>
                  {q.warningTrigger ? (
                    <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>{q.warningTrigger}</span>
                  ) : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
