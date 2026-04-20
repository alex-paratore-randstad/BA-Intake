import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import IntakeForm from './views/IntakeForm/IntakeForm';
import AdminPanel from './views/AdminPanel/AdminPanel';

function App() {
  const [view, setView] = useState('intake');

  const renderView = () => {
    switch (view) {
      case 'intake':
        return <IntakeForm />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <IntakeForm />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderView()}
    </Layout>
  );
}

export default App;
