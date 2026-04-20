import React, { useState } from 'react';
import { useIntake } from '../../context/IntakeContext';

const AdminPanel = () => {
  const { questions, forms, addForm, updateForm, addQuestion, updateQuestion, deleteQuestion, batchAddQuestions } = useIntake();
  const [activeTab, setActiveTab] = useState('forms'); // 'forms', 'questions', or 'create'
  const [editingForm, setEditingForm] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', description: '', questions: [] });
  const [questionData, setQuestionData] = useState({ item: '', section: '', type: 'Check', instruction: '', warningTrigger: '' });

  // Filter only active questions for selection
  const activeQuestions = questions.filter(q => q.isActive);
  
  // Versions for a specific question ID
  const getLatestVersion = (id) => {
    return questions.filter(q => q.id === id).sort((a, b) => b.version - a.version)[0];
  };

  const handleToggleQuestion = (id) => {
    setFormData(prev => {
      const exists = prev.questions.find(q => q.id === id);
      const latest = getLatestVersion(id);
      return {
        ...prev,
        questions: exists 
          ? prev.questions.filter(q => q.id !== id) 
          : [...prev.questions, { id: latest.id, version: latest.version }]
      };
    });
  };

  const handleSaveForm = () => {
    if (!formData.name || formData.questions.length === 0) {
      alert('Please provide a name and select at least one question.');
      return;
    }
    
    if (editingForm) {
      updateForm(editingForm.id, formData);
    } else {
      addForm(formData);
    }
    
    setFormData({ name: '', description: '', questions: [] });
    setEditingForm(null);
    setActiveTab('forms');
  };

  const handleSaveQuestion = () => {
    if (!questionData.item || !questionData.section) {
      alert('Item and Section are required.');
      return;
    }

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, questionData);
    } else {
      addQuestion(questionData);
    }

    setQuestionData({ item: '', section: '', type: 'Check', instruction: '', warningTrigger: '' });
    setEditingQuestion(null);
    setActiveTab('questions');
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split('\n');
      const parsedQuestions = [];

      // Skip header if it exists
      const startIndex = lines[0].toLowerCase().includes('section') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Basic CSV parser for quoted fields
        const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
        const matches = lines[i].match(/(".*?"|[^",\r\n]*)(?:,|$)/g);
        
        if (!matches) continue;

        const cols = matches.map(m => m.replace(/^"|"|,$/g, '').trim());
        
        if (cols.length < 2) continue;

        parsedQuestions.push({
          section: cols[0] || 'Uncategorized',
          item: cols[1] || 'Untitled Item',
          type: cols[2]?.includes('[Input') ? 'Input Required' : 'Check',
          adminNote: cols[3] || '',
          instruction: cols[4] || '',
          warningTrigger: cols[2]?.includes('Yes') ? 'Yes' : ''
        });
      }

      if (parsedQuestions.length > 0) {
        batchAddQuestions(parsedQuestions);
        alert(`Successfully imported ${parsedQuestions.length} questions.`);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset for next upload
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>Admin Center</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>Global configuration and master bank management.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-high)', padding: '4px', borderRadius: '8px' }}>
          {['forms', 'questions'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setEditingForm(null); setEditingQuestion(null); }}
              style={{ 
                padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600,
                backgroundColor: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'forms' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button 
              className="btn btnPrimary" 
              onClick={() => { setFormData({ name: '', description: '', questions: [] }); setEditingForm(null); setActiveTab('create_form'); }}
              style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}
            >
              + Create New Form
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {forms.map(form => (
              <div key={form.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-outline)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{form.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginBottom: '20px', height: '40px', overflow: 'hidden' }}>
                  {form.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-outline)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {form.questions.length} QUESTIONS
                  </span>
                  <button 
                    style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 700 }}
                    onClick={() => { setEditingForm(form); setFormData({ ...form }); setActiveTab('create_form'); }}
                  >
                    EDIT FORM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'questions' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-outline)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-outline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Master Question Bank</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ 
                backgroundColor: 'var(--color-surface-container-high)', 
                color: 'var(--color-on-surface)', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Import CSV
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvUpload} />
              </label>
              <button 
                className="btn" 
                style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px' }}
                onClick={() => { setQuestionData({ item: '', section: '', type: 'Check', instruction: '', warningTrigger: '' }); setEditingQuestion(null); setActiveTab('edit_question'); }}
              >
                + Add Question
              </button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--color-surface-container-low)', textAlign: 'left', fontSize: '12px' }}>
              <tr>
                <th style={{ padding: '16px' }}>ITEM</th>
                <th style={{ padding: '16px' }}>SECTION</th>
                <th style={{ padding: '16px' }}>VERSION</th>
                <th style={{ padding: '16px' }}>NOTES</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {questions.filter(q => q.isActive || questions.filter(inner => inner.id === q.id && inner.isActive).length === 0).map(q => {
                const latest = getLatestVersion(q.id);
                if (q.version !== latest.version) return null; // Only show latest version in bank
                return (
                  <tr key={q.id + q.version} style={{ borderBottom: '1px solid var(--color-outline)', fontSize: '14px' }}>
                    <td style={{ padding: '16px' }}>{q.item}</td>
                    <td style={{ padding: '16px' }}>{q.section}</td>
                    <td style={{ padding: '16px' }}>v{q.version}</td>
                    <td style={{ padding: '16px' }}>
                      {q.adminNote ? (
                        <span title={q.adminNote} style={{ cursor: 'help', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600 }}>
                          View Note
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        style={{ marginRight: '16px', color: 'var(--color-primary)', fontWeight: 600 }}
                        onClick={() => { setEditingQuestion(q); setQuestionData({ ...q }); setActiveTab('edit_question'); }}
                      >
                        Edit
                      </button>
                      <button 
                        style={{ color: 'var(--color-error)', fontWeight: 600 }}
                        onClick={() => deleteQuestion(q.id)}
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'create_form' && (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-outline)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>{editingForm ? 'Edit Form' : 'Build Custom Form'}</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Form Name</label>
            <input 
              type="text" 
              className="input"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Form Description</label>
            <textarea 
              className="textarea"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', minHeight: '80px' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Select Questions (Master Bank)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', marginBottom: '32px' }}>
            {activeQuestions.map(q => {
              const latest = getLatestVersion(q.id);
              if (q.version !== latest.version) return null;
              
              const isSelected = formData.questions.some(fq => fq.id === q.id);
              const currentVersionInForm = formData.questions.find(fq => fq.id === q.id)?.version;
              const needsUpgrade = isSelected && currentVersionInForm < latest.version;

              return (
                <div 
                  key={q.id} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', 
                    border: '1px solid var(--color-outline)',
                    backgroundColor: isSelected ? 'var(--color-surface-container-low)' : 'white'
                  }}
                >
                  <div onClick={() => handleToggleQuestion(q.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <span className="material-symbols-outlined" style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                      {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600 }}>{q.item}</p>
                      <p style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)' }}>v{currentVersionInForm || q.version} • {q.section}</p>
                    </div>
                  </div>
                  {needsUpgrade && (
                    <button 
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        questions: prev.questions.map(fq => fq.id === q.id ? { id: q.id, version: latest.version } : fq)
                      }))}
                      style={{ fontSize: '10px', backgroundColor: 'var(--color-warning)', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}
                    >
                      UPGRADE TO v{latest.version}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handleSaveForm} style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 700 }}>Save Changes</button>
            <button onClick={() => setActiveTab('forms')} style={{ flex: 1, backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', padding: '14px', borderRadius: '8px', fontWeight: 700 }}>Cancel</button>
          </div>
        </div>
      )}

      {activeTab === 'edit_question' && (
        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-outline)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>{editingQuestion ? `Edit Question (Creating v${editingQuestion.version + 1})` : 'New Question'}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Question Text</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.item}
                onChange={(e) => setQuestionData({...questionData, item: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Section</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.section}
                onChange={(e) => setQuestionData({...questionData, section: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Instruction</label>
            <textarea 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)', minHeight: '60px' }}
              value={questionData.instruction}
              onChange={(e) => setQuestionData({...questionData, instruction: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Type</label>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.type}
                onChange={(e) => setQuestionData({...questionData, type: e.target.value})}
              >
                <option value="Check">Checkbox</option>
                <option value="Input Required">Text Input</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Warning Trigger (Yes/No)</label>
              <input 
                type="text" 
                placeholder="e.g. Yes" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.warningTrigger}
                onChange={(e) => setQuestionData({...questionData, warningTrigger: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handleSaveQuestion} style={{ flex: 1, backgroundColor: 'var(--color-primary)', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 700 }}>Save Question</button>
            <button onClick={() => setActiveTab('questions')} style={{ flex: 1, backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)', padding: '14px', borderRadius: '8px', fontWeight: 700 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
