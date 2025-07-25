import React, { useEffect, useRef } from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Hero = () => {
  const lettersRef = useRef([]);

  useEffect(() => {
    // Animation for letters
    const letters = lettersRef.current;
    if (letters.length > 0) {
      letters.forEach((letter, index) => {
        setTimeout(() => {
          letter.classList.add('letter-active');
        }, 200 * index);
      });
    }
  }, []);

  const brandName = "AHARYAS";

  return (
    <div className="relative w-full h-screen overflow-hidden m-0 p-0">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover bg-black"
      >
        <source src="https://res.cloudinary.com/dfzhqsfp7/video/upload/v1751705180/hero_nrnwhy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-200 z-10">
        {/* Animated brand name */}
        <div className="relative overflow-hidden">
          <div className="flex overflow-hidden">
            {brandName.split('').map((letter, index) => (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="text-[4rem] sm:text-[4rem] md:text-[7rem] lg:text-[9rem] noto-serif-thai relative inline-block transform translate-y-full opacity-0 letter-animation"
              >
                {letter}
              </span>
            ))}
          </div>
          <div className="h-1 bg-white w-0 mx-auto line-animation"></div>
        </div>

        <p className="text-[1rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.5rem] mt-6 noto-serif-thai opacity-0 tagline-animation">
          "A Global Market Place for Artisans"
        </p>
        <p className="absolute bottom-10 text-sm sm:text-md text-gray-200 animate-bounce">
          Scroll down to discover more ▼
        </p>
      </div>

      {/* CSS for animations */}
      <style>{`
        .letter-animation {
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.6s ease;
        }
        
        .letter-active {
          transform: translateY(0);
          opacity: 1;
        }
        
        .line-animation {
          animation: lineExpand 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 1.2s;
        }
        
        .tagline-animation {
          animation: fadeIn 1s ease forwards;
          animation-delay: 1.8s;
        }
        
        @keyframes lineExpand {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        /* Add a subtle shimmer effect for luxury feel */
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        
        .letter-active {
          background: linear-gradient(
            90deg, 
            rgba(255,255,255,1) 0%, 
            rgba(255,255,255,0.8) 50%, 
            rgba(255,255,255,1) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 2s infinite linear;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default Hero;