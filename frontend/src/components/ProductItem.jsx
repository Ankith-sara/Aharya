import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
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

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 ${isWishlisted
                  ? 'bg-black text-white opacity-100 transform translate-x-0'
                  : 'bg-white/90 hover:bg-white text-gray-700 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className={`${isWishlisted ? 'fill-current' : ''} transition-all duration-200`}
              />
            </button>
          </div>
        </div>

        <div className="p-2">
          <h3 className="text-sm font-medium text-black mb-2 tracking-wide leading-relaxed group-hover:text-gray-800 transition-colors duration-300 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xl text-black tracking-wide">
              <span className="text-sm font-semibold text-gray-600 mr-1">{currency}</span>
              {price}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-sm font-light text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
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