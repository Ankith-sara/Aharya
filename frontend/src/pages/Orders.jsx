import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import {
  Truck, Package, CheckCircle, RefreshCw, ShoppingBag, Calendar, CreditCard, Hash, ArrowRight
} from 'lucide-react';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
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
        return <CheckCircle size={16} className="text-green-600" />;
      case 'shipped':
      case 'out for delivery':
        return <Truck size={16} className="text-blue-600" />;
      case 'processing':
        return <RefreshCw size={16} className="text-amber-600" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'shipped':
      case 'out for delivery':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getFilteredOrders = () => {
    let filtered = orderData;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order =>
        order.status?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Sort orders
    if (sortOrder === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const getOrderStats = () => {
    const total = orderData.length;
    const delivered = orderData.filter(item => item.status?.toLowerCase() === 'delivered').length;
    const processing = orderData.filter(item =>
      item.status?.toLowerCase() === 'processing' ||
      item.status?.toLowerCase() === 'shipped' ||
      item.status?.toLowerCase() === 'out for delivery'
    ).length;
    const totalSpent = orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { total, delivered, processing, totalSpent };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black mt-20">
        <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-3xl mb-6">
                <Title text1="ORDER" text2="HISTORY" />
              </div>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <span className="text-gray-600 font-light">Loading your orders...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">
              <Title text1="ORDER" text2="HISTORY" />
            </div>
            {orderData.length > 0 && (
              <p className="text-gray-500 font-light">
                Track and manage your {orderData.length} order{orderData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {orderData.length > 0 && (
            <>
              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All Orders' },
                    { key: 'processing', label: 'Processing' },
                    { key: 'shipped', label: 'Shipped' },
                    { key: 'delivered', label: 'Delivered' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-4 py-2 text-sm font-light tracking-wide border transition-all duration-300 ${filterStatus === key
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-light text-gray-500 tracking-wide">SORT BY:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none border border-gray-300 bg-white px-4 py-2 pr-8 font-light tracking-wide focus:border-black focus:outline-none transition-colors"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Orders Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          {orderData.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-medium mb-3 tracking-wide">NO ORDERS YET</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Your order history is empty. Start exploring our amazing collection and place your first order.
                </p>
              </div>
              <button
                onClick={() => navigate('/collection')}
                className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            // Orders List
            <div className="space-y-6">
              {filteredOrders.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-gray-400" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER ID:</span>
                          <span className="font-medium text-black tracking-wide">{item.orderId}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 font-light">{formatDate(item.date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 font-light">{item.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`px-3 py-1 border text-xs font-medium uppercase tracking-wider ${getStatusColor(item.status)}`}>
                            {item.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-2">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                          <img
                            className="w-full h-full object-contain"
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/api/placeholder/160/160';
                            }}
                          />
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-grow flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-grow space-y-4">
                          <div>
                            <h3 className="font-medium text-xl text-black mb-2 tracking-wide group-hover:text-gray-700 transition-colors">
                              {item.name}
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PRICE
                              </span>
                              <span className="font-medium text-black">
                                {currency}{item.price}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                QUANTITY
                              </span>
                              <span className="font-medium text-black">{item.quantity}</span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SIZE
                              </span>
                              <span className="font-medium text-black">{item.size}</span>
                            </div>

                            <div className="space-y-1">
                              <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                TOTAL
                              </span>
                              <span className="font-medium text-black text-lg">
                                {currency}{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full lg:w-auto lg:min-w-[200px]">
                          <button
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                            onClick={() => navigate(`/trackorder/${item.orderId}`)}
                          >
                            <Truck size={16} />
                            <span>TRACK ORDER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Section */}
              <div className="mt-12 bg-gray-50 border border-gray-200 p-8 text-center">
                <h3 className="text-2xl font-medium text-black mb-3 tracking-wide">WANT TO ORDER MORE?</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-6 max-w-md mx-auto">
                  Discover new arrivals and trending products in our carefully curated collection
                </p>
                <button
                  onClick={() => navigate('/collection')}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;