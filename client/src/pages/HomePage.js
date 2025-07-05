    import React from 'react';
    import Navbar from '../components/Navbar';
    import HeroSection from '../components/HeroSection';
    import FeaturedCourses from '../components/FeaturedCourses';
    import WhyChooseUs from '../components/WhyChooseUs';
    import Testimonials from '../components/Testimonials';
    import Footer from '../components/Footer';
    import { Link } from 'react-router-dom';

    const HomePage = () => {
        return (
            <div className="bg-gray-100 font-sans leading-normal">
                <Navbar />
                <HeroSection />
                <FeaturedCourses />
                <WhyChooseUs />
                <Testimonials />

                {/* CTA Section */}
                <section className="gradient-bg text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
                        <p className="text-xl mb-8 mx-auto max-w-2xl">Join thousands of learners who have transformed their careers with our courses.</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <Link to="/courses" className="px-6 py-3 bg-white text-gray-800 rounded-lg font-bold hover:bg-gray-200 transition">
                                Browse Courses
                            </Link>
                            <Link to="/register" className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition">
                                Try for Free
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        );
    };

    export default HomePage;
    