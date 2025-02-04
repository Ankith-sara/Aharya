import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';

const Sell = () => {
    return (
        <div className="m-20 bg-primary p-10 text-text min-h-screen">
            <div className="my-10 bg-primary text-secondary text-center">
                <Title text1="Start" text2="Selling on Aharya" />
                <p className="text-xl font-medium">
                    Empower your business and reach millions of customers with ease.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-10">
                {[
                    { title: 'Register Your Account', description: 'Sign up with your GST/PAN details and link an active bank account.', step: 1 },
                    { title: 'Choose Storage & Shipping', description: 'Select storage, packaging, and delivery options tailored for your needs.', step: 2 },
                    { title: 'List Your Products', description: 'Add product and brand details to attract the right buyers.', step: 3 },
                    { title: 'Complete Orders & Get Paid', description: 'Deliver on time and receive payments within 7 days of delivery.', step: 4 },
                ].map((item, index) => (
                    <div key={index} className="p-8 bg-primary border-secondary rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300" style={{ borderWidth: 2 }} >
                        <div className="flex items-center justify-between mb-3">
                            <span className="px-4 py-2 bg-secondary text-primary rounded-full text-lg font-semibold" >
                                STEP {item.step}
                            </span>
                        </div>
                        <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>

            <div className="p-10 rounded-lg bg-background shadow-lg mb-16 text-center">
                <Title text1="Why Sell" text2="on Aharya?" />
                <p className="text-lg mb-6">
                    Unlock your business potential with Aharya, India's most visited shopping platform.
                </p>
                <ul className="text-lg space-y-4">
                    <li>🌟 <b>Reach Millions:</b> Access a vast audience across India.
                    </li>
                    <li>🌟 <b>Proven Success:</b> Join a community of thriving sellers.
                    </li>
                    <li>🌟 <b>Seamless Delivery:</b> Deliver anywhere with Aharya's logistics support.
                    </li>
                </ul>
            </div>

            {/* Seller Testimonials Section */}
            <div className="p-10 rounded-lg shadow-lg mb-16">
                <Title text1="What Our" text2="Sellers Say" />
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                        { name: 'Sunehra Koshi', role: 'Founder, Crack of Dawn Crafts', quote: '"From five members to fifteen, a little trust can go a long way."', image: assets.seller_1 },
                        { name: 'Dheepakh Rajaram', role: 'Founder, Goodness Pet Food', quote: '"We went from sales of ₹10,000 to ₹5 lakh in just two and a half years."', image: assets.seller_2 },
                    ].map((testimonial, index) => (
                        <div key={index} className="flex flex-col items-center p-8 rounded-lg shadow-md hover:shadow-xl bg-background border-secondary border-2 hover:scale-105 transition-transform duration-300" >
                            <img src={testimonial.image} alt={testimonial.name} className="w-32 h-32 rounded-full mb-5 border-secondary border-4" />
                            <p className="font-semibold text-xl">{testimonial.name}</p>
                            <p className="italic">{testimonial.role}</p>
                            <p className="mt-4 text-center">{testimonial.quote}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-10 bg-secondary text-primary rounded-lg text-center">
                <h2 className="text-3xl font-semibold mb-5">Ready to Become a Seller?</h2>
                <Link to="/login">
                    <button
                        className="py-3 px-6 bg-background text-secondary rounded-lg text-lg hover:bg-opacity-90"
                    >
                        Start Selling Now
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Sell;