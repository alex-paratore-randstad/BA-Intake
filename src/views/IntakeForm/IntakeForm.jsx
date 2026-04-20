import React, { useState } from 'react';
import styles from './IntakeForm.module.css';
import { useIntake } from '../../context/IntakeContext';

const IntakeForm = () => {
  const { questions, currentIntake, updateAnswer, updateDescription, performSignOff } = useIntake();
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'Intake', sections: ['BA Name', 'Request Information'] },
    { label: 'Discovery', sections: ['I. Discovery & Existing Solutions'] },
    { label: 'Feasibility', sections: ['II. Feasibility Assessment'] },
    { label: 'Requirements', sections: ['III. Defining Specifics (Requirements)', 'IV. Sizing the Problem/Impact'] },
    { label: 'Sign-off', sections: ['V. Sign-off and Jira Tagging'] }
  ];

  const currentQuestions = questions.filter(q => steps[step].sections.includes(q.section));

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSignOff = () => {
    const name = currentIntake.answers['ba-name'] || 'Analytical Analyst';
    performSignOff(name);
    alert(`Signed off by ${name} at ${new Date().toLocaleString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stepIndicator}>
        {steps.map((s, i) => (
          <div key={i} className={`${styles.step} ${step >= i ? styles.stepActive : ''}`}>
            <div className={styles.stepCircle}>{i + 1}</div>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>{steps[step].label} Assessment</h2>
        
        {currentQuestions.map(q => (
          <div key={q.id} className={styles.questionItem}>
            <label className={styles.questionLabel}>{q.item}</label>
            {q.instruction && <p className={styles.instruction}>{q.instruction}</p>}
            
            {q.type === 'Input Required' || q.type === '[Client Name]' || q.type === 'Beeline' ? (
              <input 
                type="text" 
                className={styles.input} 
                placeholder={q.type}
                value={currentIntake.answers[q.id] || ''}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
              />
            ) : (
              <div 
                className={styles.checkboxContainer}
                onClick={() => updateAnswer(q.id, currentIntake.answers[q.id] === 'Yes' ? 'No' : 'Yes')}
              >
                <span className="material-symbols-outlined" style={{ color: currentIntake.answers[q.id] === 'Yes' ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                  {currentIntake.answers[q.id] === 'Yes' ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <span style={{ fontSize: '14px' }}>Confirm Action</span>
              </div>
            )}

            {/* Warning Banner Logic */}
            {q.warningTrigger && currentIntake.answers[q.id] === q.warningTrigger && (
              <div className={styles.warningBanner}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-warning)' }}>warning</span>
                <p className={styles.warningText}>Attention Required: {q.instruction}</p>
              </div>
            )}

            {/* Description field for every item as requested */}
            <textarea 
              className={styles.textarea}
              placeholder="Add additional details/description..."
              value={currentIntake.descriptions[q.id] || ''}
              onChange={(e) => updateDescription(q.id, e.target.value)}
            />
          </div>
        ))}
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
        
        {step < steps.length - 1 ? (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleNext}>
            Continue to {steps[step + 1].label}
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.btnPrimary}`} style={{ backgroundColor: 'var(--color-success)' }} onClick={handleSignOff}>
            Complete & Sign-off
          </button>
        )}
      </div>
    </div>
  );
};

export default IntakeForm;
