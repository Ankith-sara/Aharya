import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Title from '../components/Title';

const Wishlist = () => {
  const { 
    products, 
    currency, 
    wishlistItems, 
    removeFromWishlist, 
    addToCart,
    navigate,
    token 
  } = useContext(ShopContext) || {};

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter products that are in wishlist
  useEffect(() => {
    if (products && wishlistItems) {
      const filteredProducts = products.filter(product => 
        wishlistItems.includes(product._id)
      );
      setWishlistProducts(filteredProducts);
      setLoading(false);
    }
  }, [products, wishlistItems]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
  };

  const handleAddToCart = (productId, defaultSize) => {
    // Add first available size as default
    const product = products.find(p => p._id === productId);
    const size = product?.sizes?.[0] || defaultSize || 'M';
    addToCart(productId, size, 1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <span className="text-gray-600">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Title text1="MY" text2="WISHLIST" />
          <p className="text-gray-600 mt-2">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {/* Empty Wishlist */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <Heart size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Save items you love to your wishlist and never lose track of them.
              </p>
              <button
                onClick={() => navigate('/shop/collection')}
                className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div 
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(product._id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors group opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Heart size={16} className="text-red-500 fill-current" />
                  </button>

                  {/* Quick view overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 
                    className="font-medium text-gray-900 mb-1 cursor-pointer hover:text-gray-600 transition-colors line-clamp-2"
                    onClick={() => handleProductClick(product._id)}
                  >
                    {product.name}
                  </h3>
                  
                  <p className="text-lg font-medium text-black mb-3">
                    {currency}{product.price}
                  </p>

                  {/* Available Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-xs text-gray-500">+{product.sizes.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 font-medium hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      ADD TO CART
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {wishlistProducts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/shop/collection')}
              className="bg-white text-black border border-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;