import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import Title from './Title';

const OurPolicy = () => {
  const policies = [
    {
      img: assets.exchange_icon,
      title: 'EASY EXCHANGE',
      description: 'We offer a hassle-free exchange policy to ensure your complete satisfaction.',
    },
    {
      img: assets.quality_icon,
      title: '7 DAYS RETURN',
      description: 'Enjoy a 7-day return window with no questions asked and no extra charges.',
    },
    {
      img: assets.support_img,
      title: '24/7 SUPPORT',
      description: 'Our dedicated support team is available around the clock to assist you with any concerns.',
    },
    {
      img: assets.security_icon,
      title: 'SECURE SHOPPING',
      description: 'Your transactions are protected with advanced security measures for peace of mind.',
    },
  ];

  return (
    <div className="py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Title text1="WHY SHOP WITH" text2="US?" />
          <p className="max-w-2xl mx-auto text-gray-600">
            Experience exceptional service with our customer-first policies designed for your convenience and peace of mind.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {policies.map((policy, index) => (
            <div key={index} className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-300">
              {/* Card Content */}
              <div className="flex flex-col p-8 h-full">
                {/* Icon with Circle Background */}
                <div className="mb-6 relative mx-auto">
                  <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-black transition-colors duration-300 flex items-center justify-center">
                    <img
                      className="w-10 h-10 object-contain grayscale group-hover:invert transition-all duration-300"
                      src={policy.img}
                      alt={policy.title}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium tracking-widest text-black mb-4">
                  {policy.title}
                </h3>

                {/* Divider Line */}
                <div className="h-px w-8 bg-gray-300 mx-auto mb-4 group-hover:bg-black transition-colors duration-300"></div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  {policy.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;