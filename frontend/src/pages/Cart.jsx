import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Trash2, ShoppingBag, Package, X, Plus, Minus } from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const handleDeleteClick = (id, size) => {
    setItemToDelete({ id, size });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, itemToDelete.size, 0);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, size, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!token) {
      sessionStorage.setItem('returnUrl', '/cart');
      navigate('/login');
      return;
    }
    navigate('/place-order');
  };

  useEffect(() => {
    document.title = 'Cart | Aharyas'
  }, []);

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-sm sm:max-w-md w-full animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-medium tracking-wide">Remove Item</h3>
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
                Are you sure you want to remove this item from your cart?
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

      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              <Title text1="SHOPPING" text2="CART" />
            </div>
            {cartData.length > 0 && (
              <p className="text-sm sm:text-base text-gray-500 font-light">
                Review your {cartData.length} item{cartData.length !== 1 ? 's' : ''} before checkout
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          {cartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <ShoppingBag size={24} className="sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-6 sm:mb-8 px-4">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3 tracking-wide">YOUR CART IS EMPTY</h3>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  Discover our amazing collection and add your favorite items to get started
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
            <div className="grid xl:grid-cols-[2fr_1fr] gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 shadow-sm">
                  <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items in Cart:
                        </span>
                        <span className="font-medium text-black tracking-wide">{cartData.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {cartData.map((item, index) => {
                      const productData = products.find(
                        (product) => product._id === item._id
                      );

                      if (!productData) {
                        return (
                          <div key={index} className="p-4 sm:p-6 text-center text-gray-500 bg-red-50 border-l-4 border-red-200">
                            <p className="font-medium text-sm sm:text-base">Product not found or unavailable</p>
                            <p className="text-xs sm:text-sm font-light">This item may have been removed from our catalog</p>
                          </div>
                        );
                      }

                      return (
                        <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300">
                          <div className="flex gap-3 sm:gap-4 lg:gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <Link to={`/product/${item._id}`}>
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
                                  <img
                                    className="w-full h-full object-contain"
                                    src={productData.images[0]}
                                    alt={productData.name}
                                  />
                                </div>
                              </Link>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="space-y-2 sm:space-y-3">
                                <Link
                                  to={`/product/${item._id}`}
                                  className="group"
                                >
                                  <h3 className="font-medium text-sm sm:text-base lg:text-lg text-black tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
                                    {productData.name}
                                  </h3>
                                </Link>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                  <div className="space-y-0.5">
                                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      PRICE
                                    </span>
                                    <span className="font-medium text-black text-sm sm:text-base">
                                      {currency}{productData.price}
                                    </span>
                                  </div>

                                  <div className="space-y-0.5">
                                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      SIZE
                                    </span>
                                    <span className="font-medium text-black text-sm sm:text-base">{item.size}</span>
                                  </div>
                                </div>

                                {/* Quantity Controls - Mobile Optimized */}
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    QTY:
                                  </span>
                                  <div className="flex items-center border border-gray-300 bg-white">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-300"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus size={14} className={item.quantity <= 1 ? "text-gray-300" : "text-black"} />
                                    </button>
                                    <input
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        handleQuantityChange(item._id, item.size, value);
                                      }}
                                      className="w-12 sm:w-14 h-8 sm:h-9 text-center focus:outline-none focus:bg-gray-50 font-medium text-sm"
                                      type="number"
                                      min={1}
                                      value={item.quantity}
                                    />
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-300"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>

                                {/* Subtotal */}
                                <div className="pt-1 border-t border-gray-100">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      SUBTOTAL
                                    </span>
                                    <span className="font-medium text-black text-base sm:text-lg">
                                      {currency}{(productData.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="flex-shrink-0">
                              <button
                                onClick={() => handleDeleteClick(item._id, item.size)}
                                className="p-2 sm:p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 border border-transparent hover:border-red-200 transition-all duration-300"
                                aria-label="Remove item"
                              >
                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary - Sticky on Desktop, Normal on Mobile */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 shadow-sm xl:sticky xl:top-24">
                  <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg sm:text-xl font-medium text-black tracking-wide uppercase">Order Summary</h3>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <CartTotal />

                    <div className="space-y-2 sm:space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 sm:py-4 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 uppercase text-sm sm:text-base"
                      >
                        PROCEED TO CHECKOUT
                      </button>

                      <button
                        onClick={() => navigate('/shop/collection')}
                        className="w-full py-3 sm:py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm sm:text-base"
                      >
                        CONTINUE SHOPPING
                      </button>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-light">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="uppercase tracking-wider">Secure Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {cartData.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-20 pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
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

export default Cart;