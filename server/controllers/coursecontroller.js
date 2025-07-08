    const asyncHandler = require('express-async-handler');
    const Course = require('../models/Course');
    const User = require('../models/User');

    // @desc    Get all courses
    // @route   GET /api/courses
    // @access  Public
    const getCourses = asyncHandler(async (req, res) => {
        const courses = await Course.find({ isPublished: true }).populate('instructor', 'name email');
        console.log(courses);
        res.status(200).json(courses);
    });

    // @desc    Get single course by ID
    // @route   GET /api/courses/:id
    // @access  Public
    const getCourseById = asyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');

        if (course && course.isPublished) {
            res.status(200).json(course);
        } else if (course && !course.isPublished && req.user && (req.user._id.equals(course.instructor) || req.user.role === 'admin')) {
            // Allow instructor or admin to view unpublished courses
            res.status(200).json(course);
        } else {
            res.status(404);
            throw new Error('Course not found or not published');
        }
    });

    // @desc    Create a new course
    // @route   POST /api/courses
    // @access  Private/Instructor
    const createCourse = asyncHandler(async (req, res) => {
        const { title, description, price, category, thumbnail, videos,isPublished } = req.body;

        if (!title || !description || !price || !category || !videos || videos.length === 0) {
            res.status(400);
            throw new Error('Please fill all required fields and add at least one video');
        }

        const course = await Course.create({
            title,
            description,
            price,
            category,
            thumbnail,
            videos,
            instructor: req.user._id, // Instructor is the logged-in user
            isPublished // Courses are unpublished by default
        });

        res.status(201).json(course);
    });

    // @desc    Update a course
    // @route   PUT /api/courses/:id
    // @access  Private/Instructor
    const updateCourse = asyncHandler(async (req, res) => {
        const { title, description, price, category, thumbnail, videos, isPublished } = req.body;

        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if the logged-in user is the instructor of the course or an admin
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error('Not authorized to update this course');
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.price = price || course.price;
            course.category = category || course.category;
            course.thumbnail = thumbnail || course.thumbnail;
            course.videos = videos || course.videos;
            course.isPublished = typeof isPublished === 'boolean' ? isPublished : course.isPublished;

            const updatedCourse = await course.save();
            res.status(200).json(updatedCourse);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    });

    // @desc    Delete a course
    // @route   DELETE /api/courses/:id
    // @access  Private/Instructor
    const deleteCourse = asyncHandler(async (req, res) => {
        const course = await Course.findById(req.params.id);
        console.log("req.user from deleteCourse:", req.user);   
        res.status(200).json({ message: 'Delete course endpoint hit' });

        if (course) {
            // Check if the logged-in user is the instructor of the course or an admin
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error('Not authorized to delete this course');
            }

            await Course.findByIdAndDelete(course._id);
            res.status(200).json({ message: 'Course removed' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    });

    // @desc    Get courses created by the logged-in instructor
    // @route   GET /api/courses/my-courses
    // @access  Private/Instructor
    const getMyCourses = asyncHandler(async (req, res) => {
        console.log("req.user from /my-courses:", req.user);
        if (!req.user || !req.user._id) {
            res.status(401);
            throw new Error("User not authenticated");
        }
        console.log('User in getMyCourses:', req.user);
        const courses = await Course.find({ instructor: req.user._id }).populate('instructor', 'name email');
        res.status(200).json(courses);
    });


    module.exports = {
        getCourses,
        getCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        getMyCourses,
    };
    