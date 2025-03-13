import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }
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
            allOrdersItem.push(item);
          });
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="min-h-screen mt-20 mb-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 bg-primary">
      <div className="text-3xl text-text text-center mb-12">
        <Title text1="My" text2="Orders" />
      </div>
      <div className="space-y-8">
        {orderData.map((item, index) => (
          <div className="p-4 bg-background border border-secondary rounded-lg shadow-lg text-text">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-start gap-4">
        <img
          className="w-20 shadow-md"
          src={item.images[0]}
          alt={item.name}
        />
        <div>
          <p className="font-medium text-base md:text-lg">{item.name}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm">
            <p>
              <span className="font-semibold">Price:</span> {currency}
              {item.price}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {item.quantity}
            </p>
            <p>
              <span className="font-semibold">Size:</span> {item.size}
            </p>
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Date:</span> {new Date(item.date).toDateString()}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Payment Method:</span> {item.paymentMethod}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full md:w-auto gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${item.status === 'Delivered' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <p className="text-sm md:text-base">{item.status}</p>
        </div>
        <button
          onClick={() => {/* Implement tracking functionality */}}
          className="px-4 py-2 bg-secondary text-background text-sm font-medium rounded-lg shadow-md hover:bg-secondary-dark transition"
        >
          Track Order
        </button>
      </div>
    </div>
  </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;