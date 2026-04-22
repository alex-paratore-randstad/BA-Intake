import React, { useState } from 'react';
import styles from './IntakeForm.module.css';
import { useIntake } from '../../context/IntakeContext';

const IntakeForm = () => {
  const { questions, forms, selectedFormId, selectForm, currentIntake, updateAnswer, updateDescription, performSignOff, loading, currentUser, userSubmissions, loadSubmission } = useIntake();
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center' }}>Connecting to Domo...</div>;
  }

  // Form Selection Screen
  if (!selectedFormId) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>Select Intake Form</h1>
          {currentUser && (
            <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '4px' }}>account_circle</span>
              {currentUser.displayName || currentUser.name}
            </div>
          )}
        </div>
        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '32px' }}>Choose the type of analysis request you would like to submit.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          {forms.map(form => (
            <div 
              key={form.id} 
              className={styles.card} 
              style={{ cursor: 'pointer', transition: 'transform 0.2s', marginBottom: '0' }}
              onClick={() => selectForm(form.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-primary)' }}>
                  {form.id === 'default' ? 'analytics' : 'assignment'}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '1px' }}>AVAILABLE</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{form.name}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>{form.description}</p>
              <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--color-primary)', fontSize: '14px' }}>
                Start Intake <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--color-outline)', paddingBottom: '8px' }}>Your Past Submissions</h2>
          {userSubmissions && userSubmissions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userSubmissions.map(sub => {
                const formName = forms.find(f => f.id === sub.formId)?.name || sub.formId;
                return (
                  <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px', border: '1px solid var(--color-outline)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{formName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Submitted: {sub.timestamp} • Status: {sub.status}</div>
                    </div>
                    <button 
                      className={`${styles.btn} ${styles.btnSecondary}`} 
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                      onClick={() => loadSubmission(sub.id, sub.formId)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle', marginRight: '4px' }}>edit</span>
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '12px', border: '1px dashed var(--color-outline)' }}>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>You haven't submitted any forms yet. Your history will appear here once you complete an intake.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Directly load all active questions from the Master Bank
  const formQuestions = questions.filter(q => q.isActive);

  // Determine sections based on active questions
  const sections = [...new Set(formQuestions.map(q => q.section))];

  if (sections.length === 0) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '80px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--color-outline)', marginBottom: '16px' }}>quiz</span>
        <h2>No questions configured</h2>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>This form has no questions configured in the Admin tool yet.</p>
        <button 
          className={`${styles.btn} ${styles.btnSecondary}`} 
          style={{ marginTop: '24px' }}
          onClick={() => selectForm(null)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestions = formQuestions.filter(q => q.section === sections[step]);

  const validateCurrentStep = () => {
    const missing = currentQuestions.filter(q => q.isRequired && !currentIntake.answers[q.id]);
    if (missing.length > 0) {
      setShowErrors(true);
      return false;
    }
    setShowErrors(false);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (step < sections.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    setShowErrors(false);
    if (step > 0) setStep(step - 1);
  };

  const handleSignOff = () => {
    if (!validateCurrentStep()) return;
    const name = currentIntake.answers['ba-name'] || 'Business Analyst';
    performSignOff(name);
  };

  const renderInput = (q) => {
    switch (q.type) {
      case 'Text':
        return (
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Type your answer..."
            value={currentIntake.answers[q.id] || ''}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          />
        );
      case 'Number':
        return (
          <input 
            type="number" 
            className={styles.input} 
            placeholder="0"
            value={currentIntake.answers[q.id] || ''}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          />
        );
      case 'Date':
        return (
          <input 
            type="date" 
            className={styles.input} 
            value={currentIntake.answers[q.id] || ''}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          />
        );
      case 'Dropdown':
        return (
          <select 
            className={styles.input}
            value={currentIntake.answers[q.id] || ''}
            onChange={(e) => updateAnswer(q.id, e.target.value)}
          >
            <option value="" disabled>Select option...</option>
            {q.options && q.options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'Checkbox':
      default:
        const isChecked = currentIntake.answers[q.id] === 'Yes';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div 
              className={styles.checkboxContainer}
              onClick={() => updateAnswer(q.id, isChecked ? 'No' : 'Yes')}
            >
              <span className="material-symbols-outlined" style={{ color: isChecked ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                {isChecked ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span style={{ fontSize: '14px' }}>Confirm Action</span>
            </div>
            
            {isChecked && (
              <div style={{ marginLeft: '32px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '8px' }}>
                  ADDITIONAL DETAILS
                </label>
                <textarea 
                  className={styles.textarea}
                  placeholder="Provide more information..."
                  value={currentIntake.descriptions[q.id] || ''}
                  onChange={(e) => updateDescription(q.id, e.target.value)}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        {sections.map((s, i) => (
          <div key={i} className={`${styles.step} ${step >= i ? styles.stepActive : ''}`}>
            <div className={styles.stepCircle}>{i + 1}</div>
            <span className={styles.stepLabel}>{s}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className={styles.sectionTitle}>{sections[step]}</h2>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>GLOBAL INTAKE</span>
        </div>
        
        {currentQuestions.map(q => (
          <div key={q.id} className={styles.questionItem}>
            <label className={styles.questionLabel}>
              {q.item} {q.isRequired && <span style={{ color: 'var(--color-error)' }}>*</span>}
            </label>
            {q.instruction && <p className={styles.instruction}>{q.instruction}</p>}
            
            {renderInput(q)}

            {/* Required Field Inline Validation */}
            {showErrors && q.isRequired && !currentIntake.answers[q.id] && (
              <p style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>
                This is a required field.
              </p>
            )}

            {/* Warning Banner Logic */}
            {q.warningTrigger !== 'None' && currentIntake.answers[q.id] === q.warningTrigger && (
              <div className={styles.warningBanner}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-warning)' }}>warning</span>
                <p className={styles.warningText}>Attention Required: {q.instruction}</p>
              </div>
            )}
          </div>
        ))}

        {/* Digital Sign-off Display */}
        {sections[step].includes('Sign-off') && currentIntake.signOff.timestamp && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px', borderLeft: '4px solid var(--color-success)' }}>
             <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-success)' }}>Digitally Signed Off</p>
             <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
               Signed by {currentIntake.signOff.name} on {currentIntake.signOff.timestamp}
             </p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button 
          className={`${styles.btn} ${styles.btnSecondary}`} 
          onClick={handleBack}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.5 : 1 }}
        >
          Back
        </button>
        
        {step < sections.length - 1 ? (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext}>
            Continue
          </button>
        ) : (
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`} 
            style={{ backgroundColor: 'var(--color-success)' }} 
            onClick={handleSignOff}
            disabled={!!currentIntake.signOff.timestamp}
          >
            {currentIntake.signOff.timestamp ? 'Intake Complete' : 'Complete & Sign-off'}
          </button>
        )}
      </div>
    </div>
  );
};

export default IntakeForm;
