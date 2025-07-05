    const mongoose = require('mongoose');

    const courseSchema = mongoose.Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        price: { type: Number, required: true, default: 0 },
        category: { type: String, required: true },
        thumbnail: { type: String }, // URL to image
        videos: [{
            title: { type: String, required: true },
            url: { type: String, required: true }, // URL to video content
            duration: { type: Number }, // in minutes
        }],
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
    }, { timestamps: true });

    const Course = mongoose.model('Course', courseSchema);
    module.exports = Course;
    