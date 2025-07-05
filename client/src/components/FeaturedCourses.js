    import React, { useEffect, useState } from 'react';
    import CourseCard from './CourseCard';
    import courseService from '../api/courses';
    import { Link } from 'react-router-dom';

    const FeaturedCourses = () => {
        const [courses, setCourses] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchCourses = async () => {
                try {
                    const data = await courseService.getAllCourses();
                    // For demonstration, mark some as bestseller/new
                    const featured = data.slice(0, 3).map((course, index) => ({
                        ...course,
                        isBestseller: index === 0,
                        isNew: index === 1,
                        rating: course.rating || (index === 0 ? 4.8 : index === 1 ? 5.0 : 4.5), // Placeholder ratings
                        numReviews: course.numReviews || (index === 0 ? 2145 : index === 1 ? 1836 : 932), // Placeholder reviews
                    }));
                    setCourses(featured);
                } catch (err) {
                    setError('Failed to fetch courses.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourses();
        }, []);

        if (loading) return <div className="text-center py-16">Loading featured courses...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/courses" className="px-6 py-3 border-2 border-green-700 text-green-700 rounded-lg font-bold hover:bg-green-700 hover:text-white transition">
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>
        );
    };

    export default FeaturedCourses;
    