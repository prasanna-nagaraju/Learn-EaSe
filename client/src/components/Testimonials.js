    import React from 'react';
    import '@fortawesome/fontawesome-free/css/all.min.css';

    const Testimonials = () => {
        return (
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <img src="https://placehold.co/60x60" alt="Portrait of a satisfied female student with glasses smiling" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold">Emily Rodriguez</h4>
                                    <div className="flex text-yellow-400">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">"The Data Science course completely transformed my career. The instructors are knowledgeable and the platform is easy to use."</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <img src="https://placehold.co/60x60" alt="Portrait of a young male student with short hair looking confident" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold">David Thompson</h4>
                                    <div className="flex text-yellow-400">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">"Perfect for working professionals. I could balance my job while learning mobile development at my own pace."</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <img src="https://placehold.co/60x60" alt="Portrait of an older female student with gray hair looking thoughtful" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold">Sarah Williams</h4>
                                    <div className="flex text-yellow-400">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">"Even as a senior professional, I found the courses relevant and up-to-date with industry standards. Highly recommended!"</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    export default Testimonials;
    