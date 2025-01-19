import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


/**
 * 
 * Displays information about a course.
 * Fetches course data from the backend API using the course ID.
 * 
 * 
 */

const CourseView = () => {
    // state for course data
    const [course, setCourse] = useState(null);
    // state for loading status
    const [loading, setLoading] = useState(true);
    // state for error message
    const [error, setError] = useState(null);
    // get course ID from URL params
    const { courseId } = useParams();
    // navigate to other pages
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch course');
                }

                const data = await response.json();
                setCourse(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
            </div>
        </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{course.name}</h1>
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>
                
                <p className="text-gray-600 mb-8">{course.description}</p>

                <div className="space-y-8">
                {course.weeks.map((week, index) => (
                    <div key={week._id} className="border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Week {index + 1}: {week.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{week.description}</p>
                        
                        <div className="space-y-4">
                            {week.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium mb-2">{topic.title}</h3>
                                <p className="text-gray-600 mb-3">{topic.description}</p>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-700">Learning Objectives:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {topic.learningObjectives.map((objective, objIndex) => (
                                        <li key={objIndex} className="text-gray-600 text-sm">
                                            {objective}
                                        </li>
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
        </div>
    );
};

export default CourseView;