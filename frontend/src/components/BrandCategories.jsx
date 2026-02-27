import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const BrandCategories = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <section className="py-16 px-4 sm:px-8 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-10">
          <Title text1="OUR" text2="COLLECTIONS" />
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Aharyas Luxury Section */}
          <div className="group relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700">
            <div className="relative h-[100vh] overflow-hidden">
              <img
                src="https://okhai.org/cdn/shop/files/3_72f49daf-b043-48ce-85c9-f33d94346c8c.jpg?v=1716982545"
                alt="Aharyas Luxury Collection"
                className="w-full h-full object-cover filter transition-all duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 group-hover:from-black/50 group-hover:to-black/70 transition-all duration-700"></div>

              <div className="absolute -top-6 -left-6 w-12 h-12 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-8 text-center">
              <div className="mb-8">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] mb-2">
                  AHARYAS
                </h3>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] text-white/90">
                  LUXURY
                </h4>
              </div>

              <div className="max-w-lg mb-12">
                <blockquote className="text-lg font-light leading-relaxed text-white/90 italic mb-6">
                  "Where heritage meets high design"
                </blockquote>
                <p className="text-sm sm:text-base font-light leading-loose text-white/80">
                  Experience a curated selection of handcrafted clothing, décor, and accessories from India's finest artisans. Perfect for those seeking timeless elegance and exceptional craftsmanship.
                </p>
              </div>

              <div className="relative overflow-hidden">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                  <button
                    onClick={() => navigate('shop/special')}
                    className="relative px-12 py-4 bg-white/10 backdrop-blur-sm text-white font-light tracking-[0.1em] border border-white/30 hover:bg-white hover:text-black transition-all duration-500 group/btn"
                  >
                    <span className="relative z-10">EXPLORE LUXURY</span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aharyas Economy Section */}
          <div className="group relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700">
            <div className="relative h-[100vh] overflow-hidden">
              <img
                src="https://okhai.org/cdn/shop/files/OKHAI2024_05_293521-Copy_414x650.jpg?v=1718800303"
                alt="Aharyas Economy Collection"
                className="w-full h-full object-cover filter transition-all duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 group-hover:from-black/50 group-hover:to-black/70 transition-all duration-700"></div>

              <div className="absolute -top-6 -left-6 w-12 h-12 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-8 text-center">
              <div className="mb-8">
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] mb-2">
                  AHARYAS
                </h3>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] text-white/90">
                  ECONOMY
                </h4>
              </div>

              <div className="max-w-lg mb-12">
                <blockquote className="text-lg font-light leading-relaxed text-white/90 italic mb-6">
                  "Everyday elegance meets sustainable craftsmanship"
                </blockquote>
                <p className="text-sm sm:text-base font-light leading-loose text-white/80">
                  Discover affordable, handcrafted clothing, accessories, and décor made by Indian artisans. Thoughtfully designed pieces for modern living with authentic heritage.
                </p>
              </div>

              <div className="relative overflow-hidden">
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                  <button
                    onClick={() => navigate('shop/collection')}
                    className="relative px-12 py-4 bg-white/10 backdrop-blur-sm text-white font-light tracking-[0.1em] border border-white/30 hover:bg-white hover:text-black transition-all duration-500 group/btn"
                  >
                    <span className="relative z-10">EXPLORE ESSENTIALS</span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCategories;