    import React from 'react';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';
    import LearningDashboard from '../components/LearningDashboard';

    const StudentDashboardPage = () => {
        return (
            <>
                <Navbar />
                <LearningDashboard />
                <Footer />
            </>
        );
    };

    export default StudentDashboardPage;
    