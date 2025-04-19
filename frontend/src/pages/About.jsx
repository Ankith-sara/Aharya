import React, { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { CheckCircle, ShoppingCart, Headset } from "lucide-react";
import OurPolicy from '../components/OurPolicy';

const About = () => {
  return (
    <div className="min-h-screen mt-20 mb-10 mx-4 sm:mx-8 md:mx-20 px-6 py-10 bg-primary">
      {/* About Us Header */}
      <div className="text-3xl text-text text-center">
        <Title text1="About" text2="Us" />
      </div>

      {/* Main About Section */}
      <div className="my-4 flex flex-col md:flex-col lg:flex-row gap-12 items-center">
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
          <p>
            We partner directly with over 200 artisan families across rural India, ensuring fair
            compensation and sustainable livelihoods. Through these collaborations, we're preserving
            techniques that date back centuries—from intricate block printing and hand embroidery to
            masterful wood carving and metal work. By bringing these treasures to a global audience,
            we're not only safeguarding India's cultural legacy but also creating economic opportunities
            that allow these art forms to thrive for generations to come. When you choose Aharya, you're
            not just purchasing a product; you're becoming part of a meaningful journey that honors
            tradition while embracing the future.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="my-16">
        <div className="text-3xl text-text text-center mb-4">
          <Title text1="Our" text2="Story" />
        </div>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex flex-col gap-6 text-text md:max-w-[600px] order-2 md:order-1">
            <p> Aharya began in 2023 when our founder, Avani Reddy, traveled through rural India and was captivated by the incredible craftsmanship she witnessed in small villages and communities. Driven by a desire to share these treasures with the world while supporting the artisans behind them, Aharya was born. </p>
            <p> What started as a small collection of handwoven textiles has blossomed into a vibrant marketplace featuring over 500 artisans from 18 states across India. Each partnership represents a commitment to fair trade, sustainable practices, and the preservation of techniques that have been passed down through generations. </p>
            <p> Our journey hasn't been without challenges. From navigating supply chains that prioritize artisan welfare to educating consumers about the value of handcrafted goods, we've remained steadfast in our mission. Today, Aharya stands as a bridge between traditional craftsmanship and contemporary design, proving that heritage and innovation can coexist beautifully. </p>
          </div>
          <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
            <img className="rounded-lg shadow-lg h-40 object-cover" src={assets.story_img1 || "https://via.placeholder.com/200x200"} alt="Artisan at work" />
            <img className="rounded-lg shadow-lg h-40 object-cover" src={assets.story_img2 || "https://via.placeholder.com/200x200"} alt="Handloom weaving" />
            <img className="rounded-lg shadow-lg h-40 object-cover" src={assets.story_img3 || "https://via.placeholder.com/200x200"} alt="Traditional craft" />
            <img className="rounded-lg shadow-lg h-40 object-cover" src={assets.story_img4 || "https://via.placeholder.com/200x200"} alt="Product showcase" />
          </div>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div className="my-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-background p-8 shadow-lg">
            <h3 className="text-xl text-secondary font-bold mb-4">Our Mission</h3>
            <ul className="list-disc pl-5 space-y-3 text-text">
              <li>Empowering Artisans: Connecting master craftspeople with a global audience, providing them with fair opportunities and recognition.</li>
              <li>Celebrating Craftsmanship: Honoring India's artistic legacy through intricate handlooms and meticulously crafted products.</li>
              <li>Promoting Sustainability: Encouraging mindful consumption with a focus on quality, authenticity, and lasting value.</li>
              <li>Blending Tradition with Modernity: Reimagining heritage crafts for today's homes, wardrobes, and lifestyles.</li>
            </ul>
          </div>

          <div className="bg-background p-8 shadow-lg">
            <h3 className="text-xl text-secondary font-bold mb-4">Our Vision</h3>
            <p className="text-text">
              To establish Aharya as a global destination for Indian heritage, creating a world where
              tradition is cherished, artisans are celebrated, and craftsmanship thrives. At Aharya,
              every piece is a tribute to India's rich legacy, designed to inspire, delight, and make
              a difference. Step into a world where heritage meets innovation, and together, let's
              craft a better tomorrow.
            </p>
            <img className="w-full shadow-lg mt-6 max-h-48 object-cover" src={assets.vision_img || "https://via.placeholder.com/600x300"} alt="Vision" />
          </div>
        </div>
      </div>

      {/* Artisan Gallery Section */}
      <div className="my-16">
        <div className="text-3xl text-text text-center mb-4">
          <Title text1="Our" text2="Artisans" />
        </div>
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <p className="text-text">
            Meet the skilled hands behind our collections. Our artisans represent diverse traditions from across India, each bringing generations of expertise to every piece they create.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Rajesh Kumar",
              craft: "Block Printing",
              region: "Rajasthan",
              image: assets.artisan1 || "https://via.placeholder.com/300x400"
            },
            {
              name: "Lakshmi Devi",
              craft: "Ikat Weaving",
              region: "Telangana",
              image: assets.artisan2 || "https://via.placeholder.com/300x400"
            },
            {
              name: "Mohammed Farooq",
              craft: "Brass Work",
              region: "Uttar Pradesh",
              image: assets.artisan3 || "https://via.placeholder.com/300x400"
            }
          ].map((artisan, index) => (
            <div key={index} className="bg-background rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <img className="w-full h-64 object-cover" src={artisan.image} alt={artisan.name} />
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary">{artisan.name}</h3>
                <p className="text-text">{artisan.craft} | {artisan.region}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="flex flex-col md:flex-row text-sm">
        <OurPolicy />
      </div>

      {/* Our Process Section with Image Timeline */}
      <div className="my-16">
        <div className="text-3xl text-text text-center mb-8">
          <Title text1="Our" text2="Process" />
        </div>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-secondary transform -translate-x-1/2"></div>
          {[
            {
              title: "Sourcing",
              description: "We travel to remote villages to find authentic crafts and connect with skilled artisans.",
              image: assets.sourcing_img
            },
            {
              title: "Collaboration",
              description: "We work closely with artisans to develop products that honor tradition while appealing to modern tastes.",
              image: assets.collaboration_img
            },
            {
              title: "Creation",
              description: "Each piece is handcrafted using traditional techniques, often taking days or weeks to complete.",
              image: assets.creation_img
            },
            {
              title: "Quality Control",
              description: "We carefully inspect each item to ensure it meets our high standards of craftsmanship.",
              image: assets.quality_img
            }
          ].map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center mb-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2 p-4">
                <img src={step.image} alt={step.title} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              </div>
              <div className={`md:w-1/2 p-6 bg-background rounded-lg shadow-lg mt-4 md:mt-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-xl text-secondary font-bold mb-2">{step.title}</h3>
                <p className="text-text">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;