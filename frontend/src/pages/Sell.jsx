import React, { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Package, Truck, CreditCard } from 'lucide-react';
import Title from '../components/Title';

const Sell = () => {

    useEffect(() => {
        document.title = 'Become a Seller | Aharyas - Join Our Artisan Community'
    }, []);

    return (
        <div className="min-h-screen text-black mt-20">
            {/* Hero Section */}
            <section className="relative py-28 overflow-hidden">
                <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
                    <div className="mb-8">
                        <Title text1="BECOME A" text2="SELLER" />
                    </div>
                    <div>
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
                            Join thousands of artisans and entrepreneurs transforming their businesses on <span className="font-medium text-black">Aharya</span>.
                            Celebrate craftsmanship, embrace innovation, and grow with a community that values tradition and creativity.
                        </p>

                        <a href="https://admin.aharyas.com/" target="_blank" rel="noopener noreferrer">
                            <button className="px-10 py-4 rounded-full bg-black text-white font-medium text-lg tracking-wide hover:shadow-xl hover:bg-gray-900 transition-all duration-300">
                                START SELLING NOW
                            </button>
                        </a>
                    </div>
                    <div className="mt-20">
                        <div className="animate-bounce w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-black shadow-lg">
                            <ArrowRight className="h-6 w-6 text-white rotate-90" />
                        </div>
                    </div>
                </div>
            </section>


            {/* Your Journey Section */}
            <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="text-3xl text-center mb-6">
                            <Title text1="YOUR" text2="JOURNEY" />
                        </div>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600 font-light leading-relaxed">
                            Four thoughtful steps to transform your business and reach customers who value authenticity and craftsmanship.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                title: 'Register Your Account',
                                description: 'Begin your journey with us by sharing your story. Register with GST/PAN details and connect your bank account.',
                                step: '01',
                                icon: <TrendingUp size={32} />
                            },
                            {
                                title: 'Choose Storage & Shipping',
                                description: 'Select storage, packaging, and delivery options crafted specifically for your unique needs.',
                                step: '02',
                                icon: <Package size={32} />
                            },
                            {
                                title: 'List Your Products',
                                description: 'Share your creations with the world. Add rich product details and tell your brand story.',
                                step: '03',
                                icon: <Truck size={32} />
                            },
                            {
                                title: 'Complete Orders & Get Paid',
                                description: 'Deliver with care and receive payments within 7 days. Build lasting relationships with customers.',
                                step: '04',
                                icon: <CreditCard size={32} />
                            },
                        ].map((item, index) => (
                            <div key={index} className="group">
                                <div className="bg-white p-12 shadow-lg hover:shadow-xl transition-all duration-500 border-l-4 border-black relative overflow-hidden">
                                    <div className="absolute -top-1 -right-1 text-7xl font-light text-black/10 z-0 transition-transform duration-500 group-hover:scale-105">
                                        {item.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-black mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-light mb-2 text-black tracking-wide">{item.title}</h3>
                                        <div className="w-12 h-0.5 bg-black mb-4"></div>
                                        <p className="text-gray-600 font-light leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Sell Section */}
            <section className="relative py-16">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50"></div>
                <div className="relative px-4 sm:px-8 md:px-10 lg:px-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="text-3xl text-center mb-6">
                                <Title text1="WHY" text2="SELL" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    number: "01",
                                    title: "Reach Millions",
                                    description: "Access a vast audience across India with our established customer base eager to discover authentic, handcrafted products that tell a story."
                                },
                                {
                                    number: "02",
                                    title: "Proven Success",
                                    description: "Join a thriving community of artisans and sellers who have scaled their businesses while preserving their craft heritage and traditions."
                                },
                                {
                                    number: "03",
                                    title: "Seamless Delivery",
                                    description: "Deliver anywhere with Aharya's extensive logistics network, dedicated support system, and commitment to customer satisfaction."
                                }
                            ].map((item, index) => (
                                <div key={index} className="group">
                                    <div className="bg-white/90 backdrop-blur-sm p-12 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black">
                                        <div className="mb-8">
                                            <span className="text-4xl font-light text-black block mb-4">{item.number}</span>
                                            <h3 className="text-2xl font-light mb-2 tracking-wide text-black">{item.title}</h3>
                                            <div className="w-12 h-0.5 bg-black"></div>
                                        </div>
                                        <p className="text-gray-700 font-light leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What Drives Us Section */}
            <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="mb-16">
                        <div className="text-3xl text-center mb-6">
                            <Title text1="WHAT DRIVES" text2="OUR SELLERS" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-8 -left-8 text-8xl text-black/10 font-serif">"</div>
                        <div className="bg-gradient-to-r from-gray-50 to-transparent p-16 border-l-4 border-black">
                            <blockquote className="text-2xl md:text-3xl font-light text-black leading-relaxed">
                                A shared belief:
                                <br /><br />
                                <em className="font-light">That every creation tells a story, every purchase supports a dream, and every seller contributes to preserving India's rich cultural heritage.</em>
                            </blockquote>
                        </div>
                        <div className="absolute -bottom-8 -right-8 text-8xl text-black/10 font-serif rotate-180">"</div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Refined */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-stone-800 via-gray-900 to-black"></div>
                </div>
                <div className="relative px-4 sm:px-8 md:px-10 lg:px-20 text-center">
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-16">
                            <h2 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-white mb-8">
                                READY TO <span className="font-medium">TRANSFORM</span>
                            </h2>
                            <p className="text-xl text-white/90 font-light tracking-wide mb-2">YOUR BUSINESS?</p>
                        </div>

                        <div className="bg-white/95 backdrop-blur-md p-16 shadow-2xl max-w-4xl mx-auto">
                            <p className="text-gray-800 text-xl font-light leading-loose mb-12 first-letter:text-6xl first-letter:font-light first-letter:text-black first-letter:float-left first-letter:leading-none">
                                Join the thousands of sellers who have found success on Aharyas. Your journey towards building a sustainable, meaningful business starts here. Be part of a community that celebrates authenticity, craftsmanship, and the stories behind every creation.
                            </p>
                            <a href="https://admin.aharyas.com/" target="_blank" rel="noopener noreferrer">
                                <button className="px-12 py-5 bg-black text-white font-light text-lg tracking-wide hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    BECOME A SELLER
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Sell;