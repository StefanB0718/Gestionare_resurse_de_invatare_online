import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Courses from './components/Courses';
import Resources from './components/Resources';

function App() {
  // check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // protect routes that need login
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:courseId" 
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;