    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';

    const LoginPage = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);

        const { user, login } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            if (user) {
                // Redirect based on role after login
                if (user.role === 'instructor') {
                    navigate('/instructor');
                } else {
                    navigate('/dashboard');
                }
            }
        }, [user, navigate]);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
                await login(email, password);
                // Redirection handled by useEffect
            } catch (err) {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
                                Sign in to your account
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="email-address" className="sr-only">Email address</label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                        autoComplete="current-password"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                            <div className="text-sm text-center">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </>
        );
    };

    export default LoginPage;
    