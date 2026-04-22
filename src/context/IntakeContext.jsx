import React, { createContext, useContext, useState, useEffect } from 'react';
import { checklistSeed } from '../data/mockData';

const IntakeContext = createContext();

export const useIntake = () => useContext(IntakeContext);

export const IntakeProvider = ({ children }) => {
  const [currentIntake, setCurrentIntake] = useState({
    submissionId: `sub-${Date.now()}`,
    answers: {},
    descriptions: {},
    signOff: { name: '', timestamp: null },
    status: 'Draft',
    currentStep: 0,
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Sort by orderIdx
    setQuestions(checklistSeed.sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0)));
  }, []);

  // Questions CRUD
  const addQuestion = (q) => {
    const newId = q.id || `q-${Date.now()}`;
    setQuestions(prev => [...prev, { 
      ...q, id: newId, version: 1, isActive: true, adminNote: q.adminNote || '', 
      isRequired: q.isRequired || false, options: q.options || [], orderIdx: prev.length 
    }]);
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
          isActive: true,
          isRequired: q.isRequired || false,
          options: q.options || [],
          orderIdx: prev.length + idx
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

  const updateQuestionsOrder = (orderedIds) => {
    setQuestions(prev => {
      return prev.map(q => {
        const newOrder = orderedIds.indexOf(q.id);
        if (newOrder !== -1) {
          return { ...q, orderIdx: newOrder };
        }
        return q;
      }).sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0));
    });
  };

  const updateAnswer = (questionId, value) => {
    setCurrentIntake(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const performSignOff = (name) => {
    const timestamp = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
    
    // Simulate Domo AppDB EAV Submission
    const headerRecord = {
      id: currentIntake.submissionId,
      baName: name,
      timestamp: timestamp,
      status: 'Completed'
    };

    const answerRecords = Object.keys(currentIntake.answers).map((qId) => {
      const qInfo = questions.find(q => q.id === qId);
      return {
        id: `ans-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        submissionId: currentIntake.submissionId,
        questionId: qId,
        questionVersion: qInfo ? qInfo.version : 1,
        answerValue: currentIntake.answers[qId]
      };
    });

    console.log("DOMO APPDB MOCK SUBMISSION (EAV FORMAT): ");
    console.log("Intake_Headers Collection:", [headerRecord]);
    console.log("Intake_Answers Collection:", answerRecords);

    setCurrentIntake(prev => ({
      ...prev,
      signOff: { name, timestamp },
      status: 'Completed'
    }));
  };

  return (
    <IntakeContext.Provider value={{ 
      currentIntake, 
      questions, 
      addQuestion,
      batchAddQuestions,
      updateQuestion,
      deleteQuestion,
      updateQuestionsOrder,
      updateAnswer, 
      performSignOff,
      setCurrentIntake
    }}>
      {children}
    </IntakeContext.Provider>
  );
};
