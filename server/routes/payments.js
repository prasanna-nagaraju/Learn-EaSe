const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authenticateUser, async (req, res) => {
  const { courseId } = req.body;
  console.log('Creating payment intent for course:', courseId);

  try {
    // Get course details to calculate payment amount
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Only accept card payments to avoid return_url errors
      },
      metadata: {
        courseId: courseId,
        userId: req.user._id.toString(),
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Payment intent creation failed' });
  }
});

router.post('/confirm-enrollment', authenticateUser, async (req, res) => {
  const { courseId, paymentIntentId } = req.body;

  try {
    // Retrieve PaymentIntent to verify payment status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Check if user already enrolled
    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });

    res.json({ message: 'Enrollment successful', enrollment });
  } catch (error) {
    console.error('Error confirming enrollment:', error);
    res.status(500).json({ message: 'Enrollment failed' });
  }
});

module.exports = router;
