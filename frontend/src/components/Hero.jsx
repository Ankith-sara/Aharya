import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Hero = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden m-0 p-0">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src={assets.hero_vid} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-200 z-10">
                {/* Responsive text size */}
                <h1 className="text-[6rem] sm:text-[6rem] md:text-[9rem] lg:text-[12rem] text-white">
                    Aharyas
                </h1>
                <p className="text-[1.2rem] sm:text-[1.2rem] md:text-[1.5rem] lg:text-[2rem] text-white mt-[-20px]">
                    "A Global Market Place for Artisans"
                </p>
                <p className="absolute bottom-10 text-xs sm:text-sm text-gray-300 animate-bounce">
                    Scroll down to discover more ▼
                </p>
            </div>
        </div>
    );
};

export default Hero;
