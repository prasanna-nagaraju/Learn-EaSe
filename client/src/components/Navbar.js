    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const Navbar = () => {
        const { user, logout } = useAuth();
        const navigate = useNavigate();
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

        const handleLogout = () => {
            logout();
            navigate('/');
        };

        return (
            <nav className="gradient-bg text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-book-open text-2xl"></i>
                        <Link to="/" className="text-xl font-bold">LearnEase</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/courses" className="hover:text-gray-300">Browse Courses</Link>
                        {user && user.role === 'instructor' && (
                            <Link to="/instructor" className="hover:text-gray-300">For Instructors</Link>
                        )}
                        {user && user.role === 'student' && (
                            <Link to="/dashboard" className="hover:text-gray-300">My Learning</Link>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="hidden md:block text-gray-200">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hidden md:block px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-200 transition">
                                    Sign In
                                </Link>
                                <Link to="/register" className="hidden md:block px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
                                    Sign Up
                                </Link>
                            </>
                        )}
                        <button className="md:hidden text-xl" onClick={() => setIsMobileMenuOpen(true)}>
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center justify-center">
                        <div className="flex justify-end p-4 absolute top-0 right-0">
                            <button className="text-white text-2xl" onClick={() => setIsMobileMenuOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center h-full text-white text-xl space-y-8">
                            <Link to="/courses" className="hover:text-green-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Browse Courses</Link>
                            {user && user.role === 'instructor' && (
                                <Link to="/instructor" className="hover:text-green-400 transition" onClick={() => setIsMobileMenuOpen(false)}>For Instructors</Link>
                            )}
                            {user && user.role === 'student' && (
                                <Link to="/dashboard" className="hover:text-green-400 transition" onClick={() => setIsMobileMenuOpen(false)}>My Learning</Link>
                            )}
                            <div className="flex flex-col space-y-4 mt-8">
                                {user ? (
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <>
                                        <Link to="/login" className="px-6 py-3 bg-white text-gray-800 rounded-lg font-bold hover:bg-gray-200 transition" onClick={() => setIsMobileMenuOpen(false)}>
                                            Sign In
                                        </Link>
                                        <Link to="/register" className="px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition" onClick={() => setIsMobileMenuOpen(false)}>
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        );
    };

    export default Navbar;
    