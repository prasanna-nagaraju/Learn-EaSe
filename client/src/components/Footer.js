    import React from 'react';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { Link } from 'react-router-dom';

    const Footer = () => {
        return (
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">LearnEase</h3>
                            <p className="text-gray-400">Advance your career with expert-led online courses.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">For Students</h4>
                            <ul className="space-y-2">
                                <li><Link to="/courses" className="text-gray-400 hover:text-white transition">Browse Courses</Link></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                                <li><Link to="/register" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">For Instructors</h4>
                            <ul className="space-y-2">
                                <li><Link to="/register?role=instructor" className="text-gray-400 hover:text-white transition">Become an Instructor</Link></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Teacher Resources</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 mb-4 md:mb-0">
                            &copy; 2025 LearnEase. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    };

    export default Footer;
    