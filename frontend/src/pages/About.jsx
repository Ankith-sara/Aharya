import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  return (
    <div className="min-h-screen m-20 px-6 py-10 bg-primary">
      <div className="text-3xl text-text text-center">
        <Title text1="About" text2="Us" />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12 items-center">
        <img className="w-full max-w-[400px] rounded-lg shadow-lg" src={assets.about_img} alt="About Us" />
        <div className="flex flex-col gap-6 text-text md:max-w-[600px]">
          <p>
            At Aharya, we bring India's vibrant traditions to life through a curated collection of
            handcrafted clothing, toys, baskets, décor, and more. We are not just a brand—we are a
            movement to celebrate the artistry of Indian craftsmanship while blending it seamlessly
            with contemporary living.
          </p>
          <p>
            Our name, Aharya, embodies elegance and authenticity, symbolizing our commitment to
            preserving cultural heritage while innovating for modern lifestyles. Each product tells
            a story—of skilled hands, timeless traditions, and a vision for a more mindful,
            sustainable world.
          </p>
          <b className="text-xl text-secondary">Our Mission</b>
          <p>
            1. Empowering Artisans: Connecting master craftspeople with a global audience, providing
            them with fair opportunities and recognition. <br />
            2. Celebrating Craftsmanship: Honoring India's artistic legacy through intricate
            handlooms and meticulously crafted products. <br />
            3. Promoting Sustainability: Encouraging mindful consumption with a focus on quality,
            authenticity, and lasting value. <br />
            4. Blending Tradition with Modernity: Reimagining heritage crafts for today’s homes,
            wardrobes, and lifestyles.
          </p>
          <b className="text-xl text-secondary">Our Vision</b>
          <p>
            To establish Aharya as a global destination for Indian heritage, creating a world where
            tradition is cherished, artisans are celebrated, and craftsmanship thrives. At Aharya,
            every piece is a tribute to India's rich legacy, designed to inspire, delight, and make
            a difference. Step into a world where heritage meets innovation, and together, let's
            craft a better tomorrow.
          </p>
        </div>
      </div>
      <div className="text-center text-text text-3xl my-12">
        <Title text1="Why" text2="Choose Us" />
      </div>
      <div className="flex flex-col md:flex-row gap-8 text-sm">
        {[
          { title: 'Quality Assurance', content: 'Our products are crafted with care, ensuring the finest quality and durability.' },
          { title: 'Convenience',  content: 'We provide a seamless shopping experience with curated collections and easy navigation.' },
          { title: 'Exceptional Customer Service', content: 'Our team is dedicated to providing you with the best support and assistance at all times.' },
        ].map((item, index) => (
          <div key={index} className="border p-6 bg-background text-text border-secondary rounded-lg shadow-lg flex-1 hover:scale-105 transition-transform" >
            <b className="text-lg text-secondary">{item.title}</b>
            <p className="text-text mt-4">{item.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;