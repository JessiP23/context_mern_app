// src/components/UserCourses.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserCourses = ({ token }) => {
  const [courses, setCourses] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get('http://localhost:3000/api/user', { // Implement /api/user to get user info
          headers: { Authorization: `Bearer ${token}` }
        });
        const userCourses = userRes.data.courses;

        setCourses(userCourses);

        // Fetch progress for each course
        const progressPromises = userCourses.map(course =>
          axios.get(`http://localhost:3000/api/progress/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

        const progressResponses = await Promise.all(progressPromises);
        const progressMap = {};
        progressResponses.forEach(res => {
          progressMap[res.data.courseId._id] = res.data.weekProgress;
        });
        setProgressData(progressMap);
      } catch (err) {
        setError('Failed to fetch user courses or progress');
      }
    };

    fetchUserCourses();
  }, [token]);

  const toggleComplete = async (courseId, weekId, currentStatus) => {
    try {
      const res = await axios.put('http://localhost:3000/api/progress/update', {
        courseId,
        weekId,
        completed: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setProgressData(prev => ({
        ...prev,
        [courseId]: prev[courseId].map(week =>
          week.weekId === weekId ? { ...week, completed: !currentStatus } : week
        )
      }));
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {courses.map(course => (
        <div key={course._id} className="mb-6">
          <h3 className="text-xl font-semibold">{course.name}</h3>
          <p>{course.description}</p>
          <div className="mt-4">
            {progressData[course._id]?.length ? (
              <ul className="space-y-2">
                {progressData[course._id].map(week => (
                  <li key={week.weekId} className="flex items-center justify-between p-2 border rounded">
                    <span>
                      Week: {week.weekId.title} {/* Adjust based on actual data structure */}
                    </span>
                    <button
                      onClick={() => toggleComplete(course._id, week.weekId, week.completed)}
                      className={`px-3 py-1 rounded ${
                        week.completed ? 'bg-green-500 text-white' : 'bg-gray-300'
                      }`}
                    >
                      {week.completed ? 'Completed' : 'Mark as Complete'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p>No progress data available.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCourses;