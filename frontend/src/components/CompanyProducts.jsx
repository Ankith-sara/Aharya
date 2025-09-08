import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyProducts = () => {
  const { products } = useContext(ShopContext);
  const [bibaProducts, setBibaProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Filter products to show only Biba company products
      const filteredProducts = products.filter(product => 
        product.company && product.company.toLowerCase() === 'biba'
      );
      setBibaProducts(filteredProducts.slice(0, 10)); // Limit to 10 products like other components
    } else {
      setBibaProducts([]);
    }
  }, [products]);

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-10 items-center text-center gap-2">
          <div>
            <Title text1="BIBA" text2="COLLECTION" />
          </div>
          <Link to="/shop/collection" className="mt-4 md:mt-0 group flex items-center text-xs font-medium hover:text-gray-700 transition-colors">
            View all products
            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {bibaProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-6">
            {bibaProducts.map((item, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden">
                  <ProductItem
                    id={item._id}
                    image={item.images}
                    name={item.name}
                    price={item.price}
                  />
                  {index < 1 && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 font-medium">
                      BIBA
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-lg font-medium">No Biba products available</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for new arrivals from Biba</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyProducts;