import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


/**
 * 
 * User Profile Page
 * Display authenticated user's profile with courses
 * Cache to reduce API calls
 */


// cache key for user profile data in localstorage
const CACHE_KEY = 'userProfileCache';

const UserProfile = () => {
    // state for user profile data  
    const [userProfile, setUserProfile] = useState(null);
    // state for loading status
    const [loading, setLoading] = useState(true);
    // state for error message
    const [error, setError] = useState(null);
    // navigate to other pages
    const navigate = useNavigate();

    const clearCache = () => {
        localStorage.removeItem(CACHE_KEY);
    }

    /**
     * 
     * Fetch user profile from server
     * Cache response to reduce API calls
     * Cache strategy based on timestamp
     * 
     */

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const response = await fetch('http://localhost:3000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                
                // Cache the response
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));

                setUserProfile(data);
            } catch (err) {
                if (err.message === 'Not authenticated') {
                    clearCache();
                    navigate('/login');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();

        return () => {
            clearCache();
        };
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {loading && (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {userProfile && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">My Profile</h1>
                        <div className="text-gray-600">
                            <p>{userProfile.email}</p>
                            <p className="text-sm">Member since: {new Date(userProfile.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">My Courses</h2>
                            {/** Button to create a new course */}
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Create New Course
                            </button>
                        </div>

                        {userProfile.courses?.length === 0 ? (
                            <p className="text-gray-600">No courses yet</p>
                            ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {userProfile.courses?.map((course) => (
                                <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                                    <p className="text-gray-600 mb-3">{course.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {course.weeks.length} weeks
                                        </span>
                                        <button
                                            onClick={() => navigate(`/course/${course._id}`)} 
                                            className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                                        >
                                            View Course
                                        </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;