// src/components/CourseDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseDetail = ({ token, courseId }) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const courseRes = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseRes.data);

        const progressRes = await axios.get(`/api/progress/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(progressRes.data.weekProgress);
      } catch (err) {
        setError('Failed to fetch course details or progress');
      }
    };

    fetchCourseDetail();
  }, [token, courseId]);

  if (error) return <div className="text-red-500">{error}</div>;
    if (!course) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{course.name}</h2>
      <p className="mb-6">{course.description}</p>
      
      <h3 className="text-2xl font-semibold mb-2">Course Structure</h3>
      <ul className="space-y-4">
        {course.weeks.map((week, index) => {
          const weekProgress = progress.find(w => w.weekId.toString() === week._id.toString());
          return (
            <li key={week._id} className="border p-4 rounded">
              <h4 className="text-xl font-semibold">Week {index + 1}: {week.title}</h4>
              <p>{week.description}</p>
              <h5 className="mt-2 font-medium">Topics:</h5>
              <ul className="list-disc list-inside">
                {week.topics.map(topic => (
                  <li key={topic._id}>{topic.title} - {topic.learningObjectives.join(', ')}</li>
                ))}
              </ul>
              <button
                onClick={() => toggleComplete(course._id, week._id, weekProgress.completed)}
                className={`mt-4 px-4 py-2 rounded ${
                  weekProgress.completed ? 'bg-green-500 text-white' : 'bg-gray-300'
                }`}
              >
                {weekProgress.completed ? 'Completed' : 'Mark as Complete'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CourseDetail;