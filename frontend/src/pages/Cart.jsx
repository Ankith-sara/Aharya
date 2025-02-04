import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
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
    <div className="min-h-screen bg-primary m-20 p-6">
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
                    <div key={index} className="text-red-500"> Product not found </div>
                  );
                }
                return (
                  <div key={index} className="p-5 bg-background border border-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between gap-6" >
                    <div className="flex items-start gap-4">
                      <img className="w-20 sm:w-28" src={productData.images[0]} alt={productData.name} />
                      <div className='pt-5'>
                        <p className="text-lg font-medium">{productData.name}</p>
                        <div className="flex flex-col gap-4 mt-2">
                          <p> Price: {currency} {productData.price} </p>
                          <p className="px-3 py-1 w-[35px] border border-secondary bg-primary text-text"> {item.size} </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 items-center">
                      <input onChange={(e) => {
                          const value = e.target.value;
                          if (value !== '' && value !== '0') {
                            updateQuantity(item._id, item.size, Number(value));
                          }
                        }} className="border border-secondary bg-primary text-text w-16 px-2 py-1 text-center" type="number" min={1} defaultValue={item.quantity} />
                      <img onClick={() => handleDelete(item._id, item.size)} className="w-6 mt-3 cursor-pointer hover:scale-110" src={assets.bin_icon} alt="Delete" />
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