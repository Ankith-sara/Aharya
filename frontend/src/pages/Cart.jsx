import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { Plus, Minus, MinusIcon, PlusIcon } from 'lucide-react';
import { assets } from '../assets/frontend_assets/assets';

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

  return (
    <div className="min-h-screen bg-primary mt-20 mb-10 mx-4 sm:mx-8 md:mx-20 p-6">
      <div className="text-2xl mb-6">
        <Title text1="Your" text2="Cart" />
      </div>
      {
        cartData.length === 0 ? (
          <p className="text-text text-center py-10">Your cart is empty.</p>
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-6">
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );

                if (!productData) {
                  return (
                    <div key={index} className="text-secondary"> Product not found </div>
                  );
                }
                return (
                  <div key={index} className="p-5 bg-background border border-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <img className="w-20 sm:w-28 flex-shrink-0" src={productData.images[0]} alt={productData.name} />
                      <div className="pt-5">
                        <p className="text-lg font-medium">{productData.name}</p>
                        <div className="flex flex-col gap-4 mt-2">
                          <p>
                            Price: {currency} {productData.price}
                          </p>
                          <div className='flex gap-1 items-center'>
                            <div className='flex gap-4 flex-col sm:flex-row md:flex-row items-center'>
                              <div className='flex gap-1 items-center'>
                                <p>Size: </p>
                                <p className="px-3 py-1 w-[35px] border border-secondary bg-primary text-text text-center">
                                  {item.size}
                                </p>
                              </div>
                              <p>Quantity: </p>
                              <div className="flex items-center border border-secondary bg-primary text-text">
                                <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className="px-1 py-1" disabled={item.quantity <= 1}>
                                  <MinusIcon size={12} />
                                </button>
                                <input
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value !== "" && value !== "0") {
                                      updateQuantity(item._id, item.size, Number(value));
                                    }
                                  }} className="w-16 px-1 py-1 text-center bg-primary text-text" type="number" min={1} value={item.quantity}
                                />
                                <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className="px-1 py-1">
                                  <PlusIcon size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-5 items-center">
                      <img
                        onClick={() => handleDelete(item._id, item.size)}
                        className="w-6 cursor-pointer hover:scale-110"
                        src={assets.bin_icon}
                        alt="Delete"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sticky top-20 h-fit bg-primary text-text border border-secondary rounded-lg p-6 shadow-md">
              <CartTotal />
              <div className="mt-6 text-center">
                <button onClick={() => navigate('/place-order')} className="py-3 px-6 bg-secondary text-primary rounded-lg text-lg hover:scale-105 transition-transform" >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Cart;