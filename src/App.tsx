import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Onboarding from './components/auth/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import ViralContent from './components/viral-content/ViralContent';
import ShortsAnalytics from './components/analytics/ShortsAnalytics';
import AdvancedSearch from './components/search/AdvancedSearch';
import CompetitorFinder from './components/competitor/CompetitorFinder';
import ScriptAnalyzer from './components/script-tools/ScriptAnalyzer';
import ScriptRewriter from './components/script-tools/ScriptRewriter';
import ManualPosting from './components/posting/ManualPosting';
import Profile from './components/profile/Profile';
import Billing from './components/billing/Billing';
import MainLayout from './components/layout/MainLayout';
import AnimatedParticles from './components/AnimatedParticles';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const user = localStorage.getItem('user');
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    
    if (user) {
      setIsAuthenticated(true);
      setNeedsOnboarding(!onboardingComplete);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    setNeedsOnboarding(!onboardingComplete);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setNeedsOnboarding(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setNeedsOnboarding(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Animated Background Orbs */}
      <div className="bg-animated-orbs"></div>
      
      {/* Subtle Animated Particles */}
      <AnimatedParticles />
      
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Signup onSignup={handleLogin} /> : <Navigate to="/" />} 
          />

          {/* Onboarding */}
          <Route 
            path="/onboarding" 
            element={
              isAuthenticated && needsOnboarding ? (
                <Onboarding onComplete={handleOnboardingComplete} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated && !needsOnboarding ? (
                <MainLayout onLogout={handleLogout} />
              ) : (
                <Navigate to={needsOnboarding ? "/onboarding" : "/login"} />
              )
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="viral-content" element={<ViralContent />} />
            <Route path="shorts-analytics" element={<ShortsAnalytics />} />
            <Route path="advanced-search" element={<AdvancedSearch />} />
            <Route path="competitor-finder" element={<CompetitorFinder />} />
            <Route path="script-analyzer" element={<ScriptAnalyzer />} />
            <Route path="script-rewriter" element={<ScriptRewriter />} />
            <Route path="manual-posting" element={<ManualPosting />} />
            <Route path="profile" element={<Profile />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;