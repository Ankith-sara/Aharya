import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';


const BrandCategories = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <div className="w-full py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="flex flex-wrap md:flex-nowrap gap-6">

        {/* Aharyas Luxury Section */}
        <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden group">
          <img
            src="https://okhai.org/cdn/shop/files/3_72f49daf-b043-48ce-85c9-f33d94346c8c.jpg?v=1716982545"
            alt="Aharyas Luxury Collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white transition-opacity duration-500 group-hover:bg-opacity-50 px-4 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wider mb-4">AHARYAS</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide mb-6">LUXURY</h3>
            <div className="overflow-hidden">
              <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <button onClick={() => navigate('shop/special')} className="px-6 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  EXPLORE COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aharyas Economy Section */}
        <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden group">
          <img
            src="https://okhai.org/cdn/shop/files/OKHAI2024_05_293521-Copy_414x650.jpg?v=1718800303"
            alt="Aharyas Economy Collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white transition-opacity duration-500 group-hover:bg-opacity-50 px-4 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wider mb-4">AHARYAS</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide mb-6">ECONOMY</h3>
            <div className="overflow-hidden">
              <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <button onClick={() => navigate('shop/collection')} className="px-6 py-3 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                  EXPLORE COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCategories;