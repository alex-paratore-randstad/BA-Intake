import React, { useState } from 'react';
import { useIntake } from '../../context/IntakeContext';

const AdminPanel = () => {
  const { questions, forms, addForm } = useIntake();
  const [activeTab, setActiveTab] = useState('forms'); // 'forms' or 'create'
  const [newForm, setNewForm] = useState({ name: '', description: '', questionIds: [] });

  const handleToggleQuestion = (id) => {
    setNewForm(prev => {
      const exists = prev.questionIds.includes(id);
      return {
        ...prev,
        questionIds: exists 
          ? prev.questionIds.filter(qId => qId !== id) 
          : [...prev.questionIds, id]
      };
    });
  };

  const handleSaveForm = () => {
    if (!newForm.name || newForm.questionIds.length === 0) {
      alert('Please provide a name and select at least one question.');
      return;
    }
    addForm(newForm);
    setNewForm({ name: '', description: '', questionIds: [] });
    setActiveTab('forms');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>Admin Panel</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>Manage intake forms and question mapping.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-high)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('forms')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: 600,
              backgroundColor: activeTab === 'forms' ? 'white' : 'transparent',
              color: activeTab === 'forms' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'
            }}
          >
            Manage Forms
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              fontSize: '14px', 
              fontWeight: 600,
              backgroundColor: activeTab === 'create' ? 'white' : 'transparent',
              color: activeTab === 'create' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'
            }}
          >
            Create New Form
          </button>
        </div>
      </div>

      {activeTab === 'forms' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {forms.map(form => (
            <div key={form.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-outline)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{form.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>
                {form.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-outline)', paddingTop: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {form.questionIds.length} QUESTIONS
                </span>
                <button style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 700 }}>EDIT DETAILS</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-outline)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Build Custom Form</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Form Name</label>
            <input 
              type="text" 
              placeholder="e.g. Finance Intake" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
              value={newForm.name}
              onChange={(e) => setNewForm({...newForm, name: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Form Description</label>
            <textarea 
              placeholder="Provide context for this intake type..." 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', minHeight: '80px' }}
              value={newForm.description}
              onChange={(e) => setNewForm({...newForm, description: e.target.value})}
            />
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Select Questions (Master Bank)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', marginBottom: '32px' }}>
            {questions.map(q => (
              <div 
                key={q.id} 
                onClick={() => handleToggleQuestion(q.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-outline)',
                  cursor: 'pointer',
                  backgroundColor: newForm.questionIds.includes(q.id) ? 'var(--color-surface-container-low)' : 'white'
                }}
              >
                <span className="material-symbols-outlined" style={{ color: newForm.questionIds.includes(q.id) ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                  {newForm.questionIds.includes(q.id) ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{q.item}</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>{q.section}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={handleSaveForm}
              style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 700 }}
            >
              Save New Form
            </button>
            <button 
              onClick={() => setActiveTab('forms')}
              style={{ flex: 1, backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', padding: '14px', borderRadius: '8px', fontWeight: 700 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
