    import React, { useEffect, useState } from 'react';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';
    import CourseCard from '../components/CourseCard';
    import courseService from '../api/courses';

    const AllCoursesPage = () => {
        const [courses, setCourses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchCourses = async () => {
                try {
                    setLoading(true);
                    const data = await courseService.getAllCourses();
                    setCourses(data);
                } catch (err) {
                    setError('Failed to fetch courses.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourses();
        }, []);

        if (loading) return <div className="text-center py-16">Loading all courses...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

        return (
            <>
                <Navbar />
                <section className="py-16 bg-gray-100 min-h-screen">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">All Courses</h2>
                        {courses.length === 0 ? (
                            <p className="text-center text-gray-600">No courses available yet. Check back later!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
                <Footer />
            </>
        );
    };

    export default AllCoursesPage;
    