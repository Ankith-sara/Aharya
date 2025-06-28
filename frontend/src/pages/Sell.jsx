import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import { ArrowRight, TrendingUp, Package, Truck, CreditCard } from 'lucide-react';

const Sell = () => {
    useEffect(() => {
        document.title = 'Become a Seller | Aharyas'
    })
    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero Section */}
            <div className="relative h-screen">
                <div className="absolute inset-0 bg-black clip-diagonal"></div>
                <div className="absolute inset-0 flex items-center justify-center px-6 md:px-20">
                    <div className="max-w-4xl w-full text-center">
                        <h1 className="text-white text-4xl md:text-5xl font-light tracking-tight mb-6">
                            BECOME A <span className="font-bold">SELLER</span>
                        </h1>
                        <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                            Join thousands of entrepreneurs and artisans who are transforming their business on Aharya's marketplace.
                        </p>
                        <Link to="/login">
                            <button className="px-8 py-4 bg-white text-black font-medium hover:bg-gray-100 transition-colors transform hover:scale-105 duration-300 text-lg">
                                START SELLING NOW
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                    <div className="animate-bounce bg-white rounded-full p-3 shadow-lg">
                        <ArrowRight className="h-6 w-6 text-black transform rotate-90" />
                    </div>
                </div>
            </div>

            {/* Steps Section with Large Numbers */}
            <div className="py-20 px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-light mb-6">YOUR <span className="font-bold">JOURNEY</span></h2>
                    <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                        Four simple steps to transform your business and reach millions of customers nationwide.
                    </p>
                </div>

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { title: 'Register Your Account', description: 'Sign up with your GST/PAN details and link an active bank account.', step: 1, icon: <TrendingUp size={32} /> },
                        { title: 'Choose Storage & Shipping', description: 'Select storage, packaging, and delivery options tailored for your needs.', step: 2, icon: <Package size={32} /> },
                        { title: 'List Your Products', description: 'Add product and brand details to attract the right buyers.', step: 3, icon: <Truck size={32} /> },
                        { title: 'Complete Orders & Get Paid', description: 'Deliver on time and receive payments within 7 days of delivery.', step: 4, icon: <CreditCard size={32} /> },
                    ].map((item, index) => (
                        <div key={index} className="relative p-8 border border-gray-200 bg-white rounded-md hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                            <div className="absolute -right-1 -top-2 text-9xl font-bold text-gray-100 opacity-80 z-0 transition-transform duration-500 group-hover:scale-105">
                                {item.step}
                            </div>
                            <div className="relative z-10">
                                <div className="text-black mb-6">{item.icon}</div>
                                <h2 className="text-xl font-bold mb-4">{item.title}</h2>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-20 px-4 sm:px-6 md:px-10 lg:px-20 bg-black text-white">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">WHY <span className="font-light">SELL</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="border-l-4 border-white p-6 transform transition-transform hover:translate-y-[-10px] duration-300">
                        <span className="text-4xl font-bold block mb-4">01</span>
                        <h3 className="font-bold text-2xl mb-4">Reach Millions</h3>
                        <p className="text-gray-300">Access a vast audience across India with our established customer base eager to discover new products.</p>
                    </div>
                    <div className="border-l-4 border-white p-6 transform transition-transform hover:translate-y-[-10px] duration-300">
                        <span className="text-4xl font-bold block mb-4">02</span>
                        <h3 className="font-bold text-2xl mb-4">Proven Success</h3>
                        <p className="text-gray-300">Join a community of thriving sellers who have scaled their businesses beyond expectations.</p>
                    </div>
                    <div className="border-l-4 border-white p-6 transform transition-transform hover:translate-y-[-10px] duration-300">
                        <span className="text-4xl font-bold block mb-4">03</span>
                        <h3 className="font-bold text-2xl mb-4">Seamless Delivery</h3>
                        <p className="text-gray-300">Deliver anywhere with Aharya's extensive logistics network and dedicated support system.</p>
                    </div>
                </div>
            </div>

            {/* Success Stories with Dynamic Layout */}
            <div className="py-20 px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-light mb-6">SUCCESS <span className="font-bold">STORIES</span></h2>
                </div>

                <div className="grid gap-10 md:grid-cols-2">
                    {[
                        { name: 'Sunehra Koshi', role: 'Founder, Crack of Dawn Crafts', quote: '"From five members to fifteen, a little trust can go a long way."', image: assets.seller_1 },
                        { name: 'Dheepakh Rajaram', role: 'Founder, Goodness Pet Food', quote: '"We went from sales of ₹10,000 to ₹5 lakh in just two and a half years."', image: assets.seller_2 },
                    ].map((testimonial, index) => (
                        <div key={index} className="group">
                            <div className="relative overflow-hidden">
                                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-screen object-cover object-center filter grayscale group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                    <p className="text-white text-xl md:text-2xl italic mb-4">{testimonial.quote}</p>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{testimonial.name}</h3>
                                        <p className="text-gray-300">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 sm:px-6 md:px-10 py-20 text-black">
                <div className="mx-auto text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-10">READY TO TRANSFORM YOUR BUSINESS?</h2>
                    <p className="text-xl mb-10 max-w-3xl mx-auto">
                        Join the thousands of sellers who have found success on Aharya.
                        Your journey starts now.
                    </p>
                    <Link to="/login">
                        <button className="px-10 py-5 bg-black text-white font-bold text-lg hover:bg-gray-900">
                            BECOME A SELLER
                        </button>
                    </Link>
                </div>
            </div>

            <style>{`
                .clip-diagonal {
                    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
                }
            `}</style>
        </div>
    );
};

export default Sell;