import React, { createContext, useContext, useState, useEffect } from 'react';
import { checklistSeed } from '../data/mockData';

const IntakeContext = createContext();

export const useIntake = () => useContext(IntakeContext);

// Helper for Domo AppDB calls to handle local dev gracefully
const domoRequest = async (method, url, data = null) => {
  if (typeof domo === 'undefined') {
    console.warn(`Domo SDK not found. Mocking ${method} to ${url}`);
    return null;
  }
  try {
    const options = data ? { body: data } : {};
    return await domo[method.toLowerCase()](url, options);
  } catch (error) {
    console.error(`Domo AppDB Error (${method} ${url}):`, error);
    throw error;
  }
};

export const IntakeProvider = ({ children }) => {
  const [currentIntake, setCurrentIntake] = useState({
    submissionId: `sub-${Date.now()}`,
    formId: null,
    answers: {},
    descriptions: {},
    signOff: { name: '', timestamp: null },
    status: 'Draft',
    currentStep: 0,
  });

  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState([]);

  // Fetch Forms, Questions, and User Data from Domo
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch User first to get past submissions
        let user = null;
        try {
          user = await domoRequest('GET', '/domo/users/v1/me');
          if (user) setCurrentUser(user);
        } catch (e) {
          console.warn("Could not fetch user details, using fallback.");
          user = { id: 'dev-user-1', displayName: 'Dev User' };
          setCurrentUser(user);
        }

        const fetchPromises = [
          domoRequest('GET', '/domo/appdb/v1/collections/Config_Forms/documents'),
          domoRequest('GET', '/domo/appdb/v1/collections/Config_Questions/documents')
        ];

        // Only fetch submissions if we have a user
        if (user && user.id) {
          fetchPromises.push(
            domoRequest('GET', `/domo/appdb/v1/collections/Intake_Headers/documents?q=content.userId:${user.id}`)
          );
        }

        const [formsRes, questionsRes, submissionsRes] = await Promise.all(fetchPromises);
        
        // Handle Forms
        if (formsRes && formsRes.length > 0) {
          setForms(formsRes.map(doc => ({ ...doc.content, appdbId: doc.id })));
        } else {
          setForms([{ id: 'default', name: 'Standard BA Intake', description: 'General intake for analysis requests.', isActive: true }]);
        }

        // Handle Questions
        if (questionsRes && questionsRes.length > 0) {
          const loadedQuestions = questionsRes.map(doc => ({
            ...doc.content,
            appdbId: doc.id
          }));
          setQuestions(loadedQuestions);
        } else {
          const seeded = checklistSeed.map(q => ({ ...q, formId: 'default' }));
          setQuestions(seeded);
        }

        // Handle User Submissions
        if (submissionsRes && submissionsRes.length > 0) {
          setUserSubmissions(submissionsRes.map(doc => ({ ...doc.content, appdbId: doc.id })));
        }

      } catch (err) {
        console.error("Data fetch failed", err);
        setForms([{ id: 'default', name: 'Standard BA Intake', isActive: true }]);
        setQuestions(checklistSeed.map(q => ({ ...q, formId: 'default' })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectForm = (formId) => {
    setSelectedFormId(formId);
    setCurrentIntake({
      submissionId: `sub-${Date.now()}`,
      formId: formId,
      answers: {},
      descriptions: {},
      signOff: { name: '', timestamp: null },
      status: 'Draft',
      currentStep: 0
    });
  };

  const loadSubmission = async (submissionId, formId) => {
    setLoading(true);
    setSelectedFormId(formId);
    try {
      const answersRes = await domoRequest('GET', `/domo/appdb/v1/collections/Intake_Answers/documents?q=content.submissionId:${submissionId}`);
      
      const loadedAnswers = {};
      const loadedDescriptions = {};
      if (answersRes) {
        answersRes.forEach(doc => {
          loadedAnswers[doc.content.questionId] = doc.content.answerValue;
          loadedDescriptions[doc.content.questionId] = doc.content.description || '';
        });
      }

      const header = userSubmissions.find(s => s.id === submissionId);

      setCurrentIntake({
        submissionId: submissionId,
        formId: formId,
        answers: loadedAnswers,
        descriptions: loadedDescriptions,
        signOff: { name: header?.baName || '', timestamp: header?.timestamp || null },
        status: header?.status || 'Draft',
        currentStep: 0,
        isEditing: true // flag to indicate we are updating
      });

    } catch (e) {
      console.error("Failed to load submission", e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered questions based on selection
  const filteredQuestions = questions
    .filter(q => q.formId === selectedFormId && q.isActive)
    .sort((a, b) => (a.orderIdx || 0) - (b.orderIdx || 0));

  // Questions CRUD - Sync with AppDB
  const addQuestion = async (q) => {
    const newId = q.id || `q-${Date.now()}`;
    const newQuestion = { 
      ...q, 
      id: newId, 
      formId: selectedFormId,
      version: 1, 
      isActive: true, 
      adminNote: q.adminNote || '', 
      isRequired: q.isRequired || false, 
      options: q.options || [], 
      orderIdx: questions.filter(curr => curr.formId === selectedFormId).length 
    };

    setQuestions(prev => [...prev, newQuestion]);
    await domoRequest('POST', '/domo/appdb/v1/collections/Config_Questions/documents', { content: newQuestion });
  };

  const batchAddQuestions = async (newQuestions) => {
    const toAdd = newQuestions.map((q, idx) => ({
        ...q,
        id: `q-csv-${Date.now()}-${idx}`,
        formId: selectedFormId,
        version: 1,
        isActive: true,
        isRequired: q.isRequired || false,
        options: q.options || [],
        orderIdx: questions.filter(curr => curr.formId === selectedFormId).length + idx
      }));
    
    setQuestions(prev => [...prev, ...toAdd]);
    for (const q of toAdd) {
      await domoRequest('POST', '/domo/appdb/v1/collections/Config_Questions/documents', { content: q });
    }
  };

  const updateQuestion = async (id, updatedFields) => {
    const current = questions.find(q => q.id === id && q.isActive);
    if (!current) return;
    
    const newVersion = {
      ...current,
      ...updatedFields,
      version: current.version + 1,
      isActive: true
    };
    
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isActive: false } : q).concat(newVersion));
    await domoRequest('POST', '/domo/appdb/v1/collections/Config_Questions/documents', { content: newVersion });
  };

  const deleteQuestion = async (id) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, isActive: false } : q));
    const docs = await domoRequest('GET', `/domo/appdb/v1/collections/Config_Questions/documents?q=content.id:${id}`);
    if (docs) {
      for (const doc of docs) {
        await domoRequest('PUT', `/domo/appdb/v1/collections/Config_Questions/documents/${doc.id}`, { 
          content: { ...doc.content, isActive: false } 
        });
      }
    }
  };

  const updateQuestionsOrder = async (orderedIds) => {
    const updated = questions.map(q => {
      const newOrder = orderedIds.indexOf(q.id);
      return newOrder !== -1 ? { ...q, orderIdx: newOrder } : q;
    });

    setQuestions(updated);
    for (const q of updated) {
      if (q.appdbId && orderedIds.includes(q.id)) {
        await domoRequest('PUT', `/domo/appdb/v1/collections/Config_Questions/documents/${q.appdbId}`, { content: q });
      }
    }
  };

  const updateAnswer = (questionId, value) => {
    setCurrentIntake(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const updateDescription = (questionId, value) => {
    setCurrentIntake(prev => ({
      ...prev,
      descriptions: { ...prev.descriptions, [questionId]: value }
    }));
  };

  const performSignOff = async (name) => {
    const timestamp = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
    
    const headerRecord = {
      id: currentIntake.submissionId,
      formId: selectedFormId,
      userId: currentUser ? currentUser.id : 'unknown',
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
        answerValue: currentIntake.answers[qId],
        description: currentIntake.descriptions[qId] || ''
      };
    });

    try {
      if (currentIntake.isEditing) {
        // Need to fetch existing header and answers document IDs to PUT them instead of POST
        // For brevity and simplicity in AppDB without ID tracking in state, we can delete old and create new.
        // Or properly query and update. Let's do query and update for header.
        const headerDocs = await domoRequest('GET', `/domo/appdb/v1/collections/Intake_Headers/documents?q=content.id:${currentIntake.submissionId}`);
        if (headerDocs && headerDocs.length > 0) {
          await domoRequest('PUT', `/domo/appdb/v1/collections/Intake_Headers/documents/${headerDocs[0].id}`, { content: headerRecord });
        } else {
          await domoRequest('POST', '/domo/appdb/v1/collections/Intake_Headers/documents', { content: headerRecord });
        }

        // For answers, it's easier to delete old ones and insert new ones or query each.
        // Let's delete old answers for this submission.
        const oldAnswers = await domoRequest('GET', `/domo/appdb/v1/collections/Intake_Answers/documents?q=content.submissionId:${currentIntake.submissionId}`);
        if (oldAnswers) {
           for (const oldAns of oldAnswers) {
             await domoRequest('DELETE', `/domo/appdb/v1/collections/Intake_Answers/documents/${oldAns.id}`);
           }
        }
        for (const ans of answerRecords) {
          await domoRequest('POST', '/domo/appdb/v1/collections/Intake_Answers/documents', { content: ans });
        }

      } else {
        await domoRequest('POST', '/domo/appdb/v1/collections/Intake_Headers/documents', { content: headerRecord });
        for (const ans of answerRecords) {
          await domoRequest('POST', '/domo/appdb/v1/collections/Intake_Answers/documents', { content: ans });
        }
      }

      setCurrentIntake(prev => ({
        ...prev,
        signOff: { name, timestamp },
        status: 'Completed',
        isEditing: true
      }));

      // Refresh submissions
      if (currentUser) {
        const submissionsRes = await domoRequest('GET', `/domo/appdb/v1/collections/Intake_Headers/documents?q=content.userId:${currentUser.id}`);
        if (submissionsRes) {
          setUserSubmissions(submissionsRes.map(doc => ({ ...doc.content, appdbId: doc.id })));
        }
      }

    } catch (err) {
      alert("Failed to save to Domo.");
    }
  };

  return (
    <IntakeContext.Provider value={{ 
      currentIntake, 
      questions: filteredQuestions, 
      allQuestions: questions,
      forms,
      selectedFormId,
      currentUser,
      userSubmissions,
      loadSubmission,
      selectForm,
      addQuestion,
      batchAddQuestions,
      updateQuestion,
      deleteQuestion,
      updateQuestionsOrder,
      updateAnswer, 
      updateDescription,
      performSignOff,
      setCurrentIntake
    }}>
      {children}
    </IntakeContext.Provider>
  );
};
