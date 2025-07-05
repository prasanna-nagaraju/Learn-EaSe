    import React, { useEffect, useState } from 'react';
    import userService from '../api/user';
    import { useAuth } from '../context/AuthContext';
    import { Link } from 'react-router-dom';

    const LearningDashboard = () => {
        const { user } = useAuth();
        const [enrollments, setEnrollments] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchDashboardData = async () => {
                if (user && user.role === 'student') {
                    try {
                        setLoading(true);
                        const data = await userService.getLearningDashboard();
                        setEnrollments(data);
                    } catch (err) {
                        setError('Failed to fetch learning dashboard data.');
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                    setError('You must be logged in as a student to view this dashboard.');
                }
            };
            fetchDashboardData();
        }, [user]);

        if (loading) return <div className="text-center py-16">Loading your dashboard...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
        if (!user || user.role !== 'student') return <div className="text-center py-16">Access Denied.</div>;

        return (
            <section className="py-16 bg-gradient-to-r from-gray-100 to-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Your Learning Dashboard</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">My Courses</h3>
                            {/* Optional: A general "Continue Learning" button that takes to the last active course */}
                            {enrollments.length > 0 && (
                                <Link to={`/courses/${enrollments[0].course._id}/lesson/${enrollments[0].course.videos[0]?._id}`}
                                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
                                    Continue Learning
                                </Link>
                            )}
                        </div>

                        {enrollments.length === 0 ? (
                            <p className="text-center text-gray-600">You haven't enrolled in any courses yet. <Link to="/courses" className="text-green-700 hover:underline">Browse courses</Link> to get started!</p>
                        ) : (
                            <div className="space-y-6">
                                {enrollments.map(enrollment => (
                                    <div key={enrollment._id} className="border p-4 rounded-lg bg-gray-50">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium">{enrollment.course.title}</span>
                                            <span className="text-gray-600">{enrollment.progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="progress-bar bg-gray-200">
                                            <div className="progress-bar bg-green-700" style={{ width: `${enrollment.progress}%` }}></div>
                                        </div>
                                        <div className="mt-4 text-right">
                                            <Link
                                                to={`/courses/${enrollment.course._id}/lesson/${enrollment.course.videos[0]?._id}`}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                                            >
                                                Go to Course
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    export default LearningDashboard;
    