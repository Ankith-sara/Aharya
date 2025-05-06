import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
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

  useEffect(() => {
    document.title = 'Cart | Aharyas'
  })

  return (
    <div className="min-h-screen bg-white text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-10">
        <Title text1="SHOPPING" text2="CART" />
      </div>

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-black" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Your Cart is Empty</h3>
            <p className="text-gray-600 max-w-md">Add items to your cart to continue shopping</p>
          </div>
          <button onClick={() => navigate('/shop/collection')} className="mt-4 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              if (!productData) {
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-md text-gray-500">
                    Product not found or unavailable
                  </div>
                );
              }

              return (
                <div key={index} className="border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-full h-auto sm:w-32 sm:h-32 overflow-hidden flex items-center justify-center">
                          <img className="w-full h-full object-contain object-center" src={productData.images[0]} alt={productData.name} />
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col sm:flex-row justify-between gap-4 w-full">
                        <div className="flex-grow">
                          <Link to={`/product/${item._id}`}><h3 className="font-medium text-lg mb-3">{productData.name}</h3></Link>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                            <div>
                              <span className="block text-xs uppercase tracking-wider text-gray-500">Price</span>
                              <span className="font-medium text-black">{currency}{productData.price}</span>
                            </div>
                            <div>
                              <span className="block text-xs uppercase tracking-wider text-gray-500">Size</span>
                              <span>{item.size}</span>
                            </div>
                            <div className="col-span-1 sm:col-span-2 mt-2">
                              <div className="flex gap-2 flex-col sm:flex-row md:flex-row items-center">
                                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Quantity:</span>
                                <div className="flex items-center border text-text">
                                  <input
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value !== "" && value !== "0") {
                                        updateQuantity(item._id, item.size, Number(value));
                                      }
                                    }} className="w-16 px-1 py-1 text-center text-text" type="number" min={1} value={item.quantity}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 mt-4 sm:mt-0">
                          <div className="font-medium">
                            <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Total</span>
                            {currency}{(productData.price * item.quantity).toFixed(2)}
                          </div>

                          <button onClick={() => handleDelete(item._id, item.size)} className="p-2 text-gray-500 hover:text-black transition-colors" aria-label="Remove item">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit bg-white border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              <CartTotal />
            </div>
            <div className="p-6">
              <button onClick={() => navigate('/place-order')} className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16">
        <RecentlyViewed />
      </div>
    </div>
  );
};

export default Cart;