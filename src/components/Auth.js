import React, { useState } from 'react';
import axios from 'axios';


/**
 * 
 * Handles user authentication, including login and registration functionalities.
 * Manages form state with backend API for authentication processes. 
 * 
 */


const Auth = ({ setToken }) => {
  // state for login or register
  const [isLogin, setIsLogin] = useState(true);
  // state for form data
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  // state for error message
  const [error, setError] = useState('');

  // toggle between login and register
  const toggleMode = () => setIsLogin(!isLogin);

  // handle form input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // backend API endpoint for login or register
    const url = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/register';
    try {
      const response = await axios.post(url, form);
      if (isLogin) {
        setToken(response.data.token);
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={toggleMode} className="mt-4 text-blue-500">
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default Auth;