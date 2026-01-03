
import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import SocialPage from './pages/SocialPage';
import VideoPage from './pages/VideoPage';
import AdminPanel from './pages/AdminPanel';
import { telegram } from './services/telegram';

const ADMIN_ID = 6601027952;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const user = telegram.getUser();

  const handleAdminAccess = () => {
    if (user?.id === ADMIN_ID) {
      setActiveTab('admin');
    } else {
      telegram.showAlert("Access Denied: Administrative privileges required.");
    }
  };

  const renderPage = () => {
    // Check if the user is authorized for admin tab
    if (activeTab === 'admin') {
      if (user?.id === ADMIN_ID) {
        return <AdminPanel onBack={() => setActiveTab('home')} />;
      } else {
        return <Home onAdminClick={handleAdminAccess} />;
      }
    }

    switch (activeTab) {
      case 'home':
        return <Home onAdminClick={handleAdminAccess} />;
      case 'social':
        return <SocialPage />;
      case 'video':
        return <VideoPage />;
      default:
        return <Home onAdminClick={handleAdminAccess} />;
    }
  };

  return (
    <Layout activeTab={activeTab === 'admin' ? 'home' : activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
    </Layout>
  );
};

export default App;
