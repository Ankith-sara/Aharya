import React, { useEffect } from 'react';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { CheckCircle } from "lucide-react";
import OurPolicy from '../components/OurPolicy';
import Title from '../components/Title';

const About = () => {
  useEffect(() => {
    document.title = 'About Aharyas | Aharayas'
  })

  return (
    <div className="min-h-screen text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-16">
      <div className="text-center mb-10">
        <Title text1="ABOUT" text2="US" />
      </div>

      {/* Main About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-xl uppercase tracking-widest font-medium mb-6">Our Heritage</h2>
          <div className="space-y-3 text-gray-700">
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
              masterful wood carving and metal work.
            </p>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative">
            <img className="w-full object-cover" src={assets.about_img} alt="About Aharya" />
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="mb-20 bg-gray-50 py-20 px-6 md:px-12 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Title text1="OUR" text2="STORY" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-3 text-gray-700">
              <p> Aharya began in 2023 when our founder, Avani Reddy, traveled through rural India and was captivated by the incredible craftsmanship she witnessed in small villages and communities. Driven by a desire to share these treasures with the world while supporting the artisans behind them, Aharya was born.</p>
              <p> What started as a small collection of handwoven textiles has blossomed into a vibrant marketplace featuring over 500 artisans from 18 states across India. Each partnership represents a commitment to fair trade, sustainable practices, and the preservation of techniques that have been passed down through generations.</p>
              <p> Our journey hasn't been without challenges. From navigating supply chains that prioritize artisan welfare to educating consumers about the value of handcrafted goods, we've remained steadfast in our mission. Today, Aharya stands as a bridge between traditional craftsmanship and contemporary design, proving that heritage and innovation can coexist beautifully.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img
                  className="w-full h-52 object-cover"
                  src={assets.story_img1 || "https://via.placeholder.com/200x200"}
                  alt="Artisan at work"
                />
                <img
                  className="w-full h-52 object-cover"
                  src={assets.story_img2 || "https://via.placeholder.com/200x200"}
                  alt="Handloom weaving"
                />
              </div>
              <div className="space-y-6 mt-12">
                <img
                  className="w-full h-52 object-cover"
                  src={assets.story_img3 || "https://via.placeholder.com/200x200"}
                  alt="Traditional craft"
                />
                <img
                  className="w-full h-52 object-cover"
                  src={assets.story_img4 || "https://via.placeholder.com/200x200"}
                  alt="Product showcase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision Section */}
      <div className="mb-10">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="border border-gray-200 p-10 hover:border-black transition-all duration-300">
            <h3 className="text-lg uppercase tracking-widest font-medium mb-6">Our Mission</h3>
            <ul className="space-y-6 text-gray-700">
              {[
                "Empowering artisans by connecting master craftspeople with a global audience",
                "Celebrating India's artistic legacy through meticulously crafted products",
                "Promoting sustainability with a focus on quality and authenticity",
                "Reimagining heritage crafts for contemporary living"
              ].map((item, index) => (
                <li key={index} className="flex">
                  <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mr-4" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-gray-200 hover:border-black transition-all duration-300">
            <div className="p-10">
              <h3 className="text-lg uppercase tracking-widest font-medium mb-6">Our Vision</h3>
              <p className="text-gray-700 mb-6">
                To establish Aharya as a global destination for Indian heritage, creating a world where
                tradition is cherished, artisans are celebrated, and craftsmanship thrives. Every piece is a
                tribute to India's rich legacy, designed to inspire and make a difference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Gallery Section */}
      <div className="mb-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            OUR <span className="font-bold">ARTISANS</span>
          </h2>
          <div className="h-1 w-16 bg-black mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Meet the skilled hands behind our collections. Our artisans represent diverse traditions from across India, each bringing generations of expertise to every piece they create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <div key={index} className="group border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src={artisan.image} alt={artisan.name} />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium mb-1">{artisan.name}</h3>
                <p className="text-gray-600 text-sm uppercase tracking-wider">{artisan.craft} | {artisan.region}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Policies Section */}
      <div className="mb-10">
        <OurPolicy />
      </div>

      {/* Our Process Section with Image Timeline */}
      <div className="mb-10">
        <div className="text-center mb-10">
          <Title text1="OUR" text2="PROCESS" />
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>
          {[
            {
              title: "Sourcing",
              description: "We travel to remote villages to find authentic crafts and connect with skilled artisans.",
              image: assets.sourcing_img || "https://via.placeholder.com/600x400"
            },
            {
              title: "Collaboration",
              description: "We work closely with artisans to develop products that honor tradition while appealing to modern tastes.",
              image: assets.collaboration_img || "https://via.placeholder.com/600x400"
            },
            {
              title: "Creation",
              description: "Each piece is handcrafted using traditional techniques, often taking days or weeks to complete.",
              image: assets.creation_img || "https://via.placeholder.com/600x400"
            },
            {
              title: "Quality Control",
              description: "We carefully inspect each item to ensure it meets our high standards of craftsmanship.",
              image: assets.quality_img || "https://via.placeholder.com/600x400"
            }
          ].map((step, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center mb-24 relative ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              {/* Timeline Circle */}
              <div className="hidden md:block absolute left-1/2 top-24 w-6 h-6 rounded-full bg-white border-2 border-black transform -translate-x-1/2 z-10"></div>

              {/* Image Section */}
              <div className="md:w-1/2 px-6 relative">
                <div className="relative">
                  <div className="absolute inset-0 border border-black transform translate-x-4 translate-y-4"></div>
                  <img src={step.image} alt={step.title} className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700 relative z-10" />
                </div>
              </div>

              {/* Content Section */}
              <div className={`md:w-1/2 px-6 mt-8 md:mt-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}>
                <h3 className="text-xl uppercase tracking-wider font-medium mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-50 py-10 px-6 md:px-12 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-20">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;