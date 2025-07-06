    import React, { useEffect, useState } from 'react';
    import { useParams, Link, useNavigate } from 'react-router-dom';
    import courseService from '../api/courses';
    import userService from '../api/user';
    import { useAuth } from '../context/AuthContext';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';
    import { loadStripe } from '@stripe/stripe-js';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';



    // Make sure to call `loadStripe` outside of a component’s render to avoid
    // recreating the Stripe object on every render
    // 
    const stripePromise = loadStripe('pk_test_51RgtX4R7oZsjTrQPu7TMkXp0jIWiDJOxTVDp8VnSkCYzNSBjwX4OH1ZiizSL1ss1dm1yUEwDYPuVA7pc0yVSJRhI00e5KyG7hG'); // your publishable key

    const CourseDetailPage = () => {
        const stripe = useStripe();
        const elements = useElements();
        const { id } = useParams();
        const navigate = useNavigate();
        const { user } = useAuth();

        const [course, setCourse] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [isEnrolled, setIsEnrolled] = useState(false);
        const [enrollmentId, setEnrollmentId] = useState(null);

        useEffect(() => {
            const fetchCourse = async () => {
                try {
                    setLoading(true);
                    const courseData = await courseService.getCourseById(id);
                    setCourse(courseData);

                    if (user && user.role === 'student') {
                        const dashboard = await userService.getLearningDashboard();
                        const enrolled = dashboard.some(e => e.course._id === id);
                        setIsEnrolled(enrolled);
                        if (enrolled) {
                            setEnrollmentId(dashboard.find(e => e.course._id === id)._id);
                        }
                    }
                } catch (err) {
                    setError('Failed to load course.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }, [id, user]);

        const handleEnroll = async () => {
        if (!user) {
            alert('Please sign in to enroll in a course.');
            navigate('/login');
            return;
        }
        if (user.role !== 'student') {
            alert('Only students can enroll in courses.');
            return;
        }
        if (isEnrolled) {
            alert('You are already enrolled in this course!');
            return;
        }

        if (!stripe || !elements) {
            alert('Stripe is not loaded yet. Please wait.');
            return;
        }

        try {
            // 1. Create PaymentIntent from backend
            const { clientSecret } = await userService.createPaymentIntent(course._id);

            // 2. Confirm payment on client
            const cardElement = elements.getElement(CardElement);

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
            });

            if (error) {
            console.error(error);
            alert(error.message);
            return;
            }

            if (paymentIntent.status !== 'succeeded') {
            alert('Payment not completed. Please try again.');
            return;
            }

            // 3. Notify backend to create enrollment
            const enrollmentResponse = await userService.confirmEnrollment(course._id, paymentIntent.id);

            alert('Enrollment successful!');
            setIsEnrolled(true);
            setEnrollmentId(enrollmentResponse.enrollment._id);
        } catch (err) {
            console.error('Enrollment error:', err);
            alert('Failed to enroll in course. Please try again.');
        }
    };


        if (loading) return <div className="text-center py-16">Loading course details...</div>;
        if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
        if (!course) return <div className="text-center py-16">Course not found.</div>;

        return (
            <>
                <Navbar />
                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <img src={course.thumbnail || "https://placehold.co/600x400"} alt={course.title} className="w-full h-64 object-cover md:h-full" />
                                </div>
                                <div className="md:w-1/2 p-8">
                                    <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                                    <p className="text-gray-700 text-lg mb-4">{course.description}</p>
                                    <p className="text-gray-600 text-sm mb-2">By <span className="font-semibold">{course.instructor?.name || 'Unknown'}</span></p>
                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={course.rating >= i + 1 ? "fas fa-star" : course.rating >= i + 0.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm ml-2">{course.rating.toFixed(1)} ({course.numReviews} reviews)</span>
                                    </div>
                                    <p className="text-3xl font-bold text-green-700 mb-6">${course.price.toFixed(2)}</p>

                                    {isEnrolled ? (
                                        <Link
                                            to={`/courses/${course._id}/lesson/${course.videos[0]?._id}`}
                                            className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                        >
                                            Continue Learning
                                        </Link>
                                    ) : (
                                        <>
                                        <div className="mb-4">
                                <           CardElement options={{ hidePostalCode: true }} />
                                        </div>

                                        <button
                                            onClick={handleEnroll}
                                            className="w-full px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition"
                                        >
                                            Enroll Now
                                        </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>
                            {course.videos.length === 0 ? (
                                <p className="text-gray-600">No lessons available for this course yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {course.videos.map((video, index) => (
                                        <li key={video._id} className="flex items-center p-4 border rounded-lg bg-gray-50">
                                            <span className="text-green-700 font-bold mr-4">{index + 1}.</span>
                                            <div>
                                                <h3 className="text-xl font-semibold">{video.title}</h3>
                                                <p className="text-gray-600 text-sm">{video.duration ? `${video.duration} min` : 'Duration N/A'}</p>
                                            </div>
                                            {isEnrolled && (
                                                <Link
                                                    to={`/courses/${course._id}/lesson/${video._id}`}
                                                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                                >
                                                    Watch
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Add a section for reviews if you implement them */}
                    </div>
                </section>
                <Footer />
            </>
        );
    };

    export default CourseDetailPage;
    