import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const OurPolicy = () => {
  return (
    <div className="my-10 mx-20 bg-primary py-5 px-10 rounded-lg shadow-lg">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-secondary">Why Shop With Us?</h2>
        <p className="text-text-light mt-2 text-sm md:text-base">
          Experience seamless shopping with our customer-first policies designed for your convenience.
        </p>
      </div>

      {/* Policy Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 text-center gap-8 mb-16 px-10">
        {[
          {
            img: assets.exchange_icon,
            title: 'Easy Exchange Policy',
            description: 'We offer a hassle-free exchange policy to ensure complete satisfaction.',
          },
          {
            img: assets.quality_icon,
            title: '7 Days Return Policy',
            description: 'Enjoy a 7-day return window with no extra charges.',
          },
          {
            img: assets.support_img,
            title: '24/7 Customer Support',
            description: 'Our support team is available around the clock to assist you.',
          },
        ].map((policy, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-8 bg-primary text-text border-secondary border-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:border-accent"
          >
            <img
              className="w-20 h-20 mx-auto mb-4 object-contain"
              src={policy.img}
              alt={policy.title}
            />
            <b className="text-xl font-semibold text-secondary">{policy.title}</b>
            <p className="text-sm text-text opacity-80">{policy.description}</p>
            <button className="bg-primary border-2 border-secondary text-secondary font-medium text-sm px-6 py-3 rounded-md hover:bg-secondary hover:text-primary transition-all duration-300">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;