
import React, { useState, useEffect } from 'react';
import { User, UserRole, Job } from './types';
import { MockDb } from './services/mockDb';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import Assessment from './pages/Assessment';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import ReportPage from './pages/ReportPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(MockDb.getCurrentUser());
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);

  useEffect(() => {
    const user = MockDb.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    MockDb.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const navigate = (page: string, params?: any) => {
    if (params?.jobId) setActiveJobId(params.jobId);
    if (params?.appId) setActiveAppId(params.appId);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage onNavigate={navigate} />;
      case 'login': return <LoginPage onNavigate={navigate} onLogin={setCurrentUser} />;
      case 'register': return <RegisterPage onNavigate={navigate} />;
      case 'dashboard': return <Dashboard user={currentUser} onNavigate={navigate} />;
      case 'create-job': return <CreateJob user={currentUser} onNavigate={navigate} editJobId={activeJobId} />;
      case 'assessment': return <Assessment user={currentUser} jobId={activeJobId!} onNavigate={navigate} />;
      case 'leaderboard': return <Leaderboard onNavigate={navigate} />;
      case 'profile': return <Profile user={currentUser} onNavigate={navigate} />;
      case 'report': return <ReportPage user={currentUser} appId={activeAppId!} onNavigate={navigate} />;
      default: return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 transition-colors duration-300">
      <Navbar user={currentUser} onLogout={handleLogout} onNavigate={navigate} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <footer className="bg-slate-900 text-white py-8 text-center border-t border-slate-800">
        <p className="text-sm">© 2024 AssessPro - An Intelligent Skill-Centric Hiring Assessment Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
