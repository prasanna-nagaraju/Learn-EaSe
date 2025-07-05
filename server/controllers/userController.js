    require('dotenv').config();
    const asyncHandler = require('express-async-handler');
    const Enrollment = require('../models/Enrollment');
    const Course = require('../models/Course');
    const User = require('../models/User');
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // @desc    Enroll in a course (after payment)
    // @route   POST /api/users/enroll
    // @access  Private/Student
    const enrollInCourse = asyncHandler(async (req, res) => {
        const { courseId, paymentMethodId } = req.body;
        const userId = req.user._id;

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            res.status(400);
            throw new Error('You are already enrolled in this course');
        }

        // Process payment with Stripe
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(course.price * 100), // amount in cents
                currency: 'usd',
                payment_method: paymentMethodId,
                confirm: true,
                description: `Enrollment in ${course.title}`,
                metadata: {
                    userId: userId.toString(),
                    courseId: courseId.toString(),
                },
            });

            if (paymentIntent.status === 'succeeded') {
                const enrollment = await Enrollment.create({
                    user: userId,
                    course: courseId,
                    progress: 0,
                    completedLessons: [],
                });
                res.status(201).json({ message: 'Enrollment successful', enrollment });
            } else {
                res.status(400);
                throw new Error('Payment failed: ' + paymentIntent.last_payment_error?.message);
            }
        } catch (error) {
            console.error('Stripe Payment Error:', error);
            res.status(500);
            throw new Error('Payment processing failed: ' + error.message);
        }
    });

    // @desc    Get user's learning dashboard (enrolled courses with progress)
    // @route   GET /api/users/dashboard
    // @access  Private/Student
    const getLearningDashboard = asyncHandler(async (req, res) => {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate('course', 'title thumbnail videos'); // Populate course details

        res.status(200).json(enrollments);
    });

    // @desc    Update lesson progress for an enrolled course
    // @route   PUT /api/users/enrollments/:enrollmentId/progress
    // @access  Private/Student
    const updateLessonProgress = asyncHandler(async (req, res) => {
        const { enrollmentId } = req.params;
        const { lessonUrl, completed } = req.body; // lessonUrl is the video URL

        const enrollment = await Enrollment.findById(enrollmentId);

        if (!enrollment) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        // Ensure the logged-in user owns this enrollment
        if (enrollment.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this enrollment');
        }

        const course = await Course.findById(enrollment.course);
        if (!course) {
            res.status(404);
            throw new Error('Associated course not found');
        }

        const totalLessons = course.videos.length;
        if (totalLessons === 0) {
            res.status(400);
            throw new Error('Course has no lessons');
        }

        if (completed) {
            // Add lesson to completedLessons if not already there
            if (!enrollment.completedLessons.includes(lessonUrl)) {
                enrollment.completedLessons.push(lessonUrl);
            }
        } else {
            // Remove lesson from completedLessons
            enrollment.completedLessons = enrollment.completedLessons.filter(url => url !== lessonUrl);
        }

        // Calculate new progress
        enrollment.progress = (enrollment.completedLessons.length / totalLessons) * 100;
        enrollment.isCompleted = enrollment.progress === 100;

        const updatedEnrollment = await enrollment.save();
        res.status(200).json(updatedEnrollment);
    });

    // @desc    Get instructor dashboard statistics
    // @route   GET /api/users/instructor-dashboard
    // @access  Private/Instructor
    const getInstructorDashboard = asyncHandler(async (req, res) => {
        const instructorId = req.user._id;

        // Get courses by this instructor
        const courses = await Course.find({ instructor: instructorId });
        const totalCourses = courses.length;

        // Get total students and average rating for these courses
        let totalStudents = 0;
        let totalRatingSum = 0;
        let totalReviews = 0;

        for (const course of courses) {
            const enrollments = await Enrollment.countDocuments({ course: course._id });
            totalStudents += enrollments;
            totalRatingSum += course.rating * course.numReviews;
            totalReviews += course.numReviews;
        }

        const avgRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

        // Calculate estimated earnings (simple sum of course prices * enrollments)
        // In a real app, this would be based on actual payment records and revenue share
        let totalEarnings = 0;
        for (const course of courses) {
            const enrollments = await Enrollment.countDocuments({ course: course._id });
            totalEarnings += course.price * enrollments;
        }

        res.status(200).json({
            totalCourses,
            totalStudents,
            avgRating,
            totalEarnings: totalEarnings.toFixed(2),
        });
    });


    module.exports = {
        enrollInCourse,
        getLearningDashboard,
        updateLessonProgress,
        getInstructorDashboard,
    };
    