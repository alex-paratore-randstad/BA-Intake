import React, { useState } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './views/Dashboard/Dashboard';
import IntakeForm from './views/IntakeForm/IntakeForm';
import AdminPanel from './views/AdminPanel/AdminPanel';

function App() {
  const [view, setView] = useState('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'intake':
        return <IntakeForm />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderView()}
    </Layout>
  );
}

export default App;
