    import React from 'react';
    import { Link } from 'react-router-dom';

    const HeroSection = () => {
        return (
            <section className="gradient-bg text-white py-16 md:py-24">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Advance Your Career With LearnEase</h1>
                        <p className="text-xl mb-6">Join thousands of learners worldwide and gain new skills with our expert-led courses.</p>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                            <Link to="/courses" className="px-6 py-3 bg-white text-gray-800 rounded-lg font-bold hover:bg-gray-200 transition text-center">
                                Explore Courses
                            </Link>
                            <Link to="/register?role=instructor" className="px-6 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition text-center">
                                Become an Instructor
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <img src="https://media.licdn.com/dms/image/v2/D4E12AQFICz88a7e4gg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1676455072644?e=2147483647&v=beta&t=hqVRhewCXhIldiFkm-iUaxWMD3-pB7U3PMQM5Z-2eFA" alt="Diverse group of students learning online with laptops and tablets in a bright, modern educational environment" className="rounded-lg shadow-xl"></img>
                    </div>
                </div>
            </section>
        );
    };

    export default HeroSection;
    