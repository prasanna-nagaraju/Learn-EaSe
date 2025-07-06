    import React, { useEffect, useState } from 'react';
    import userService from '../api/user';
    import courseService from '../api/courses';
    import { useAuth } from '../context/AuthContext';
    import { Link } from 'react-router-dom';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const InstructorDashboard = () => {
        const { user } = useAuth();
        const [stats, setStats] = useState(null);
        const [myCourses, setMyCourses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
        const fetchInstructorData = async () => {
            if (user && user.role === 'instructor') {
            try {
                setLoading(true);
                console.log("Fetching instructor dashboard...");
                const dashboardStats = await userService.getInstructorDashboard();
                console.log("Dashboard stats:", dashboardStats);

                const coursesData = await courseService.getMyCourses();
                console.log("My courses:", coursesData);

                setStats(dashboardStats);
                setMyCourses(coursesData);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to fetch instructor dashboard data.');
            } finally {
                setLoading(false);
            }
            } else {
            console.warn("User not logged in or not instructor");
            setLoading(false);
            setError('You must be logged in as an instructor to view this dashboard.');
            }
        };
        fetchInstructorData();
        }, [user]);


        if (loading) return <div className="text-center py-16">Loading instructor dashboard...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
        if (!user || user.role !== 'instructor') return <div className="text-center py-16">Access Denied.</div>;

        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Instructor Dashboard</h2>
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between">
                            <div className="md:w-1/2 mb-6 md:mb-0">
                                <h3 className="text-xl font-bold mb-4">Course Statistics</h3>
                                {stats ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded shadow">
                                            <div className="text-green-700 text-2xl mb-2">{stats.totalCourses}</div>
                                            <div className="text-gray-600">Courses</div>
                                        </div>
                                        <div className="bg-white p-4 rounded shadow">
                                            <div className="text-green-700 text-2xl mb-2">{stats.totalStudents}</div>
                                            <div className="text-gray-600">Students</div>
                                        </div>
                                        <div className="bg-white p-4 rounded shadow">
                                            <div className="text-green-700 text-2xl mb-2">{stats.avgRating}</div>
                                            <div className="text-gray-600">Avg Rating</div>
                                        </div>
                                        <div className="bg-white p-4 rounded shadow">
                                            <div className="text-green-700 text-2xl mb-2">${stats.totalEarnings}</div>
                                            <div className="text-gray-600">Earnings</div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No statistics available yet.</p>
                                )}
                            </div>
                            <div className="md:w-1/2 md:pl-8">
                                <h3 className="text-xl font-bold mb-4">Create New Course</h3>
                                <div className="bg-white p-4 rounded shadow">
                                    <Link to="/instructor/create-course" className="w-full py-3 border-2 border-dashed border-gray-300 rounded hover:border-green-700 hover:text-green-700 transition flex flex-col items-center justify-center">
                                        <i className="fas fa-plus text-3xl mb-2"></i>
                                        <span>Start Course Creation</span>
                                    </Link>
                                </div>
                                <div className="mt-4 bg-white p-4 rounded shadow">
                                    <h4 className="font-bold mb-3">Quick Actions</h4>
                                    <div className="space-y-3">
                                        <button className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
                                            View Analytics (Coming Soon)
                                        </button>
                                        <Link to="/instructor/manage-courses" className="w-full px-4 py-2 bg-white border border-green-700 text-green-700 rounded hover:bg-green-50 transition text-center">
                                            Manage Courses
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h3 className="text-2xl font-bold mb-6">My Courses</h3>
                            {myCourses.length === 0 ? (
                                <p className="text-center text-gray-600">You haven't created any courses yet. Click "Start Course Creation" to add your first course!</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myCourses.map(course => (
                                        <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                            <img src={course.thumbnail || "https://placehold.co/400x250"} alt={course.title} className="w-full h-40 object-cover" />
                                            <div className="p-4">
                                                <h4 className="font-bold text-lg mb-1">{course.title}</h4>
                                                <p className="text-sm text-gray-600 mb-2">Status: {course.isPublished ? 'Published' : 'Draft'}</p>
                                                <p className="text-sm text-gray-600 mb-2">Price: ${course.price}</p>
                                                <div className="flex justify-between items-center mt-3">
                                                    <Link to={`/instructor/edit-course/${course._id}`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                                                    <button onClick={() => alert(`Delete course: ${course.title}`)} className="text-red-600 hover:underline text-sm">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    export default InstructorDashboard;
    