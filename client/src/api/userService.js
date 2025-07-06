import api from './api'; // your axios instance

const createPaymentIntent = async (courseId) => {
  const res = await api.post('/payments/create-payment-intent', { courseId });
  return res.data;
};

const confirmEnrollment = async (courseId, paymentIntentId) => {
  const res = await api.post('/payments/confirm-enrollment', { courseId, paymentIntentId });
  return res.data;
};

// Export other user functions (enrollInCourse, getLearningDashboard, etc.) here

export default {
  createPaymentIntent,
  confirmEnrollment,
  // ...other user functions
};
