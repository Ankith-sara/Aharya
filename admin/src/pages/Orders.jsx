import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendURl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  // Fetch Orders
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendURl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendURl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="flex flex-col w-full items-start gap-6 p-6 bg-background rounded-lg shadow-md max-w-4xl mx-auto mt-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Order Page</h3>
      {orders.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-900">
            <thead>
              <tr className="bg-primary text-text text-sm uppercase">
                <th className="p-3 text-left border border-gray-900">Order No.</th>
                <th className="p-3 text-left border border-gray-900">Items</th>
                <th className="p-3 text-left border border-gray-900">Customer</th>
                <th className="p-3 text-left border border-gray-900">Address</th>
                <th className="p-3 text-left border border-gray-900">Payment Details</th>
                <th className="p-3 text-left border border-gray-900">Status</th>
                <th className="p-3 text-center border border-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-background transition-all">
                  <td className="p-3 border border-gray-900">{index + 1}</td>
                  <td className="p-3 border border-gray-900">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <p>Order Id: {item._id}</p>
                        <p>Products: {item.name} x {item.quantity}</p>
                        {item.size && <span> ({item.size})</span>}
                      </div>
                    ))}
                  </td>
                  <td className="p-3 border border-gray-900">
                    <p className="font-medium"> {order.address.firstName} {order.address.lastName} </p>
                  </td>
                  <td className="p-3 border border-gray-900 text-sm text-gray-600">
                    <p>{order.address.street},</p>
                    <p>{order.address.city}, {order.address.country} - {order.address.pincode} </p>
                    <p>Phone: {order.address.phone}</p>
                  </td>
                  <td className="p-3 border border-gray-900 text-sm text-gray-600">
                    <p>Items : {order.items.length}</p>
                    <p>Method : {order.paymentMethod}</p>
                    <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                  </td>
                  <td className="p-3 border border-gray-900">
                    <p> <span className="font-semibold">{currency}</span> {order.amount} </p>
                    <p className={`text-sm ${order.payment ? 'text-green-600' : 'text-red-600'}`} > {order.payment ? 'Paid' : 'Pending'} </p>
                  </td>
                  <td className="p-2 border border-gray-900">
                      <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className="border border-gray-300 rounded-md py-1 px-5 bg-gray-50 focus:ring focus:ring-secondary text-sm">
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Out of delivery">Out of delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">No orders available.</p>
      )}
    </div>
  );
};

export default Orders;