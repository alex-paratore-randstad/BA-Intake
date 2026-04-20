import React, { createContext, useContext, useState, useEffect } from 'react';
import { checklistSeed, initialForms } from '../data/mockData';

const IntakeContext = createContext();

export const useIntake = () => useContext(IntakeContext);

export const IntakeProvider = ({ children }) => {
  const [currentIntake, setCurrentIntake] = useState({
    formId: null,
    answers: {},
    descriptions: {},
    signOff: { name: '', timestamp: null },
    status: 'Draft',
    currentStep: 0,
  });

  const [questions, setQuestions] = useState([]);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    // Initializing with seed data
    setQuestions(checklistSeed);
    setForms(initialForms);
  }, []);

  const updateAnswer = (questionId, value) => {
    setCurrentIntake(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const updateDescription = (questionId, text) => {
    setCurrentIntake(prev => ({
      ...prev,
      descriptions: { ...prev.descriptions, [questionId]: text }
    }));
  };

  const selectForm = (formId) => {
    setCurrentIntake(prev => ({
      ...prev,
      formId,
      answers: {},
      descriptions: {},
      currentStep: 0
    }));
  };

  const addForm = (newForm) => {
    setForms(prev => [...prev, { ...newForm, id: `form-${Date.now()}` }]);
  };

  const performSignOff = (name) => {
    setCurrentIntake(prev => ({
      ...prev,
      signOff: {
        name,
        timestamp: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
      },
      status: 'Completed'
    }));
  };

  return (
    <IntakeContext.Provider value={{ 
      currentIntake, 
      questions, 
      forms,
      selectForm,
      addForm,
      updateAnswer, 
      updateDescription, 
      performSignOff,
      setCurrentIntake
    }}>
      {children}
    </IntakeContext.Provider>
  );
};
