import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link 
      className="group cursor-pointer block" 
      to={`/product/${id}`}
    >
      <div className="relative">
        <div className="relative overflow-hidden">
          <div className="relative h-90 overflow-hidden">
            <img 
              className="w-full h-full object-cover filter transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" 
              src={image[0]} 
              alt={name}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            {image[1] && (
              <img 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" 
                src={image[1]} 
                alt={`${name} alternate view`}
              />
            )}
          </div>
        </div>

        <div className="p-2">
          <h3 className="text-sm font-medium text-black mb-2 tracking-wide leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl text-black tracking-wide">
              <span className="text-sm font-semibold text-gray-600 mr-1">{currency}</span>
              {price}
            </p>
            <div className="flex items-center text-sm font-light text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <span className="tracking-wide">VIEW</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;