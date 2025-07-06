    const express = require('express');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const connectDB = require('./config/db');
    const authRoutes = require('./routes/authRoutes');
    const courseRoutes = require('./routes/courseRoutes');
    const userRoutes = require('./routes/userRoutes');
    const { notFound, errorHandler } = require('./middleware/errorHandler');
    const paymentRoutes = require('./routes/payments');

    dotenv.config();
    connectDB();

    const app = express();

    app.use(express.json()); // Body parser
    app.use(cors()); // Enable CORS

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/users', userRoutes);   
    app.use('/api/payments', paymentRoutes);

    // Error Handling Middleware
    app.use(notFound);
    app.use(errorHandler);


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    