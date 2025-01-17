// manage token state

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import CourseGenerator from './components/NewCourse';
import axios from 'axios';
import UserProfile from './components/Profile';
import CourseView from './components/CourseView';


/**
 * 
 * Routing for the app
 * 1. CourseGenerator: Page that generates a course
 * 2. CourseView: Page that displays a course
 * 3. UserProfile: Page that displays the user's profile and courses saved to the database
 * 
 * 
 * Save the token in localstorage and state
 * 
 * JWT token received from the server
 * 
 */

const App = () => {

  // manage the authentication token
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };


  // remove token from localstorage and reset the token state
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  // Set or remove the Authorization header globally for axios based on token presence
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex justify-between">
          <h1 className="text-xl font-bold">Course Generator App</h1>
          {token ? (
            <button onClick={logout} className="text-red-500">Logout</button>
          ) : null}
        </nav>

        {/** Routes for the app */}
        <Routes>
          <Route path="/" element={token ? <Navigate to="/generate" /> : <Auth setToken={saveToken} />} />
          <Route path="/generate" element={token ? <CourseGenerator /> : <Navigate to="/" />} />
          <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/" />} />
          <Route path="/course/:courseId" element={token ? <CourseView /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;