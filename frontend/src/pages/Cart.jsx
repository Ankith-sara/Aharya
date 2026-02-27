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
    document.title = 'Cart | Aharyas';
  }, []);

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md sm:rounded-sm shadow-2xl animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium tracking-wide">REMOVE ITEM</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600 active:text-black transition-colors"
                aria-label="Close"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
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
                className="flex-1 py-3 border border-gray-300 text-black font-light tracking-wide hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 uppercase text-xs sm:text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              <Title text1="SHOPPING" text2="CART" />
            </div>
            {cartData.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-500 font-light">
                {cartData.length} item{cartData.length !== 1 ? 's' : ''} in your cart
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-20 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          {cartData.length === 0 ? (
            /* Empty Cart State */
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 bg-white border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={28} className="sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-8 px-4">
                <h3 className="text-xl sm:text-2xl font-light tracking-wider mb-3">YOUR CART IS EMPTY</h3>
                <div className="w-12 h-0.5 bg-black mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  Discover our handcrafted collection and add your favorite items
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-3 sm:py-4 bg-black text-white font-light tracking-[0.15em] text-xs sm:text-sm hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 group"
              >
                BROWSE COLLECTION
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] gap-6 lg:gap-8">
              <div className="space-y-4">
                {/* Items Header */}
                <div className="hidden md:flex items-center justify-between px-6 py-4 bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-gray-500" />
                    <span className="text-xs uppercase tracking-widest text-gray-600 font-light">
                      {cartData.length} Item{cartData.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3 sm:space-y-4">
                  {cartData.map((item, index) => {
                    const productData = products.find((product) => product._id === item._id);

                    if (!productData) {
                      return (
                        <div key={index} className="p-4 border-l-4 border-red-400 bg-red-50">
                          <p className="text-sm font-medium text-red-800">Product unavailable</p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex gap-4 sm:gap-6">
                            {/* Product Image */}
                            <Link
                              to={`/product/${item._id}`}
                              className="flex-shrink-0 group"
                            >
                              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden bg-gray-50">
                                <img
                                  src={productData.images[0]}
                                  alt={productData.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between gap-3 mb-3">
                                <Link to={`/product/${item._id}`} className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm sm:text-base tracking-wide hover:text-gray-700 transition-colors line-clamp-2">
                                    {productData.name}
                                  </h3>
                                </Link>
                                
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteClick(item._id, item.size)}
                                  className="md:hidden p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                                  aria-label="Remove"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              {/* Size and Price - Mobile Grid */}
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                {item.size !== 'N/A' && (
                                  <div>
                                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Size</span>
                                    <span className="text-sm font-medium">{item.size}</span>
                                  </div>
                                )}
                                <div className={item.size === 'N/A' ? 'col-span-2' : ''}>
                                  <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Price</span>
                                  <span className="text-sm font-medium">{currency}{productData.price}</span>
                                </div>
                              </div>

                              {/* Quantity Controls & Subtotal */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs uppercase tracking-wider text-gray-500">Qty:</span>
                                  <div className="flex items-center border border-gray-300">
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        handleQuantityChange(item._id, item.size, value);
                                      }}
                                      className="w-12 h-9 text-center text-sm font-medium focus:outline-none focus:bg-gray-50"
                                    />
                                    <button
                                      onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-300"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>

                                {/* Subtotal & Delete */}
                                <div className="hidden md:flex items-center gap-4">
                                  <div className="text-right">
                                    <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Subtotal</span>
                                    <span className="text-base font-medium">{currency}{(productData.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteClick(item._id, item.size)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                                    aria-label="Remove item"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>

                                {/* Subtotal */}
                                <div className="md:hidden pt-3 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Subtotal</span>
                                    <span className="text-base font-medium">{currency}{(productData.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-white border border-gray-200 shadow-lg">
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium tracking-wider uppercase">Order Summary</h3>
                  </div>

                  <div className="p-6 space-y-6">
                    <CartTotal />
                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="w-full py-4 bg-black text-white font-light tracking-[0.15em] text-sm hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                      >
                        PROCEED TO CHECKOUT
                      </button>

                      <button
                        onClick={() => navigate('/shop/collection')}
                        className="w-full py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm"
                      >
                        CONTINUE SHOPPING
                      </button>
                    </div>

                    {/* Security Badge */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-light">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

      {/* Recently Viewed */}
      {cartData.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-20 pb-12">
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
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Cart;