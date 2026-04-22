import React, { useState } from 'react';
import { useIntake } from '../../context/IntakeContext';

const AdminPanel = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion, batchAddQuestions, updateQuestionsOrder } = useIntake();
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'edit_question'
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const [questionData, setQuestionData] = useState({ item: '', section: '', type: 'Checkbox', instruction: '', warningTrigger: '', isRequired: false, options: [] });

  // Versions for a specific question ID
  const getLatestVersion = (id) => {
    return questions.filter(q => q.id === id).sort((a, b) => b.version - a.version)[0];
  };

  const activeLatestQuestions = questions
    .filter(q => q.isActive && q.version === getLatestVersion(q.id).version)
    .sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0));

  const moveGlobalQuestion = (index, direction) => {
    const orderIds = activeLatestQuestions.map(q => q.id);
    if (direction === 'up' && index > 0) {
      [orderIds[index - 1], orderIds[index]] = [orderIds[index], orderIds[index - 1]];
    } else if (direction === 'down' && index < orderIds.length - 1) {
      [orderIds[index + 1], orderIds[index]] = [orderIds[index], orderIds[index + 1]];
    }
    updateQuestionsOrder(orderIds);
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

    setQuestionData({ item: '', section: '', type: 'Checkbox', instruction: '', warningTrigger: '', isRequired: false, options: [] });
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

      const startIndex = lines[0].toLowerCase().includes('section') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const matches = lines[i].match(/(".*?"|[^",\r\n]*)(?:,|$)/g);
        if (!matches) continue;

        const cols = matches.map(m => m.replace(/^"|"|,$/g, '').trim());
        if (cols.length < 2) continue;

        parsedQuestions.push({
          section: cols[0] || 'Uncategorized',
          item: cols[1] || 'Untitled Item',
          type: cols[2]?.includes('[Input') ? 'Text' : 'Checkbox',
          adminNote: cols[3] || '',
          instruction: cols[4] || '',
          warningTrigger: cols[2]?.includes('Yes') ? 'Yes' : 'None'
        });
      }

      if (parsedQuestions.length > 0) {
        batchAddQuestions(parsedQuestions);
        alert(`Successfully imported ${parsedQuestions.length} questions.`);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>Admin Center</h1>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>Global configuration and master form management.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-high)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => { setActiveTab('questions'); setEditingQuestion(null); }}
            style={{ 
              padding: '8px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600,
              backgroundColor: activeTab === 'questions' ? 'white' : 'transparent',
              color: activeTab === 'questions' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)'
            }}
          >
            Form Configuration
          </button>
        </div>
      </div>

      {activeTab === 'questions' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-outline)', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-outline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Global Intake Form</h2>
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
                onClick={() => { setQuestionData({ item: '', section: '', type: 'Checkbox', instruction: '', warningTrigger: '', isRequired: false, options: [] }); setEditingQuestion(null); setActiveTab('edit_question'); }}
              >
                + Add Question
              </button>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--color-surface-container-low)', textAlign: 'left', fontSize: '12px' }}>
              <tr>
                <th style={{ padding: '16px', width: '50px' }}>ORDER</th>
                <th style={{ padding: '16px' }}>ITEM</th>
                <th style={{ padding: '16px' }}>SECTION</th>
                <th style={{ padding: '16px' }}>VERSION</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {activeLatestQuestions.map((q, index) => (
                <tr key={q.id + q.version} style={{ borderBottom: '1px solid var(--color-outline)', fontSize: '14px' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '16px', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                        onClick={() => moveGlobalQuestion(index, 'up')}
                      >
                        keyboard_arrow_up
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontWeight: 700 }}>
                        {index + 1}
                      </span>
                      <span 
                        className="material-symbols-outlined" 
                        style={{ fontSize: '16px', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}
                        onClick={() => moveGlobalQuestion(index, 'down')}
                      >
                        keyboard_arrow_down
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>
                    {q.item} {q.isRequired && <span style={{ color: 'var(--color-error)' }}>*</span>}
                  </td>
                  <td style={{ padding: '16px' }}>{q.section}</td>
                  <td style={{ padding: '16px' }}>v{q.version}</td>
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
              ))}
            </tbody>
          </table>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Type</label>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.type}
                onChange={(e) => setQuestionData({...questionData, type: e.target.value})}
              >
                <option value="Checkbox">Checkbox</option>
                <option value="Text">Text</option>
                <option value="Dropdown">Dropdown</option>
                <option value="Number">Number</option>
                <option value="Date">Date</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Warning Trigger</label>
              <input 
                type="text" 
                placeholder="e.g. Yes or None" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-outline)' }}
                value={questionData.warningTrigger}
                onChange={(e) => setQuestionData({...questionData, warningTrigger: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input 
              type="checkbox" 
              checked={questionData.isRequired}
              onChange={(e) => setQuestionData({...questionData, isRequired: e.target.checked})}
              style={{ width: '18px', height: '18px' }}
            />
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Mark as Required Field</label>
          </div>

          {questionData.type === 'Dropdown' && (
            <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Dropdown Options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {questionData.options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...questionData.options];
                        newOpts[idx] = e.target.value;
                        setQuestionData({...questionData, options: newOpts});
                      }}
                      style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--color-outline)' }}
                    />
                    <button 
                      onClick={() => setQuestionData({...questionData, options: questionData.options.filter((_, i) => i !== idx)})}
                      style={{ padding: '8px', color: 'var(--color-error)' }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setQuestionData({...questionData, options: [...questionData.options, 'New Option']})}
                style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}
              >
                + Add Option
              </button>
            </div>
          )}

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
