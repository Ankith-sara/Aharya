import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import Title from './Title';

const OurPolicy = () => {
  const policies = [
    {
      img: assets.exchange_icon,
      title: 'Easy Exchange Policy',
      description: 'We offer a hassle-free exchange policy to ensure satisfaction.',
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
    {
      img: assets.security_icon,
      title: 'Secure Shopping Guarantee',
      description: 'Your transactions are protected with advanced security measures.',
    },
  ];

  return (
    <div className="bg-primary py-5 px-4 md:px-10">
      <div className="text-center py-8 text-3xl text-text">
        <Title text1="Why Shop with" text2="Us?" />
        <p className="w-full sm:w-3/4 m-auto text-sm md:text-base text-text-light">
        Experience seamless shopping with our customer-first policies designed for your convenience.
        </p>
      </div>

      <div className="grid gap-4 px-4 sm:px-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-center">
        {policies.map((policy, index) => (
          <div key={index} className="flex flex-col gap-4 p-8 bg-primary text-text border-secondary border-2 shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-2xl hover:border-accent">
            <img className="w-16 h-16 mx-auto mb-2 object-contain" src={policy.img} alt={policy.title} />
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