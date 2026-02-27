import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import {
  Truck, Package, CheckCircle, RefreshCw, ShoppingBag, Calendar, CreditCard, Hash, ChevronDown, TrendingUp, Box, ArrowRight, IndianRupee
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        return <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-600" />;
      case 'shipped':
      case 'out for delivery':
        return <Truck size={14} className="sm:w-4 sm:h-4 text-blue-600" />;
      case 'processing':
        return <RefreshCw size={14} className="sm:w-4 sm:h-4 text-amber-600" />;
      default:
        return <Package size={14} className="sm:w-4 sm:h-4 text-gray-500" />;
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
      <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-2xl sm:text-3xl mb-4 sm:mb-6">
                <Title text1="ORDER" text2="HISTORY" />
              </div>
            </div>
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-black mx-auto mb-3 sm:mb-4"></div>
                <span className="text-sm sm:text-base text-gray-600 font-light">Loading your orders...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              <Title text1="ORDER" text2="HISTORY" />
            </div>
            {orderData.length > 0 && (
              <p className="text-xs sm:text-sm md:text-base text-gray-500 font-light">
                Track and manage your {orderData.length} order{orderData.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Order Stats Cards */}
          {orderData.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <Box size={16} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-lg sm:text-2xl md:text-3xl font-medium text-black">{stats.total}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light uppercase tracking-wider">Total Orders</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <CheckCircle size={16} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-lg sm:text-2xl md:text-3xl font-medium text-gray-700">{stats.delivered}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light uppercase tracking-wider">Delivered</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <TrendingUp size={16} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-lg sm:text-2xl md:text-3xl font-medium text-gray-700">{stats.processing}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light uppercase tracking-wider">In Transit</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-white border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <IndianRupee size={16} className="sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-base sm:text-xl md:text-2xl font-medium text-gray-700">{currency}{stats.totalSpent}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-light uppercase tracking-wider">Total Spent</p>
              </div>
            </div>
          )}

          {orderData.length > 0 && (
            <>
              {/* Filters and Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All Orders' },
                    { key: 'delivered', label: 'Delivered' },
                    { key: 'processing', label: 'Processing' },
                    { key: 'shipped', label: 'Shipped' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(key)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-light tracking-wide border transition-all duration-300 ${filterStatus === key
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black active:bg-gray-50'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-xs sm:text-sm font-light text-gray-500 tracking-wide hidden sm:inline">SORT BY:</span>
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="appearance-none w-full border border-gray-300 bg-white px-3 sm:px-4 py-2 pr-8 sm:pr-10 font-light tracking-wide focus:border-black focus:outline-none transition-colors text-xs sm:text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Orders Content */}
      <section className="px-4 sm:px-6 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          {orderData.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <ShoppingBag size={24} className="sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <div className="text-center max-w-md mb-6 sm:mb-8 px-4">
                <h3 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3 tracking-wide">NO ORDERS YET</h3>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  Your order history is empty. Start exploring our amazing collection and place your first order.
                </p>
              </div>
              <button
                onClick={() => navigate('/shop/collection')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-sm sm:text-base"
              >
                BROWSE PRODUCTS
              </button>
            </div>
          ) : (
            // Orders List
            <div className="space-y-4 sm:space-y-6">
              {filteredOrders.map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Hash size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER ID:</span>
                            <span className="font-medium text-black tracking-wide text-xs sm:text-sm truncate">{item.orderId}</span>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 font-light">{formatDate(item.date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          {getStatusIcon(item.status)}
                          <span className={`px-2 sm:px-3 py-1 border text-[10px] sm:text-xs font-medium uppercase tracking-wider ${getStatusColor(item.status)}`}>
                            {item.status || 'Processing'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 sm:hidden">
                        <CreditCard size={12} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-600 font-light">{item.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex gap-3 sm:gap-4 md:gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32">
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
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <h3 className="font-medium text-sm sm:text-base md:text-lg text-black tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2"> {item.name}</h3>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            <div className="space-y-0.5">
                              <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</span>
                              <span className="font-medium text-black text-xs sm:text-sm">{currency}{item.price}</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</span>
                              <span className="font-medium text-black text-xs sm:text-sm">{item.quantity}</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">SIZE</span>
                              <span className="font-medium text-black text-xs sm:text-sm">{item.size}</span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</span>
                              <span className="font-medium text-black text-sm sm:text-base">
                                {currency}{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-3 sm:mt-4">
                          <button
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-xs sm:text-sm"
                            onClick={() => navigate(`/trackorder/${item.orderId}`)}
                          >
                            <Truck size={14} className="sm:w-4 sm:h-4" />
                            <span>TRACK ORDER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Section */}
              <div className="mt-8 sm:mt-12 bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-medium text-black mb-2 sm:mb-3 tracking-wide">WANT TO ORDER MORE?</h3>
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-4 sm:mb-6 max-w-md mx-auto">
                  Discover new arrivals and trending products in our carefully curated collection
                </p>
                <button
                  onClick={() => navigate('/shop/collection')}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-sm sm:text-base"
                >
                  <span>CONTINUE SHOPPING</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-medium text-black mb-2 tracking-wide">NEED HELP WITH YOUR ORDER?</h3>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                Our customer service team is here to assist you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Phone Contact */}
              <div className="bg-white border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-black" />
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-black">Call Us</h4>
                </div>
                <div className="space-y-2 text-sm sm:text-base text-gray-700 font-light">
                  <p className="font-medium text-black">+91 9063284008</p>
                  <p className="font-medium text-black">+91 91211 57804</p>
                  <p className="text-xs sm:text-sm text-gray-500">Mon - Sat: 9 AM - 6 PM</p>
                </div>
              </div>

              {/* Email Contact */}
              <div className="bg-white border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard size={20} className="text-black" />
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-black">Email Us</h4>
                </div>
                <div className="space-y-2 text-sm sm:text-base text-gray-700 font-light">
                  <p className="font-medium text-black break-all">aharyasofficial@gmail.com</p>
                  <p className="text-xs sm:text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>

              {/* Visit Contact Page */}
              <div className="bg-white border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={20} className="text-black" />
                  </div>
                  <h4 className="text-base sm:text-lg font-medium text-black">Contact Page</h4>
                </div>
                <p className="text-sm sm:text-base text-gray-700 font-light mb-4">
                  Visit our contact page for more ways to reach us
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full px-4 py-2 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm"
                >
                  VISIT CONTACT PAGE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Orders;