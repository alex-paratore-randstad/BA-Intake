import React, { createContext, useContext, useState, useEffect } from 'react';
import { checklistSeed } from '../data/mockData';

const IntakeContext = createContext();

export const useIntake = () => useContext(IntakeContext);

export const IntakeProvider = ({ children }) => {
  const [currentIntake, setCurrentIntake] = useState({
    answers: {},
    descriptions: {},
    signOff: { name: '', timestamp: null },
    status: 'Draft',
    currentStep: 0,
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Initializing with seed data
    setQuestions(checklistSeed);
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

  const performSignOff = (name) => {
    setCurrentIntake(prev => ({
      ...prev,
      signOff: {
        name,
        timestamp: new Date().toISOString()
      },
      status: 'Completed'
    }));
  };

  return (
    <IntakeContext.Provider value={{ 
      currentIntake, 
      questions, 
      updateAnswer, 
      updateDescription, 
      performSignOff,
      setCurrentIntake
    }}>
      {children}
    </IntakeContext.Provider>
  );
};
