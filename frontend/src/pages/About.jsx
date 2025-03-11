import React, { useEffect, useRef, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import NewsletterBox from '../components/NewsletterBox';

const About = () => {
  const scrollRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const videosPerPage = 4;

  const videos = [
    { video: "https://cdn.shopify.com/videos/c/o/v/fd1d3228b14a46a8ab9cf98d7644de90.mp4", image: "https://okhai.org/cdn/shop/files/abcd_99d512d1-7752-4dca-bd6c-e71e0d98139c.jpg?v=1717139293" },
    { video: "https://cdn.shopify.com/videos/c/o/v/fd1d3228b14a46a8ab9cf98d7644de90.mp4", image: "https://okhai.org/cdn/shop/files/2_905742eb-9fd5-4812-9adc-019467a693a4.jpg?v=1717075008" },
    { video: "https://cdn.shopify.com/videos/c/o/v/e5c75f1cccfe461bbbaf1596ed6f6e93.mp4", image: "https://okhai.org/cdn/shop/files/Website_video_cover_9.jpg?v=1717074392" },
    { video: "https://cdn.shopify.com/videos/c/o/v/3d53794e362a4a48935236d8417b7b7a.mp4", image: "https://okhai.org/cdn/shop/files/11_fb19558a-2cbc-43a6-9ece-5a8167327e41.jpg?v=1717074505" },
    { video: "https://cdn.shopify.com/videos/c/o/v/815f45ef2a194964915d7cbf3c0fd917.mp4", image: "https://okhai.org/cdn/shop/files/4_4c3d5560-9929-4aa3-98ea-7308400648d3.jpg?v=1717074607" },
    { video: "https://cdn.shopify.com/videos/c/o/v/96b5ebb5133d4d2e8e9234c29028da5a.mp4", image: "https://okhai.org/cdn/shop/files/9_b65e0850-ad23-4ddd-9134-1c6e4978ad3a.jpg?v=1717074727" },
    { video: "https://cdn.shopify.com/videos/c/o/v/5b5ac6ebace54f98b6b182bf010a0d8e.mp4", image: "https://okhai.org/cdn/shop/files/6_30d3ac88-1ebc-4266-b286-09e49e8657ca.jpg?v=1717074927" },
    { video: "https://cdn.shopify.com/videos/c/o/v/1cf28b97a88c4bd8b7b2d22b310cbb9b.mp4", image: "https://okhai.org/cdn/shop/files/10_cf6822f4-6768-447a-ad7e-ce55ba28b7c8.jpg?v=1717074830" }
  ];

  const totalPages = Math.ceil(videos.length / videosPerPage);

  // Handle scrolling left/right
  const scroll = (direction) => {
    if (direction === 'left' && scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    } else if (direction === 'right' && scrollIndex < totalPages - 1) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  const [playingVideo, setPlayingVideo] = useState({});

  const playVideo = (index) => {
    setPlayingVideo((prev) => ({ ...prev, [index]: true }));
  };


  return (
    <div className="min-h-screen m-20 px-6 py-10 bg-primary">
      <div className="text-3xl text-text text-center">
        <Title text1="About" text2="Us" />
      </div>

      <div className="my-4 flex flex-col md:flex-row gap-12 items-center">
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

      {/* What We Do Section */}
      <div className="text-center text-text text-3xl mt-16 mb-4">
        <Title text1="What" text2="We Do?" />
      </div>

      <div className="relative flex items-center justify-center">
        {/* Left Scroll Button */}
        <button
          className={`absolute left-0 bg-secondary text-white p-3 rounded-full shadow-md transition-opacity ${scrollIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-80'
            }`}
          onClick={() => scroll('left')}
          disabled={scrollIndex === 0}
        >
          ❮
        </button>

        {/* Video Grid */}
        <div ref={scrollRef} className="flex space-x-6 overflow-hidden w-[90%]">
          {videos.slice(scrollIndex * videosPerPage, (scrollIndex + 1) * videosPerPage).map((item, index) => (
            <div key={index} className="relative w-[320px] h-[420px] rounded-lg shadow-lg hover:scale-105 transition-transform">
              {!playingVideo[index] ? (
                <img
                  src={item.image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                  onClick={() => playVideo(index)}
                />
              ) : (
                <video
                  src={item.video}
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                ></video>
              )}
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className={`absolute right-0 bg-secondary text-white p-3 rounded-full shadow-md transition-opacity ${scrollIndex === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-opacity-80'
            }`}
          onClick={() => scroll('right')}
          disabled={scrollIndex === totalPages - 1}
        >
          ❯
        </button>
      </div>

      <div className="text-center text-text text-3xl mt-16 mb-4">
        <Title text1="Why" text2="Choose Us" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 text-sm">
        {[
          { title: 'Quality Assurance', content: 'Our products are crafted with care, ensuring the finest quality and durability.' },
          { title: 'Convenience', content: 'We provide a seamless shopping experience with curated collections and easy navigation.' },
          { title: 'Exceptional Customer Service', content: 'Our team is dedicated to providing you with the best support and assistance at all times.' },
        ].map((item, index) => (
          <div key={index} className="border p-6 bg-background text-text border-secondary rounded-lg shadow-lg flex-1 hover:scale-105 transition-transform">
            <b className="text-lg text-secondary">{item.title}</b>
            <p className="text-text mt-4">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;