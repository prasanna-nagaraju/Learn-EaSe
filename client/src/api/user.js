    import axios from 'axios';

    const API_URL = 'http://localhost:5000/api/users/';

    const getToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.token : null;
    };

    const getConfig = () => {
        const token = getToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const enrollInCourse = async (courseId, paymentMethodId) => {
        const response = await axios.post(API_URL + 'enroll', { courseId, paymentMethodId }, getConfig());
        return response.data;
    };

    const getLearningDashboard = async () => {
        const response = await axios.get(API_URL + 'dashboard', getConfig());
        return response.data;
    };

    const updateLessonProgress = async (enrollmentId, lessonUrl, completed) => {
        const response = await axios.put(API_URL + `enrollments/${enrollmentId}/progress`, { lessonUrl, completed }, getConfig());
        return response.data;
    };

    const getInstructorDashboard = async () => {
        const response = await axios.get(API_URL + 'instructor-dashboard', getConfig());
        return response.data;
    };

    
    const createPaymentIntent = async (courseId) => {
    const res = await axios.post('http://localhost:5000/api/payments/create-payment-intent', { courseId },getConfig());
    return res.data;
    };

    const confirmEnrollment = async (courseId, paymentIntentId) => {
    const res = await axios.post('http://localhost:5000/api/payments/confirm-enrollment', { courseId, paymentIntentId }, getConfig());
    return res.data;
    };

    const userService = {
        enrollInCourse,
        getLearningDashboard,
        updateLessonProgress,
        getInstructorDashboard,
        createPaymentIntent,
        confirmEnrollment
    };

    export default userService;
    