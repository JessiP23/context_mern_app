import React, { useState } from 'react';

const CourseGenerator = () => {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulated delay for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          name: courseName,
          description: courseDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate course');
      }

      const data = await response.json();
      setCourseStructure(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">Course Generator</h2>
        
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
                <ul className="space-y-2 pl-5">
                  {week.topics.map((topic, topicIndex) => (
                    <li 
                      key={topicIndex} 
                      className="text-gray-700 list-disc"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGenerator;