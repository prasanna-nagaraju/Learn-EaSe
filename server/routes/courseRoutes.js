    const express = require('express');
    const router = express.Router();
    const {
        getCourses,
        getCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        getMyCourses
    } = require('../controllers/coursecontroller');
    const { protect, authorizeRoles } = require('../middleware/authMiddleware');

    router.route('/')
        .get(getCourses)
        .post(protect, authorizeRoles('instructor', 'admin'), createCourse);

    router.route('/:id')
        .get(getCourseById)
        .put(protect, authorizeRoles('instructor', 'admin'), updateCourse)
        .delete(protect, authorizeRoles('instructor', 'admin'), deleteCourse);

    router.get('/my-courses', protect, authorizeRoles('instructor'), getMyCourses);

    module.exports = router;
    