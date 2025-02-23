import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import AdminPanel from './pages/AdminPanel';
import CompanySetup from './pages/company/CompanySetup';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanySettings from './pages/company/CompanySettings';
import IdeaHub from './pages/IdeaHub';
import Community from './pages/Community';
import Messages from './pages/Messages';
import Layout from './Layout';
import GoogleCallback from './pages/auth/GoogleCallback';
import CofounderBot from './pages/idea-hub/CofounderBot';
import IdeaRefinement from './pages/idea-hub/IdeaRefinement';
import MarketValidation from './pages/idea-hub/MarketValidation';
import BusinessModel from './pages/idea-hub/BusinessModel';
import PitchDeck from './pages/idea-hub/PitchDeck';
import AIDiscussion from './pages/idea-hub/AIDiscussion';
import IdeaCanvas from './pages/idea-hub/IdeaCanvas';
import MarketResearch from './pages/idea-hub/MarketResearch';
import TaskCreate from './pages/tasks/create';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="directory" element={<Directory />} />
          <Route path="messages" element={<Messages />} />
          <Route path="community" element={<Community />} />
          <Route path="idea-hub" element={<IdeaHub />} />
          <Route path="idea-hub/cofounder-bot" element={<CofounderBot />} />
          <Route path="idea-hub/refinement" element={<IdeaRefinement />} />
          <Route path="idea-hub/market-validation" element={<MarketValidation />} />
          <Route path="idea-hub/business-model" element={<BusinessModel />} />
          <Route path="idea-hub/pitch-deck" element={<PitchDeck />} />
          <Route path="idea-hub/ai-discussion" element={<AIDiscussion />} />
          <Route path="idea-hub/canvas" element={<IdeaCanvas />} />
          <Route path="idea-hub/market-research" element={<MarketResearch />} />
          <Route path="tasks/create" element={<TaskCreate />} />
          <Route path="company">
            <Route path="setup" element={<CompanySetup />} />
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="settings" element={<CompanySettings />} />
          </Route>
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;