import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, Trash2 } from 'lucide-react';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Wishlist = () => {
  const { 
    getWishlistProducts, 
    removeFromWishlist, 
    clearWishlist, 
    getWishlistCount,
    navigate,
    currency
  } = useContext(ShopContext);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const wishlistProducts = getWishlistProducts();
  const wishlistCount = getWishlistCount();

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black mt-20">
        <div className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-8">
              <Title text1="MY" text2="WISHLIST" />
            </div>
            
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8 text-center max-w-md">
                Save your favorite items for later by clicking the heart icon on any product.
              </p>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      <div className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between py-8 border-b border-gray-200">
            <div>
              <Title text1="MY" text2="WISHLIST" />
              <p className="text-gray-600 text-sm mt-2">
                {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            {wishlistProducts.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 border border-black hover:text-red-500 hover:border-red-400 transition-all duration-300"
              >
                <Trash2 size={16} />
                <span className="text-sm">Clear All</span>
              </button>
            )}
          </div>

          {/* Wishlist Items (reusing ProductItem) */}
          <div className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  image={product.images}
                  name={product.name}
                  price={product.price}
                  currency={currency}
                />
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center py-8">
            <button
              onClick={() => navigate('/shop/collection')}
              className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            
            <h3 className="text-xl font-medium mb-2">Clear Wishlist</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your wishlist? This action cannot be undone.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 border border-gray-300 text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearWishlist}
                className="flex-1 py-2 bg-black text-white hover:bg-gray-900 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
