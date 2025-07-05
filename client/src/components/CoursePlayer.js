    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import courseService from '../api/courses';
    import userService from '../api/user';
    import { useAuth } from '../context/AuthContext';
    import Navbar from './Navbar';
    import Footer from './Footer';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const CoursePlayer = () => {
        const { courseId, lessonId } = useParams();
        const navigate = useNavigate();
        const { user } = useAuth();

        const [course, setCourse] = useState(null);
        const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
        const [enrollment, setEnrollment] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchCourseAndEnrollment = async () => {
                try {
                    setLoading(true);
                    const courseData = await courseService.getCourseById(courseId);
                    setCourse(courseData);

                    if (user) {
                        const dashboard = await userService.getLearningDashboard();
                        const currentEnrollment = dashboard.find(e => e.course._id === courseId);
                        setEnrollment(currentEnrollment);

                        if (currentEnrollment && lessonId) {
                            const initialLessonIndex = courseData.videos.findIndex(video => video._id === lessonId);
                            if (initialLessonIndex !== -1) {
                                setCurrentLessonIndex(initialLessonIndex);
                            }
                        }
                    }
                } catch (err) {
                    setError('Failed to load course or enrollment data.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchCourseAndEnrollment();
        }, [courseId, lessonId, user]);

        const handleNextLesson = async () => {
            if (currentLessonIndex < course.videos.length - 1) {
                const nextIndex = currentLessonIndex + 1;
                const nextLesson = course.videos[nextIndex];

                // Mark current lesson as completed
                if (enrollment && course.videos[currentLessonIndex]) {
                    try {
                        const updatedEnrollment = await userService.updateLessonProgress(
                            enrollment._id,
                            course.videos[currentLessonIndex].url, // Use URL as identifier
                            true
                        );
                        setEnrollment(updatedEnrollment);
                    } catch (err) {
                        console.error("Failed to update progress:", err);
                        // Optionally show a toast/alert
                    }
                }

                setCurrentLessonIndex(nextIndex);
                navigate(`/courses/${courseId}/lesson/${nextLesson._id}`);
            } else {
                alert("You've completed all lessons in this course!");
                // Optionally mark course as fully completed in enrollment
            }
        };

        const handleLessonClick = async (index) => {
            // Mark previously watched lesson as completed before switching
            if (enrollment && course.videos[currentLessonIndex]) {
                try {
                    const updatedEnrollment = await userService.updateLessonProgress(
                        enrollment._id,
                        course.videos[currentLessonIndex].url,
                        true
                    );
                    setEnrollment(updatedEnrollment);
                } catch (err) {
                    console.error("Failed to update progress on lesson switch:", err);
                }
            }
            setCurrentLessonIndex(index);
            navigate(`/courses/${courseId}/lesson/${course.videos[index]._id}`);
        };

        const currentLesson = course?.videos[currentLessonIndex];
        const progress = enrollment ? enrollment.progress : 0;

        if (loading) return <div className="text-center py-16">Loading course player...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
        if (!course) return <div className="text-center py-16">Course not found.</div>;
        if (!user || user.role !== 'student' || !enrollment) {
            return (
                <div className="text-center py-16">
                    <p>You must be enrolled as a student to view this course content.</p>
                    <Link to={`/courses/${courseId}`} className="text-green-700 hover:underline">Go to Course Page</Link>
                </div>
            );
        }

        return (
            <>
                <Navbar />
                <section className="py-8 bg-white min-h-screen">
                    <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
                        {/* Main Content Area (Video Player) */}
                        <div className="lg:w-3/4">
                            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
                            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 mb-6">
                                {currentLesson ? (
                                    <div className="video-container mb-4">
                                        <iframe
                                            src={currentLesson.url}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={currentLesson.title}
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="text-white text-center py-20">No lesson selected or available.</div>
                                )}
                                <div className="flex flex-col sm:flex-row justify-between items-center text-white px-4">
                                    <h3 className="text-xl mb-2 sm:mb-0">{currentLesson?.title || 'Select a Lesson'}</h3>
                                    {currentLessonIndex < course.videos.length - 1 && (
                                        <button
                                            onClick={handleNextLesson}
                                            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                                        >
                                            Next Lesson <i className="fas fa-arrow-right ml-2"></i>
                                        </button>
                                    )}
                                    {currentLessonIndex === course.videos.length - 1 && (
                                        <span className="px-4 py-2 bg-gray-600 text-white rounded">Course Completed!</span>
                                    )}
                                </div>
                            </div>

                            {/* Course Progress */}
                            <div className="mt-6 bg-gray-100 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span>Course Progress</span>
                                    <span>{progress.toFixed(0)}%</span>
                                </div>
                                <div className="progress-bar bg-gray-300 rounded-full">
                                    <div className="progress-bar bg-green-700 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>

                            {/* Course Description (Optional) */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                                <h3 className="text-2xl font-bold mb-4">About this Course</h3>
                                <p className="text-gray-700">{course.description}</p>
                            </div>
                        </div>

                        {/* Sidebar (Course Curriculum) */}
                        <div className="lg:w-1/4 bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold mb-4">Course Content</h3>
                            <ul className="space-y-3">
                                {course.videos.map((video, index) => (
                                    <li
                                        key={video._id}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center justify-between
                                            ${index === currentLessonIndex ? 'bg-green-100 text-green-800 font-semibold' : 'hover:bg-gray-100'}
                                            ${enrollment?.completedLessons.includes(video.url) ? 'text-gray-500 line-through' : ''}
                                        `}
                                        onClick={() => handleLessonClick(index)}
                                    >
                                        <span>{index + 1}. {video.title}</span>
                                        {enrollment?.completedLessons.includes(video.url) && (
                                            <i className="fas fa-check-circle text-green-500 ml-2"></i>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    };

    export default CoursePlayer;
    