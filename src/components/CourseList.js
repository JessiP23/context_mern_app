// src/components/CourseList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseList = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/api/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, []);

  const handleSelect = async () => {
    if (!selected) return;
    try {
      const res = await axios.post('http://localhost:3000/api/courses/select', { courseId: selected }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to select course');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}
      <ul className="space-y-2">
        {courses.map(course => (
          <li key={course._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{course.name}</h3>
            <p>{course.description}</p>
            <button
              onClick={() => setSelected(course._id)}
              className={`mt-2 px-4 py-2 rounded ${
                selected === course._id ? 'bg-gray-700 text-white' : 'bg-black text-white'
              }`}
            >
              {selected === course._id ? 'Selected' : 'Select Course'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;