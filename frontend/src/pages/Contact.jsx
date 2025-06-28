import React, { useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { MapPin, Phone, Mail, Briefcase } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Customer Service | Aharyas'
  })

  return (
    <div className="min-h-screen bg-white text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-6">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Left column - Image */}
        <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <img
            className="w-full h-full object-cover object-center"
            src={assets.contact_img}
            alt="Our Store"
          />
        </div>

        {/* Right column - Contact Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-xl">Contact Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <MapPin size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-medium text-base mb-2">Address:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Sanikipuri, Malkajgiri, Hyderabad<br />
                    Pin: 500064
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Phone size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-medium text-base mb-2">Phone:</p>
                  <p className="text-gray-700">+91 9063284008</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Mail size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-medium text-base mb-2">Email:</p>
                  <p className="text-gray-700">aharya@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <Briefcase size={20} className="text-gray-700" />
              <h3 className="font-medium text-lg">Careers at Aharya</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">Learn more about our teams and job openings. Join our growing family and be part of our journey.</p>
              <button className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors">
                EXPLORE JOBS
              </button>
            </div>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;