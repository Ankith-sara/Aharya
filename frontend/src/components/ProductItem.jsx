import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductItem = ({ id, image, name, price, company }) => {
  const { currency, toggleWishlist, isInWishlist, navigate, token } = useContext(ShopContext);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      navigate('/login');
      return;
    }

    setIsWishlistLoading(true);
    try {
      await toggleWishlist(id);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isWishlisted = isInWishlist(id);
  const showCompanyName = company && company.toLowerCase() === 'anemone vinkel';

  return (
    <Link
      className="group cursor-pointer block h-full"
      to={`/product/${id}`}
    >
      <div className="relative h-full flex flex-col">
        <div className="relative">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
              src={image[0]}
              alt={name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
            {image[1] && (
              <img
                className="absolute inset-0 w-full h-full object-contain p-2 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                src={image[1]}
                alt={`${name} alternate view`}
              />
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full shadow-md transition-all duration-300 z-10 ${isWishlisted
                ? 'bg-black text-white opacity-100 transform translate-x-0'
                : 'bg-white/90 hover:bg-white text-gray-700 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={14}
                className={`sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''} transition-all duration-200`}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-1 sm:p-2 flex-grow flex flex-col justify-between bg-white">
          <div className="min-w-0 flex-1">
            {showCompanyName && (
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-medium mb-1 truncate">
                {company}
              </p>
            )}

            <h3 className="text-xs sm:text-sm font-medium text-black mb-1.5 sm:mb-2 tracking-wide leading-relaxed group-hover:text-gray-800 transition-colors duration-300 line-clamp-2 break-words overflow-hidden">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-2 gap-2 min-w-0">
            <p className="text-base sm:text-lg md:text-xl text-black tracking-wide font-medium flex-shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-600 mr-0.5 sm:mr-1">{currency}</span>
              {price}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center text-xs sm:text-sm font-light text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 whitespace-nowrap">
                <span className="tracking-wide">VIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;