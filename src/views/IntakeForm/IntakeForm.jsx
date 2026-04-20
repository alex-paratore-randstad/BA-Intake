import React, { useState } from 'react';
import styles from './IntakeForm.module.css';
import { useIntake } from '../../context/IntakeContext';

const IntakeForm = () => {
  const { questions, forms, currentIntake, selectForm, updateAnswer, performSignOff } = useIntake();
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  // If no form is selected, show the selection dropdown
  if (!currentIntake.formId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Start New Intake</h2>
          <p className={styles.instruction} style={{ borderLeft: 'none', paddingLeft: 0, marginBottom: '24px' }}>
            Please select the appropriate intake form to begin the process.
          </p>
          
          <div className={styles.questionItem}>
            <label className={styles.questionLabel}>Intake Type</label>
            <select 
              className={styles.input}
              onChange={(e) => selectForm(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Choose a form...</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  const selectedForm = forms.find(f => f.id === currentIntake.formId);
  const formQuestions = selectedForm.questions.map(fq => {
    return questions.find(q => q.id === fq.id && q.version === fq.version);
  }).filter(Boolean);

  const sections = [...new Set(formQuestions.map(q => q.section))];
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
        return (
          <div 
            className={styles.checkboxContainer}
            onClick={() => updateAnswer(q.id, currentIntake.answers[q.id] === 'Yes' ? 'No' : 'Yes')}
          >
            <span className="material-symbols-outlined" style={{ color: currentIntake.answers[q.id] === 'Yes' ? 'var(--color-primary)' : 'var(--color-outline)' }}>
              {currentIntake.answers[q.id] === 'Yes' ? 'check_box' : 'check_box_outline_blank'}
            </span>
            <span style={{ fontSize: '14px' }}>Confirm Action</span>
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
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>FORM: {selectedForm.name}</span>
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
