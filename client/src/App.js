import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Signup from './components/Signup';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Parse JWT token correctly - JWT has 3 parts separated by dots
        const parts = token.split('.');
        if (parts.length === 3) {
          // Decode the payload (second part)
          const payload = JSON.parse(atob(parts[1]));
          console.log('Token payload:', payload);
          
          const role = payload.role;
          if (role === 'employee') {
            console.log('Navigating to employee dashboard');
            navigate('/employee');
          } else if (role === 'admin') {
            console.log('Navigating to admin dashboard');
            navigate('/admin');
          }
        } else {
          console.error('Invalid token format');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error.message);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;