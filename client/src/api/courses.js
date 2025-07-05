    import axios from 'axios';

    const API_URL = 'http://localhost:5000/api/courses/';

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

    const getAllCourses = async () => {
        const response = await axios.get(API_URL);
        return response.data;
    };

    const getCourseById = async (id) => {
        const response = await axios.get(API_URL + id);
        return response.data;
    };

    const createCourse = async (courseData) => {
        const response = await axios.post(API_URL, courseData, getConfig());
        return response.data;
    };

    const updateCourse = async (id, courseData) => {
        const response = await axios.put(API_URL + id, courseData, getConfig());
        return response.data;
    };

    const deleteCourse = async (id) => {
        const response = await axios.delete(API_URL + id, getConfig());
        return response.data;
    };

    const getMyCourses = async () => {
        const response = await axios.get(API_URL + 'my-courses', getConfig());
        return response.data;
    };

    const courseService = {
        getAllCourses,
        getCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        getMyCourses,
    };

    export default courseService;
    