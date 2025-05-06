import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { ChevronRight, Truck, Clock } from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id || `ORD-${Math.floor(Math.random() * 10000)}`;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-12">
        <Title text1="ORDER" text2="HISTORY" />
      </div>

      {orderData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
            <Clock size={32} className="text-black" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
            <p className="text-gray-600 max-w-md">Your order history is empty. Explore our collection and start shopping.</p>
          </div>
          <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
            BROWSE PRODUCTS
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orderData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-500">Order ID:</span>
                  <span className="font-medium">{item.orderId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-medium">{formatDate(item.date)}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden flex items-center justify-center">
                      <img
                        className="w-full h-full object-contain object-center"
                        src={item.images[0]}
                        alt={item.name}
                      />
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-grow flex flex-col md:flex-row md:justify-between gap-4 w-full">
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm text-gray-600">
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-gray-500">Price</span>
                          <span className="font-medium text-black">{currency}{item.price}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-gray-500">Quantity</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-gray-500">Size</span>
                          <span>{item.size}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-gray-500">Payment</span>
                          <span>{item.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="block text-xs uppercase tracking-wider text-gray-500">Total</span>
                          <span className="font-medium text-black">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0">
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-black' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm font-medium ${item.status === 'Delivered' ? 'text-black' : 'text-gray-600'}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <button className="flex items-center justify-center gap-1 px-6 py-2 border border-black text-black text-sm font-medium hover:bg-black hover:text-white transition-colors" onClick={() => navigate(`/trackorder/${item.orderId}`)}>
                          <Truck size={16} />
                          <span>Track Order</span>
                        </button>
                        <button className="flex items-center justify-center gap-1 px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors" onClick={() => navigate(`/product/${item._id}`)}>
                          <span>Reorder</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;