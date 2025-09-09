import React, { useEffect, useState } from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { ArrowRight, TrendingUp, Package, Truck, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import Title from '../components/Title';

const Sell = () => {
    const [showFullTestimonial, setShowFullTestimonial] = useState(false);

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

            {/* Success Stories */}
            <section className="py-24 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-b from-white to-stone-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="text-3xl text-center mb-6">
                            <Title text1="SUCCESS" text2="STORIES" />
                        </div>
                        <p className="max-w-2xl mx-auto text-xl text-gray-600 font-light leading-relaxed">
                            Real stories from real sellers who found their success with Aharyas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <img
                                    src={assets.seller_1}
                                    alt="Sunehra Koshi - Founder of Crack of Dawn Crafts"
                                    className="w-full h-[500px] object-cover filter transition-all duration-700 shadow-2xl"
                                />
                                <div className="absolute -top-6 -left-6 w-12 h-12 border border-black/20"></div>
                                <div className="absolute -bottom-6 -right-6 w-12 h-12 border border-black/20"></div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="bg-white shadow-lg p-12 border-l-4 border-black hover:shadow-xl transition-all duration-500">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-light mb-2 tracking-wider text-black">
                                        Meet Sunehra Koshi
                                    </h3>
                                    <div className="w-16 h-0.5 bg-black mb-4"></div>
                                    <p className="text-lg text-gray-600 font-light italic">Founder, Crack of Dawn Crafts</p>
                                </div>

                                {!showFullTestimonial ? (
                                    <>
                                        <div className="text-gray-700 font-light leading-relaxed space-y-6">
                                            <p className="first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-1 first-letter:float-left first-letter:leading-none">
                                                What started as a small venture with five dedicated members has blossomed into a thriving community of fifteen artisans, each bringing their unique skills and stories to life through Crack of Dawn Crafts.
                                            </p>
                                            <blockquote className="border-l-2 border-black pl-6 py-4 italic text-xl text-black font-light">
                                                "From five members to fifteen, a little trust can go a long way."
                                            </blockquote>
                                            <p><em>Sunehra's journey with Aharyas showcases how traditional craftsmanship can find new life and reach in the digital age, while preserving the authentic essence of handmade artistry.</em></p>
                                        </div>
                                        <button
                                            className="mt-8 group flex items-center text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-1"
                                            onClick={() => setShowFullTestimonial(true)}
                                            aria-expanded={showFullTestimonial}
                                        >
                                            <span className="tracking-wide">READ FULL STORY</span>
                                            <ChevronDown className="ml-3 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-gray-700 font-light leading-relaxed space-y-6">
                                            <p className="first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                                                Sunehra Koshi's story begins in the heart of India's craft tradition, where she witnessed the gradual decline of artisan communities. Determined to preserve these invaluable skills, she founded Crack of Dawn Crafts with just five artisans who shared her vision of keeping traditional crafts alive.
                                            </p>
                                            <p>The early days were challenging. Finding customers who truly appreciated handcrafted work seemed impossible. The artisans were skilled, but reaching the right audience felt like an insurmountable task. Traditional retail channels didn't understand the value of their meticulous work.</p>
                                            <p>When Sunehra discovered Aharyas, everything changed. The platform's commitment to authentic craftsmanship aligned perfectly with her mission. "They didn't just see us as sellers," she reflects, "they saw us as custodians of culture."</p>
                                            <blockquote className="border-l-2 border-black pl-6 py-4 italic text-xl text-black font-light">
                                                "From five members to fifteen, a little trust can go a long way. Aharyas believed in our story when others saw just products."
                                            </blockquote>
                                            <p>Today, Crack of Dawn Crafts employs fifteen skilled artisans, each earning a sustainable income while practicing their ancestral crafts. Their work reaches customers across India and beyond, carrying forward traditions that might have otherwise been lost.</p>
                                            <p><em>Sunehra's success story is a testament to what happens when traditional craftsmanship meets modern platforms that truly understand and value authentic artistry.</em></p>
                                        </div>
                                        <button
                                            className="mt-8 group flex items-center text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-1"
                                            onClick={() => setShowFullTestimonial(false)}
                                            aria-expanded={showFullTestimonial}
                                        >
                                            <span className="tracking-wide">SHOW LESS</span>
                                            <ChevronUp className="ml-3 h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Second Success Story */}
                    <div className="mt-24 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                        <div className="lg:col-span-3 lg:order-1">
                            <div className="bg-white shadow-lg p-12 border-l-4 border-black hover:shadow-xl transition-all duration-500">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-light mb-2 tracking-wider text-black">
                                        Meet Dheepakh Rajaram
                                    </h3>
                                    <div className="w-16 h-0.5 bg-black mb-4"></div>
                                    <p className="text-lg text-gray-600 font-light italic">Founder, Goodness Pet Food</p>
                                </div>

                                <div className="text-gray-700 font-light leading-relaxed space-y-6">
                                    <p className="first-letter:text-4xl first-letter:font-light first-letter:text-black first-letter:mr-1 first-letter:float-left first-letter:leading-none">
                                        From humble beginnings with monthly sales of ₹10,000, Dheepakh's journey with Aharyas has been nothing short of extraordinary. His commitment to quality and the platform's support system created the perfect recipe for success.
                                    </p>
                                    <blockquote className="border-l-2 border-black pl-6 py-4 italic text-xl text-black font-light">
                                        "We went from sales of ₹10,000 to ₹5 lakh in just two and a half years. The growth has been phenomenal."
                                    </blockquote>
                                    <p><em>Dheepakh's story proves that with the right platform and dedication, small businesses can achieve remarkable growth while maintaining their core values and quality standards.</em></p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 lg:order-2">
                            <div className="relative">
                                <img
                                    src={assets.seller_2}
                                    alt="Dheepakh Rajaram - Founder of Goodness Pet Food"
                                    className="w-full h-[400px] object-cover filter transition-all duration-700 shadow-2xl"
                                />
                                <div className="absolute -top-6 -right-6 w-12 h-12 border border-black/20"></div>
                                <div className="absolute -bottom-6 -left-6 w-12 h-12 border border-black/20"></div>
                            </div>
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