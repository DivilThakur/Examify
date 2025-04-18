import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

import Auth from './components/Auth';
import Exam from './components/Exam';
import Results from './components/Results';
import CreateExam from './components/CreateExam';
import Profile from './components/Profile';

const AppContent = () => {
  const location = useLocation();


  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/exam/:id" element={<Exam />} />
          <Route path="/results" element={<Results />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
