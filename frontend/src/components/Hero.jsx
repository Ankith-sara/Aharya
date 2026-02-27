import React, { useEffect, useRef } from "react";

const Hero = () => {
  const lettersRef = useRef([]);
  const brandName = "AHARYAS";

  useEffect(() => {
    lettersRef.current.forEach((letter, index) => {
      setTimeout(() => letter?.classList.add("letter-active"), 180 * index);
    });
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden m-0 p-0 bg-black">
      {/* Background Image */}
      <img
        src="https://i.pinimg.com/736x/58/89/08/588908ca727bc56df82b0538decf2bdc.jpg"
        alt="AHARYAS Hero Background"
        loading="eager"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-200 z-10">
        <div className="relative overflow-hidden">
          <div className="flex overflow-hidden">
            {brandName.split("").map((letter, index) => (
              <span
                key={index}
                ref={(el) => (lettersRef.current[index] = el)}
                className="text-[4rem] md:text-[7rem] lg:text-[9rem] noto-serif-thai relative inline-block transform translate-y-full opacity-0 letter-animation"
              >
                {letter}
              </span>
            ))}
          </div>

          <div className="h-1 bg-white w-0 mx-auto line-animation" />
        </div>

        <p className="text-[1rem] md:text-[1.3rem] lg:text-[1.5rem] mt-6 opacity-0 tagline-animation noto-serif-thai">
          "A Global Market Place for Artisans"
        </p>

        <p className="absolute bottom-10 text-sm text-gray-200 animate-bounce">
          Scroll down to discover more ▼
        </p>
      </div>

      {/* Animations */}
      <style>{`
        .letter-animation {
          transition: transform .8s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity .6s ease;
        }
        .letter-active {
          transform: translateY(0);
          opacity: 1;
          animation: shimmer 2s infinite linear;
          background: linear-gradient(90deg, #fff 0%, #fff8 50%, #fff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
        }
        .line-animation {
          animation: lineExpand 1.5s cubic-bezier(0.19,1,0.22,1) forwards;
          animation-delay: 1.2s;
        }
        .tagline-animation {
          animation: fadeIn 1.2s ease forwards;
          animation-delay: 1.8s;
        }

        @keyframes lineExpand {
          0% { width: 0 }
          100% { width: 100% }
        }
        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }
        @keyframes shimmer {
          0% { background-position: -100% 0 }
          100% { background-position: 100% 0 }
        }
      `}</style>
    </div>
  );
};

export default Hero;