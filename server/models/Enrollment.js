    const mongoose = require('mongoose');

    const enrollmentSchema = mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        progress: { type: Number, default: 0 }, // Percentage completion
        completedLessons: [{ type: String }], // Array of video URLs or IDs
        enrolledAt: { type: Date, default: Date.now },
        isCompleted: { type: Boolean, default: false },
    }, { timestamps: true });

    const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
    module.exports = Enrollment;
    