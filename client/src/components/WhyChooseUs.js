    import React from 'react';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const WhyChooseUs = () => {
        return (
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose LearnEase</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
                            <div className="text-green-700 text-4xl mb-4">
                                <i className="fas fa-laptop"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">High-Quality Courses</h3>
                            <p className="text-gray-600">Access industry-leading courses designed by experts in their fields.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
                            <div className="text-green-700 text-4xl mb-4">
                                <i className="fas fa-user-graduate"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Flexible Learning</h3>
                            <p className="text-gray-600">Learn at your own pace with lifetime access to course materials.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg">
                            <div className="text-green-700 text-4xl mb-4">
                                <i className="fas fa-medal"></i>
                            </div>
                            <h3 className="font-bold text-xl mb-2">Certification</h3>
                            <p className="text-gray-600">Earn certificates to showcase your skills to employers.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    export default WhyChooseUs;
    