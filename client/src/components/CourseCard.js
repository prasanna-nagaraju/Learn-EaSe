    import React from 'react';
    import { Link } from 'react-router-dom';

    const CourseCard = ({ course }) => {
        return (
            <div className="course-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300">
                <div className="relative">
                    <img src={course.thumbnail || "https://placehold.co/600x400"} alt={`${course.title} course cover`} className="w-full h-48 object-cover" />
                    {course.isBestseller && (
                        <span className="absolute top-2 right-2 bg-green-700 text-white text-xs px-2 py-1 rounded">Bestseller</span>
                    )}
                    {course.isNew && (
                        <span className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded">New</span>
                    )}
                </div>
                <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">By {course.instructor?.name || 'Unknown'}</p>
                    <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={course.rating >= i + 1 ? "fas fa-star" : course.rating >= i + 0.5 ? "fas fa-star-half-alt" : "far fa-star"}></i>
                            ))}
                        </div>
                        <span className="text-gray-600 text-sm ml-2">{course.rating.toFixed(1)} ({course.numReviews})</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">${course.price.toFixed(2)}</span>
                        <Link to={`/courses/${course._id}`} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
                            View Course
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    export default CourseCard;
    