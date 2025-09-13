import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import {
  ChevronRight,
  Truck,
  Clock,
  Package,
  CheckCircle,
  RefreshCw,
  ShoppingBag,
  Calendar,
  CreditCard,
  Hash
} from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadOrderData = async () => {
    try {
      if (!token) return;

      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    document.title = 'Order History | Aharyas';
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'shipped':
      case 'out for delivery':
        return <Truck size={16} className="text-blue-500" />;
      case 'processing':
        return <RefreshCw size={16} className="text-yellow-500" />;
      default:
        return <Package size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
      case 'out for delivery':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Title text1="ORDER" text2="HISTORY" />
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title text1="ORDER" text2="HISTORY" />
        </div>

        {orderData.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Orders Yet</h3>
                <p className="text-gray-600 max-w-md">
                  Your order history is empty. Start exploring our amazing collection and place your first order.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          </div>
        ) : (
          // Orders List
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-black text-white p-6">
                <div className="flex items-center gap-3">
                  <Package size={24} className="text-gray-300" />
                  <h2 className="text-xl font-semibold">Your Orders ({orderData.length})</h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {orderData.map((item, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID:</span>
                          <span className="font-medium text-gray-900">{item.orderId}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(item.date)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status || 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full h-48 sm:w-32 sm:h-40 lg:w-40 lg:h-48 bg-white overflow-hidden shadow-sm border border-gray-100 rounded-lg">
                          <img
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/api/placeholder/160/192';
                            }}
                          />
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-grow space-y-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                              {item.name}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Price
                              </span>
                              <span className="font-semibold text-gray-900">
                                {currency}{item.price}
                              </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Quantity
                              </span>
                              <span className="font-medium text-gray-900">{item.quantity}</span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Size
                              </span>
                              <span className="font-medium text-gray-900">{item.size}</span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Total
                              </span>
                              <span className="font-semibold text-gray-900">
                                {currency}{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Payment: <span className="font-medium text-gray-900">{item.paymentMethod}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                          <button
                            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-black hover:text-black transition-all duration-200"
                            onClick={() => navigate(`/trackorder/${item.orderId}`)}
                          >
                            <Truck size={16} />
                            <span>Track Order</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{orderData.length}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {orderData.filter(item => item.status?.toLowerCase() === 'delivered').length}
                    </p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {orderData.filter(item =>
                        item.status?.toLowerCase() !== 'delivered' &&
                        item.status?.toLowerCase() !== 'cancelled'
                      ).length}
                    </p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Want to order more?</h3>
                <p className="text-gray-600 mb-6">Discover new arrivals and trending products</p>
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="px-8 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;