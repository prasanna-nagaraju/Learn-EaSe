import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InstructorPage from './pages/InstructorPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CoursePlayer from './components/CoursePlayer';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AllCoursesPage from './pages/AllCoursesPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RgtX4R7oZsjTrQPu7TMkXp0jIWiDJOxTVDp8VnSkCYzNSBjwX4OH1ZiizSL1ss1dm1yUEwDYPuVA7pc0yVSJRhI00e5KyG7hG'); // your publishable key

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/courses" element={<AllCoursesPage />} />

                    <Route
                        path="/courses/:id"
                        element={
                            <Elements stripe={stripePromise}>
                                <CourseDetailPage />
                            </Elements>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={<PrivateRoute component={StudentDashboardPage} roles={['student']} />}
                    />
                    <Route
                        path="/courses/:courseId/lesson/:lessonId"
                        element={<PrivateRoute component={CoursePlayer} roles={['student']} />}
                    />
                    <Route
                        path="/instructor"
                        element={<PrivateRoute component={InstructorPage} roles={['instructor']} />}
                    />
                    <Route
                        path="/instructor/create-course"
                        element={<PrivateRoute component={InstructorPage} roles={['instructor']} />}
                    />
                    <Route
                        path="/instructor/manage-courses"
                        element={<PrivateRoute component={InstructorPage} roles={['instructor']} />}
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
