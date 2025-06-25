
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; // Import HomePage
import DashboardPage from './pages/DashboardPage';
import TalentProfilePage from './pages/TalentProfilePage';
import SuccessionPlanningPage from './pages/SuccessionPlanningPage';
import LeadershipDevelopmentPage from './pages/LeadershipDevelopmentPage';
import WorkforcePlanningPage from './pages/WorkforcePlanningPage';
import { BRAND_INFO } from './constants';

const App: React.FC = () => {
  // Set favicon dynamically from brand info
  React.useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = BRAND_INFO.logo.favicon;
    }
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage at root */}
        <Route path="/dashboard" element={<DashboardPage />} /> {/* Dashboard at /dashboard */}
        <Route path="/talent-profiles" element={<TalentProfilePage />} />
        <Route path="/succession-planning" element={<SuccessionPlanningPage />} />
        <Route path="/leadership-development" element={<LeadershipDevelopmentPage />} />
        <Route path="/workforce-planning" element={<WorkforcePlanningPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
