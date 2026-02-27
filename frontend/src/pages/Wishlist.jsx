import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, X, Package, Plus, Minus } from 'lucide-react';
import Title from '../components/Title';
import { Link } from 'react-router-dom';

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
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showSizeModal) {
          closeSizeModal();
        }
        if (showDeleteModal) {
          cancelDelete();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSizeModal, showDeleteModal]);

  useEffect(() => {
    document.title = 'Wishlist | Aharyas';
  }, []);

  const handleDeleteClick = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await removeFromWishlist(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize('');
    setQuantity(1);
    setShowSizeModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSizeModal = () => {
    setShowSizeModal(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCartWithSize = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart(selectedProduct._id, selectedSize, quantity);
    await removeFromWishlist(selectedProduct._id);
    closeSizeModal();
  };

  // Check if size is available
  const isSizeAvailable = (size) => {
    const sizeString = String(size).trim();
    return sizeString !== 'N/A' && 
           sizeString.toLowerCase() !== 'out of stock' && 
           sizeString !== '';
  };

  // Sort sizes function
  const sortSizes = (sizes) => {
    return [...sizes].sort((a, b) => {
      const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7 };
      
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      const aOrder = sizeOrder[a.toUpperCase()] || 999;
      const bOrder = sizeOrder[b.toUpperCase()] || 999;
      return aOrder - bOrder;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <span className="text-gray-600 text-sm">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-sm sm:max-w-md w-full animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-medium tracking-wide">Remove from Wishlist</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                Are you sure you want to remove this item from your wishlist?
              </p>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2.5 sm:py-3 border border-gray-300 text-black font-light tracking-wide hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 sm:py-3 bg-white text-black border border-gray-300 font-light tracking-wide hover:bg-red-100 hover:text-red-600 active:bg-red-200 transition-all duration-300 uppercase text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              <Title text1="MY" text2="WISHLIST" />
            </div>
            {wishlistProducts.length > 0 && (
              <p className="text-sm sm:text-base text-gray-500 font-light">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved for later
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="px-4 sm:px-6 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Heart size={24} className="sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-6 sm:mb-8 px-4">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3 tracking-wide">YOUR WISHLIST IS EMPTY</h3>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  Save items you love to your wishlist and never lose track of them
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items in Wishlist:
                      </span>
                      <span className="font-medium text-black tracking-wide">{wishlistProducts.length}</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {wishlistProducts.map((product) => (
                    <div key={product._id} className="p-4 sm:p-6 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300">
                      <div className="flex gap-3 sm:gap-4 lg:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Link to={`/product/${product._id}`}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 cursor-pointer">
                              <img
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                src={product.images?.[0]}
                                alt={product.name}
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="space-y-2 sm:space-y-3">
                            <Link
                              to={`/product/${product._id}`}
                              className="group"
                            >
                              <h3 className="font-medium text-sm sm:text-base lg:text-lg text-black tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="space-y-2">
                              <div className="space-y-0.5">
                                <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  PRICE
                                </span>
                                <span className="font-medium text-black text-sm sm:text-base">
                                  {currency}{product.price}
                                </span>
                              </div>

                              {product.sizes && product.sizes.length > 0 && (
                                <div className="space-y-0.5">
                                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    AVAILABLE SIZES
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {product.sizes.filter(size => isSizeAvailable(size)).slice(0, 5).map((size, index) => (
                                      <span 
                                        key={index} 
                                        className="text-xs bg-gray-100 px-2 py-0.5 text-gray-600 border border-gray-200"
                                      >
                                        {size}
                                      </span>
                                    ))}
                                    {product.sizes.filter(size => isSizeAvailable(size)).length > 5 && (
                                      <span className="text-xs text-gray-500 px-1">
                                        +{product.sizes.filter(size => isSizeAvailable(size)).length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons - Mobile Optimized */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <button
                                onClick={() => openSizeModal(product)}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 uppercase text-xs sm:text-sm"
                              >
                                <ShoppingCart size={14} />
                                ADD TO CART
                              </button>
                              <button
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-xs sm:text-sm"
                              >
                                VIEW DETAILS
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleDeleteClick(product._id)}
                            className="p-2 sm:p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 border border-transparent hover:border-red-200 transition-all duration-300"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center">
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="px-6 sm:px-8 py-3 sm:py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm sm:text-base"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Size Selection Modal - Mobile Optimized */}
      {showSizeModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={closeSizeModal}
        >
          <div 
            className="bg-white w-full sm:max-w-md sm:rounded-sm shadow-2xl overflow-hidden animate-slideUp max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 tracking-wide">Select Size</h3>
              <button
                onClick={closeSizeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Product Info */}
              <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                <img
                  src={selectedProduct.images?.[0]}
                  alt={selectedProduct.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm sm:text-base">{selectedProduct.name}</h4>
                  <p className="text-base sm:text-lg font-medium text-black">{currency}{selectedProduct.price}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                  Choose Size *
                </label>
                <div className="flex flex-wrap gap-2">
                  {sortSizes(selectedProduct.sizes).map((size, index) => {
                    const isAvailable = isSizeAvailable(size);
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`py-2 sm:py-2.5 px-3 sm:px-4 transition-all duration-300 font-light relative text-sm sm:text-base ${
                          selectedSize === size
                            ? 'bg-black text-white shadow-md'
                            : isAvailable
                            ? 'bg-white text-gray-700 border border-gray-300 hover:border-black active:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {size}
                        {!isAvailable && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-px bg-gray-400 rotate-[-25deg] transform origin-center"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-300"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} className={quantity <= 1 ? "text-gray-300" : "text-black"} />
                  </button>
                  <input
                    type="number"
                    className="w-14 sm:w-16 h-9 sm:h-10 text-center focus:outline-none bg-white font-medium text-sm sm:text-base"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setQuantity(value);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sticky bottom-0 bg-white pt-2">
                <button
                  onClick={closeSizeModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 font-light tracking-wide hover:border-gray-400 active:bg-gray-50 transition-colors uppercase text-sm order-2 sm:order-1"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddToCartWithSize}
                  disabled={!selectedSize}
                  className={`w-full sm:flex-1 px-4 sm:px-6 py-3 font-light tracking-wide transition-colors uppercase text-sm order-1 sm:order-2 ${
                    selectedSize
                      ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;