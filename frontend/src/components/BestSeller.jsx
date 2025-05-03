import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col mb-10 items-center text-center gap-2">
          <div>
            <Title text1="BEST" text2="SELLERS" />
            <p className="mt-[-5px] max-w-xl text-gray-600 text-sm md:text-base">
              Discover our most coveted pieces, handpicked for their exceptional quality and timeless design.
            </p>
          </div>
          <Link to="/shop/collection" className="mt-4 md:mt-0 group flex items-center text-sm font-medium hover:text-gray-700 transition-colors">
            View all
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {bestSeller.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-6">
            {bestSeller.map((item, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden">
                <ProductItem 
                  id={item._id} 
                  image={item.images} 
                  name={item.name} 
                  price={item.price}
                />
                {index < 1 && (
                  <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 font-mediu">
                    BESTSELLER
                  </div>
                )}
              </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium">No products available</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for our bestselling items</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;