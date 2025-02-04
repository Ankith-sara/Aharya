import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const Contact = () => {
  return (
    <div className="m-20 p-5 bg-primary">
      <div className="text-center text-3xl pt-10 border-secondary">
        <Title text1={'Contact'} text2={'Us'} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img className="w-full md:max-w-[480px] rounded-lg shadow-md" src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-secondary">Our Store</p>
          <p className="text-text leading-6">
            37-72/7/4 JJ Nagar Sanikipuri, Malkajgiri, Hyderabad<br />
            Pin: 500064
          </p>
          <p className="text-text leading-6">
            Tel: +91 1234567890 <br />
            Email: aharya@gmail.com
          </p>
          <p className="font-semibold text-xl text-secondary">Careers at Aharya</p>
          <p className="text-text">Learn more about our teams and job openings.</p>
          <button className="border border-secondary px-8 py-4 text-sm text-secondary hover:bg-secondary hover:text-primary transition-all duration-500 rounded">
            Explore Jobs
          </button>
        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;