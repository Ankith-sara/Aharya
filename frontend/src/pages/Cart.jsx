import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Trash2, ShoppingBag, Package } from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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

  const handleDelete = (id, size) => {
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      updateQuantity(id, size, 0);
    }
  };

  const handleQuantityChange = (id, size, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(id, size, newQuantity);
    }
  };

  // Handle checkout with login check
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
  })

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">
              <Title text1="SHOPPING" text2="CART" />
            </div>
            {cartData.length > 0 && (
              <p className="text-gray-500 font-light">
                Review your {cartData.length} item{cartData.length !== 1 ? 's' : ''} before checkout
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          {cartData.length === 0 ? (
            // Empty Cart State
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-medium mb-3 tracking-wide">YOUR CART IS EMPTY</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Discover our amazing collection and add your favorite items to get started
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            <div className="grid xl:grid-cols-[2fr_1fr] gap-8">
              {/* Cart Items */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-400" />
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
                          <div key={index} className="p-6 text-center text-gray-500 bg-red-50 border-l-4 border-red-200">
                            <p className="font-medium">Product not found or unavailable</p>
                            <p className="text-sm font-light">This item may have been removed from our catalog</p>
                          </div>
                        );
                      }

                      return (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-300">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0">
                              <div className="w-full h-48 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                                <img
                                  className="w-full h-full object-contain"
                                  src={productData.images[0]}
                                  alt={productData.name}
                                />
                              </div>
                            </div>

                            <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                              <div className="flex-grow space-y-4">
                                <div>
                                  <Link
                                    to={`/product/${item._id}`}
                                    className="group"
                                  >
                                    <h3 className="font-medium text-xl text-black mb-2 tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
                                      {productData.name}
                                    </h3>
                                  </Link>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      PRICE
                                    </span>
                                    <span className="font-medium text-black text-lg">
                                      {currency}{productData.price}
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      SIZE
                                    </span>
                                    <span className="font-medium text-black">{item.size}</span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      SUBTOTAL
                                    </span>
                                    <span className="font-medium text-black text-lg">
                                      {currency}{(productData.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    QUANTITY:
                                  </span>
                                  <div className="flex items-center border border-gray-300 bg-white">
                                    <input
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        handleQuantityChange(item._id, item.size, value);
                                      }}
                                      className="w-20 px-3 py-2 text-center border-gray-300 focus:outline-none focus:bg-gray-50 font-medium"
                                      type="number"
                                      min={1}
                                      value={item.quantity}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex lg:flex-col items-center lg:items-end justify-end lg:justify-start">
                                <button
                                  onClick={() => handleDelete(item._id, item.size)}
                                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-300"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 shadow-sm sticky top-6">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xl font-medium text-black tracking-wide uppercase">Order Summary</h3>
                  </div>

                  <div className="p-6 space-y-6">
                    <CartTotal />

                    <div className="space-y-3">
                      <button
                        onClick={handleCheckout}
                        className="w-full py-4 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300 uppercase"
                      >
                        PROCEED TO CHECKOUT
                      </button>

                      <button
                        onClick={() => navigate('/shop/collection')}
                        className="w-full py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase"
                      >
                        CONTINUE SHOPPING
                      </button>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
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

      {/* Recently Viewed */}
      {cartData.length > 0 && (
        <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <RecentlyViewed />
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart