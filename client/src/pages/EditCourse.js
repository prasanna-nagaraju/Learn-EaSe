import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../api/courses';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course data for editing
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch course data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Handle input changes
  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.updateCourse(courseId, course);
      alert('Course updated successfully!');
      navigate('/instructor'); // Adjust path to your dashboard route
    } catch (err) {
      console.error(err);
      alert('Failed to update course.');
    }
  };

  if (loading) return <div className="text-center py-16">Loading course details...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Edit Course</h2>
        <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block font-bold mb-1">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={course.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block font-bold mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={course.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="price" className="block font-bold mb-1">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={course.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>
            <div>
              <label htmlFor="thumbnail" className="block font-bold mb-1">Thumbnail URL</label>
              <input
                type="text"
                id="thumbnail"
                name="thumbnail"
                value={course.thumbnail}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={course.isPublished}
                onChange={(e) =>
                  setCourse({ ...course, isPublished: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="isPublished" className="font-bold">Published</label>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditCourse;
