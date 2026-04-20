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
    setQuestions(checklistSeed);
    setForms(initialForms);
  }, []);

  // Questions CRUD
  const addQuestion = (q) => {
    const newId = q.id || `q-${Date.now()}`;
    setQuestions(prev => [...prev, { ...q, id: newId, version: 1, isActive: true, adminNote: q.adminNote || '' }]);
  };

  const batchAddQuestions = (newQuestions) => {
    setQuestions(prev => {
      const existingItems = new Set(prev.map(q => q.item.toLowerCase()));
      const toAdd = newQuestions
        .filter(q => !existingItems.has(q.item.toLowerCase()))
        .map((q, idx) => ({
          ...q,
          id: `q-csv-${Date.now()}-${idx}`,
          version: 1,
          isActive: true
        }));
      
      return [...prev, ...toAdd];
    });
  };

  const updateQuestion = (id, updatedFields) => {
    setQuestions(prev => {
      // Find current max version for this ID
      const versions = prev.filter(q => q.id === id);
      const current = versions.sort((a, b) => b.version - a.version)[0];
      
      // Create a NEW version instead of overwriting
      const newVersion = {
        ...current,
        ...updatedFields,
        version: current.version + 1,
        isActive: true
      };
      
      return [...prev, newVersion];
    });
  };

  const deleteQuestion = (id) => {
    // Soft delete: set all versions of this ID to inactive
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isActive: false } : q));
  };

  // Forms CRUD
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

  const updateForm = (id, updatedForm) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, ...updatedForm } : f));
  };

  const updateAnswer = (questionId, value) => {
    setCurrentIntake(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
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
      addQuestion,
      updateQuestion,
      deleteQuestion,
      selectForm,
      addForm,
      updateForm,
      updateAnswer, 
      performSignOff,
      setCurrentIntake
    }}>
      {children}
    </IntakeContext.Provider>
  );
};
