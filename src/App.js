// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import CourseGenerator from './components/MyApp';
import CourseList from './components/CourseList';
import UserCourses from './components/UserCourses';
import CourseDetail from './components/CourseDetails';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between">
          <h1 className="text-xl font-bold">Course Generator App</h1>
          {token ? (
            <button onClick={logout} className="text-red-500">Logout</button>
          ) : null}
        </nav>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/courses" /> : <Auth setToken={saveToken} />} />
          <Route path="/generate" element={token ? <CourseGenerator /> : <Navigate to="/" />} />
          <Route path="/courses" element={token ? <UserCourses token={token} /> : <Navigate to="/" />} />
          <Route path="/courses/:id" element={token ? <CourseDetail token={token} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;