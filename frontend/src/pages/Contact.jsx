import React, { useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { MapPin, Phone, Mail, Briefcase } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Customer Service | Aharyas'
  });

  return (
    <div className="min-h-screen text-black mt-20">
      <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-none shadow-2xl">
                <img
                  className="w-full h-[600px] object-cover filter transition-all duration-700"
                  src={assets.contact_img}
                  alt="Aharyas Contact"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -top-8 -left-8 w-16 h-16 border border-black/20"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 border border-black/20"></div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="text-3xl text-center mb-6">
                <Title text1="CONTACT" text2="US" />
              </div>

              <div className="space-y-4 text-gray-700 text-lg leading-loose font-light">
                <p>We believe in the power of connection — between artisan and buyer, tradition and modernity, story and style. At Aharyas, every conversation matters.</p>
                <p>Whether you have questions about our handcrafted pieces, need assistance with your order, or want to learn more about the artisans behind your favorite garments, we're here to help.</p>
                <p>Our customer service team understands that each Aharyas piece carries a story, and we're committed to ensuring your experience with us is as meaningful as the craftsmanship we celebrate.</p>
                <blockquote className="border-l-2 border-black pl-6 py-4 italic text-xl text-black font-light">
                  "Every question is an opportunity to share our passion for heritage craft and conscious fashion."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50"></div>
        <div className="relative px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-3xl text-center mb-6">
              <Title text1="GET IN" text2="TOUCH" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                      <MapPin className="text-black" size={24} />
                    </div>
                    <h3 className="text-xl font-light tracking-wider text-black">VISIT US</h3>
                  </div>
                  <div className="w-12 h-0.5 bg-black mb-4"></div>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>Sanikipuri, Malkajgiri</p>
                    <p>Hyderabad, Telangana</p>
                    <p className="font-medium">PIN: 500064</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                      <Phone className="text-black" size={24} />
                    </div>
                    <h3 className="text-xl font-light tracking-wider text-black">CALL US</h3>
                  </div>
                  <div className="w-12 h-0.5 bg-black mb-4"></div>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>Customer Service</p>
                    <p className="text-xl font-medium text-black">+91 9063284008</p>
                    <p className='text-xl font-medium text-black'>+91 91211 57804</p>
                    <p className="text-sm text-gray-500">Mon - Sat: 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white/90 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-black h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                      <Mail className="text-black" size={24} />
                    </div>
                    <h3 className="text-xl font-light tracking-wider text-black">EMAIL US</h3>
                  </div>
                  <div className="w-12 h-0.5 bg-black mb-4"></div>
                  <div className="space-y-2 text-gray-700 font-light">
                    <p>General Inquiries</p>
                    <p className="text-lg font-medium text-black">aharyasofficial@gmail.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-3xl text-left mb-8">
                <Title text1="JOIN OUR" text2="MISSION" />
              </div>

              <div className="space-y-6 text-gray-700 text-lg leading-loose font-light">
                <p>At Aharyas, we're building more than a brand — we're nurturing a movement that celebrates heritage, empowers artisans, and creates conscious fashion for the world.</p>
                <p>We're looking for passionate individuals who believe in the power of tradition, the beauty of handcraft, and the importance of sustainable fashion. Join our team and help us bridge the gap between India's rich craft heritage and global conscious consumers.</p>
                <p>Whether you're interested in design, technology, marketing, or operations, there's a place for you in our growing family.</p>
              </div>

              <div className="mt-8 space-y-4">
                <button className="bg-black text-white px-8 py-4 font-light tracking-wider hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
                  EXPLORE OPPORTUNITIES
                </button>
                <p className="text-sm text-gray-500 font-light">
                  Send your resume to: careers@aharyas.com
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white shadow-lg p-12 border-l-4 border-black hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-black" size={24} />
                  </div>
                  <h3 className="text-2xl font-light tracking-wider text-black">
                    Why Work With Us?
                  </h3>
                </div>

                <div className="space-y-6 text-gray-700 font-light leading-relaxed">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="font-medium">Meaningful Impact:</strong> Every day, you'll contribute to preserving India's craft heritage and empowering artisan communities.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="font-medium">Growth & Learning:</strong> Work with cutting-edge technology, traditional crafts, and passionate team members.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-3 flex-shrink-0"></div>
                    <p><strong className="font-medium">Creative Freedom:</strong> Bring your ideas to life in an environment that values innovation and authenticity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-white to-stone-50">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Contact;