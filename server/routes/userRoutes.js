    const express = require('express');
    const router = express.Router();
    const {
        enrollInCourse,
        getLearningDashboard,
        updateLessonProgress,
        getInstructorDashboard
    } = require('../controllers/userController');
    const { protect, authorizeRoles } = require('../middleware/authMiddleware');

    router.post('/enroll', protect, authorizeRoles('student'), enrollInCourse);
    router.get('/dashboard', protect, authorizeRoles('student'), getLearningDashboard);
    router.put('/enrollments/:enrollmentId/progress', protect, authorizeRoles('student'), updateLessonProgress);
    router.get('/instructor-dashboard', protect, authorizeRoles('instructor'), getInstructorDashboard);

    module.exports = router;
    