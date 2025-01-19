import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


/**
 * Couser Generator App
 * MERN stack
 * 
 * Takes course name and description to display an AI-generated course structure on the topic specified by the user
 * Communicate with the backend to generate and save courses
 * 
 * 
 * @see React Hooks: https://react.dev/reference/react
 * @see React Forms: https://react.dev/reference/react-dom/components#form-components
 * @see Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * @see Fetch API: https://www.freecodecamp.org/news/fetch-data-react/
 * @see Tailwind CSS: https://tailwindcss.com/docs
 * 
 */


const CourseGenerator = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedCourse, setSavedCourse] = useState([]);

  // hook for navigation
  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Delay for loading state
    // await new Promise(resolve => setTimeout(resolve, 2000));

    try {

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('http://localhost:3000/api/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: courseName,
          description: courseDescription,
        }),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate course');
      }

      const data = await response.json();
      console.log('Received data:', data);

      // update state with generated course structure
      setCourseStructure(data.course);
      setSavedCourse(data.course)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // add course to user profile
  const handleAddToProfile = async () => {
    if (!savedCourse) return;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('http://localhost:3000/api/courses/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: savedCourse._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add course to profile');
      }
      
      // Show success message or redirect to profile
      alert('Course added to your profile successfully!');
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">Course Generator</h2>
        <button
          onClick={() => navigate('/profile')}
          className="ml-4 px-4 py-2 m-8 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Go to My Profile
        </button>

        {/** Form for generating a course */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
            />
          </div>
          
          <div>
            <textarea
              placeholder="Course Description"
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black h-32 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full px-4 py-2 rounded-md text-white font-medium
              ${loading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800'}
              transition-colors duration-200
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate Course'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {courseStructure && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Generated Course Structure</h2>

          <button
              onClick={handleAddToProfile}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Add to My Profile
            </button>
          
          <div className="space-y-6">
            {courseStructure.weeks.map((week, index) => (
              <div 
                key={index} 
                className={`pb-6 ${
                  index !== courseStructure.weeks.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <h3 className="font-bold text-lg mb-3">
                  Week {index + 1}: {week.title}
                </h3>
                <p className="text-gray-600 mb-4">{week.description}</p>
                <div className="space-y-4">
                  {week.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="ml-5">
                      <h4 className="font-semibold mb-2">{topic.title}</h4>
                      <p className="text-gray-600 mb-2">{topic.description}</p>
                      <div className="ml-4">
                        <h5 className="font-medium text-sm text-gray-700 mb-1">Learning Objectives:</h5>
                        <ul className="list-disc ml-5 text-sm text-gray-600">
                          {topic.learningObjectives?.map((objective, objIndex) => (
                            <li key={objIndex}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGenerator;