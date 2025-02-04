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
                className="absolute top-0 left-0 right-0 w-full h-full object-cover"
            >
                <source src={assets.hero_vid} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-200 z-10">
                {/* Responsive text size */}
                <h1 className="dancing-script text-[10rem] sm:text-[12rem] md:text-[15rem] lg:text-[15rem] mt-[-100px] text-white-900">
                    Aharya
                </h1>
                <p className='dancing-script text-[2rem] sm:text-[1rem] md:text-[1rem] lg:text-[2rem] text-white-900 mt-[-40px]'>"Reviving Traditions, Redefining Style."</p>
                <p className="absolute bottom-10 text-xs sm:text-sm text-gray-300 animate-bounce">
                    Scroll down to discover more ▼
                </p>
            </div>
        </div>
    );
};

export default Hero;
