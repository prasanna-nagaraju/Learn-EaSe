    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';

    const RegisterPage = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [role, setRole] = useState('student'); // Default role
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);

        const { user, register } = useAuth();
        const navigate = useNavigate();
        const location = useLocation();

        useEffect(() => {
            // Pre-select role if passed in query params (e.g., /register?role=instructor)
            const queryParams = new URLSearchParams(location.search);
            const roleParam = queryParams.get('role');
            if (roleParam === 'instructor') {
                setRole('instructor');
            }

            if (user) {
                // Redirect based on role after registration
                if (user.role === 'instructor') {
                    navigate('/instructor');
                } else {
                    navigate('/dashboard');
                }
            }
        }, [user, navigate, location.search]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            try {
                await register(name, email, password, role);
                // Redirection handled by useEffect
            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
                setLoading(false);
            }
        };

        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Create your account
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="name" className="sr-only">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="role-student"
                                        name="role"
                                        type="radio"
                                        value="student"
                                        checked={role === 'student'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <label htmlFor="role-student" className="ml-2 block text-sm text-gray-900">
                                        Register as Student
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="role-instructor"
                                        name="role"
                                        type="radio"
                                        value="instructor"
                                        checked={role === 'instructor'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <label htmlFor="role-instructor" className="ml-2 block text-sm text-gray-900">
                                        Register as Instructor
                                    </label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Sign Up'}
                                </button>
                            </div>
                            <div className="text-sm text-center">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </>
        );
    };

    export default RegisterPage;
    