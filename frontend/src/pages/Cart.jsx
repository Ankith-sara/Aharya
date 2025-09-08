import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Minus, Plus, Trash2, ShoppingBag, Heart, Star, ArrowLeft } from 'lucide-react';
import RecentlyViewed from '../components/RecentlyViewed';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
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

  useEffect(() => {
    document.title = 'Cart | Aharyas'
  })

  return (
    <div className="min-h-screen bg-gray-50 mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <Title text1="SHOPPING" text2="CART" />
        </div>

        {cartData.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your Cart is Empty</h3>
                <p className="text-gray-600 max-w-md">
                  Discover our amazing collection and add your favorite items to get started
                </p>
              </div>
              <button 
                onClick={() => navigate('/shop/collection')} 
                className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          <div className="grid xl:grid-cols-[2fr_1fr] gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-black text-white p-6">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={24} className="text-gray-300" />
                    <h2 className="text-xl font-semibold">Your Items ({cartData.length})</h2>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartData.map((item, index) => {
                    const productData = products.find(
                      (product) => product._id === item._id
                    );

                    if (!productData) {
                      return (
                        <div key={index} className="p-6 text-center text-gray-500 bg-red-50 border-l-4 border-red-200">
                          <p className="font-medium">Product not found or unavailable</p>
                          <p className="text-sm">This item may have been removed from our catalog</p>
                        </div>
                      );
                    }

                    return (
                      <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-full h-48 sm:w-32 sm:h-40 lg:w-40 lg:h-60 bg-white overflow-hidden shadow-sm border border-gray-100">
                              <img 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
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
                                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                                    {productData.name}
                                  </h3>
                                </Link>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Price
                                  </span>
                                  <span className="font-semibold text-lg text-gray-900">
                                    {currency}{productData.price}
                                  </span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    Size
                                  </span>
                                  <span className="font-medium text-gray-900">{item.size}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <input
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 1;
                                      handleQuantityChange(item._id, item.size, value);
                                    }}
                                    className="w-16 px-3 py-2 text-center border-x border-gray-300 focus:outline-none focus:bg-blue-50"
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                              <button 
                                onClick={() => handleDelete(item._id, item.size)}
                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                aria-label="Remove item"
                              >
                                <Trash2 size={20} />
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
                <div className="bg-black text-white p-6">
                  <h3 className="text-xl font-semibold">Order Summary</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <CartTotal />
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/place-order')}
                      className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      PROCEED TO CHECKOUT
                    </button>
                    
                    <button 
                      onClick={() => navigate('/shop/collection')}
                      className="w-full py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-black hover:text-black transition-all duration-200"
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        <div className="mt-16">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default Cart;