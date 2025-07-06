    import React, { useState } from 'react';
    import Navbar from '../components/Navbar';
    import Footer from '../components/Footer';
    import InstructorDashboard from '../components/InstructorDashboard';
    import courseService from '../api/courses';
    import { useNavigate } from 'react-router-dom';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const InstructorPage = () => {
        const [showCreateForm, setShowCreateForm] = useState(false);
        const [courseData, setCourseData] = useState({
            title: '',
            description: '',
            price: 0,
            category: '',
            thumbnail: '', // Placeholder for URL
            isPublished: false,
            videos: [{ title: '', url: '' ,duration: 0 }], // Initial video field
        });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const navigate = useNavigate();

        const handleCourseChange = (e) => {
            setCourseData({ ...courseData, [e.target.name]: e.target.value });
        };
        
        const handleVideoChange = (index, e) => {
            const { name, value } = e.target;
            const newVideos = [...courseData.videos];
            newVideos[index][name] = name === 'duration' ? parseInt(value, 10) || 0 : value;
            setCourseData({ ...courseData, videos: newVideos });
        };


        const addVideoField = () => {
            setCourseData({ ...courseData, videos: [...courseData.videos, { title: '', url: '' }] });
        };

        const removeVideoField = (index) => {
            const newVideos = courseData.videos.filter((_, i) => i !== index);
            setCourseData({ ...courseData, videos: newVideos });
        };

        const handleCreateCourseSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
                await courseService.createCourse(courseData);
                alert('Course created successfully!');
                setShowCreateForm(false);
                setCourseData({ // Reset form
                    title: '',
                    description: '',
                    price: 0,
                    category: '',
                    thumbnail: '',
                    isPublished: false,
                    videos: [{ title: '', url: '' ,duration: 0}],
                });
                // Optionally refresh dashboard data
                navigate('/instructor'); // Re-navigate to refresh component
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to create course.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        return (
            <>
                <Navbar />
                <InstructorDashboard />

                <section className="py-16 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-8">
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition"
                            >
                                {showCreateForm ? 'Hide Course Creation Form' : 'Create New Course'}
                            </button>
                        </div>

                        {showCreateForm && (
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                                <h3 className="text-2xl font-bold mb-6 text-center">New Course Details</h3>
                                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                                <form onSubmit={handleCreateCourseSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
                                        <input type="text" id="title" name="title" value={courseData.title} onChange={handleCourseChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea id="description" name="description" value={courseData.description} onChange={handleCourseChange} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                                            <input type="number" id="price" name="price" value={courseData.price} onChange={handleCourseChange} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                            <input type="text" id="category" name="category" value={courseData.category} onChange={handleCourseChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                                        <input type="url" id="thumbnail" name="thumbnail" value={courseData.thumbnail} onChange={handleCourseChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="e.g., https://example.com/image.jpg" />
                                    </div>

                                    <h4 className="text-xl font-bold mt-8 mb-4">Course Videos/Lessons</h4>
                                    {courseData.videos.map((video, index) => (
                                        <div key={index} className="flex items-end space-x-4 border p-4 rounded-md bg-gray-50">
                                            <div className="flex-grow">
                                                <label htmlFor={`video-title-${index}`} className="block text-sm font-medium text-gray-700">Lesson Title</label>
                                                <input type="text" id={`video-title-${index}`} name="title" value={video.title} onChange={(e) => handleVideoChange(index, e)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                            </div>
                                            <div className="flex-grow">
                                                <label htmlFor={`video-url-${index}`} className="block text-sm font-medium text-gray-700">Video URL (Embed Link)</label>
                                                <input type="url" id={`video-url-${index}`} name="url" value={video.url} onChange={(e) => handleVideoChange(index, e)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="e.g., https://www.youtube.com/embed/dQw4w9WgXcQ" />
                                            </div>
                                            <div className="flex-grow">
                                                <label htmlFor={`video-duration-${index}`} className="block text-sm font-medium text-gray-700">
                                                    Duration (in minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`video-duration-${index}`}
                                                    name="duration"
                                                    value={video.duration}
                                                    onChange={(e) => handleVideoChange(index, e)}
                                                    min="1"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    required
                                                />
                                            </div>

                                            {courseData.videos.length > 1 && (
                                                <button type="button" onClick={() => removeVideoField(index)} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addVideoField} className="px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-50 transition flex items-center">
                                        <i className="fas fa-plus mr-2"></i> Add Another Lesson
                                    </button>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            name="isPublished"
                                            checked={courseData.isPublished}
                                            onChange={(e) => setCourseData({ ...courseData, isPublished: e.target.checked })}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isPublished" className="block text-sm font-medium text-gray-700">
                                            Publish this course
                                        </label>
                                    </div>


                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating Course...' : 'Create Course'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
                <Footer />
            </>
        );
    };

    export default InstructorPage;
    