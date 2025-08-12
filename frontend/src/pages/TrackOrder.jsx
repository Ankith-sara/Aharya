import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import {
  Package, Truck, CheckCircle, Clock, MapPin, AlertCircle,
  ChevronDown, ChevronUp, ArrowLeft, Calendar, Phone, Mail
} from 'lucide-react';

const TrackOrder = () => {
  const { backendUrl, currency, token } = useContext(ShopContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define all possible order statuses for complete timeline
  const allStatuses = [
    'Order Placed',
    'Processing',
    'Shipping',
    'Out for Delivery',
    'Delivered'
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!backendUrl || !token || !orderId) {
          throw new Error("Missing backend URL, token, or order ID");
        }

        const response = await fetch(`${backendUrl}/api/order/track/${orderId}`, {
          method: "GET",
          headers: {
            token: token
          }
        })

        const data = await response.json();

        if (data.success) {
          setOrder(data.order);
        } else {
          throw new Error(data.message || 'Failed to load order');
        }
      } catch (err) {
        setError(err.message || 'Failed to load order data');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, backendUrl, token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <CheckCircle size={20} />;
      case 'Processing': return <Package size={20} />;
      case 'Shipping': return <Truck size={20} />;
      case 'Out for Delivery': return <Truck size={20} />;
      case 'Delivered': return <CheckCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  // Fixed status logic - Order Placed should always be completed
  const getStatusState = (status) => {
    if (!order || !order.status) return 'upcoming';

    const currentStatusIndex = allStatuses.indexOf(order.status);
    const statusIndex = allStatuses.indexOf(status);

    if (statusIndex < 0) return 'upcoming';

    // Order Placed should always be completed once an order exists
    if (status === 'Order Placed') {
      return 'completed';
    }

    // If current status is delivered, all previous statuses are completed
    if (order.status === 'Delivered') {
      return 'completed';
    }

    if (statusIndex < currentStatusIndex) {
      return 'completed';
    } else if (statusIndex === currentStatusIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  // Find actual history for a status if it exists
  const findHistoryForStatus = (status) => {
    if (!order || !order.trackingHistory) return null;
    return order.trackingHistory.find(item => item.status === status);
  };

  const getProgressPercentage = () => {
    if (!order || !order.status) return 0;
    const currentIndex = allStatuses.indexOf(order.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / allStatuses.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <span className="text-lg text-gray-600">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <span className="text-lg text-red-600">{error || 'Order not found.'}</span>
        </div>
      </div>
    );
  }

  // Fallbacks for missing data
  const trackingHistory = order.trackingHistory || [
    {
      status: order.status || 'Order Placed',
      location: order.address?.city || 'N/A',
      timestamp: order.date || Date.now(),
      description: `Order status: ${order.status || 'Order Placed'}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title text1="ORDER" text2="TRACKING" />
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-black text-white p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Package size={24} className="text-gray-300" />
                  <span className="text-sm text-gray-300">Order #{order._id?.slice(-8)}</span>
                </div>
                <h1 className="text-2xl font-semibold">{order.status}</h1>
                <p className="text-gray-300 mt-1">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                <Calendar size={24} className="text-gray-300" />
                <div className="text-right">
                  <p className="text-sm text-gray-300">
                    {order.estimatedDelivery ? 'Expected Delivery' : 'Processing Time'}
                  </p>
                  <p className="font-semibold text-lg">
                    {formatDate(order.estimatedDelivery || order.date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Order Progress</span>
                <span>{Math.round(getProgressPercentage())}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-8 text-gray-900">Tracking Timeline</h3>
            
            <div className="relative">
              {/* Desktop Timeline */}
              <div className="hidden lg:block">
                {/* Progress Line */}
                <div className="absolute top-12 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-12 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(getProgressPercentage() / 100) * 100}%` }}
                ></div>

                <div className="flex justify-between">
                  {allStatuses.map((status, index) => {
                    const state = getStatusState(status);
                    const historyItem = findHistoryForStatus(status);
                    
                    return (
                      <div key={index} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          {/* Status Circle */}
                          <div
                            className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                              state === 'completed'
                                ? 'bg-green-500 text-white shadow-lg'
                                : state === 'current'
                                ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-100'
                                : 'bg-gray-200 text-gray-400 border-2 border-gray-300'
                            }`}
                          >
                            {getStatusIcon(status)}
                          </div>

                          {/* Status Details */}
                          <div className="mt-4 text-center max-w-32">
                            <h4
                              className={`font-medium text-sm ${
                                state === 'upcoming'
                                  ? 'text-gray-400'
                                  : state === 'current'
                                  ? 'text-blue-600'
                                  : 'text-gray-900'
                              }`}
                            >
                              {status}
                            </h4>

                            {historyItem && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                  {formatDate(historyItem.timestamp)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTime(historyItem.timestamp)}
                                </p>
                                {historyItem.location && (
                                  <div className="flex items-center justify-center mt-1">
                                    <MapPin size={10} className="text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-400">
                                      {historyItem.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {state === 'current' && !historyItem && (
                              <p className="text-xs text-blue-500 mt-1 font-medium">In Progress</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="lg:hidden space-y-4">
                {allStatuses.map((status, index) => {
                  const state = getStatusState(status);
                  const historyItem = findHistoryForStatus(status);
                  
                  return (
                    <div key={index} className="flex items-start gap-4">
                      {/* Status Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          state === 'completed'
                            ? 'bg-green-500 text-white'
                            : state === 'current'
                            ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {getStatusIcon(status)}
                      </div>

                      {/* Status Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium ${
                            state === 'upcoming'
                              ? 'text-gray-400'
                              : state === 'current'
                              ? 'text-blue-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {status}
                        </h4>

                        {historyItem && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              {formatDate(historyItem.timestamp)} at {formatTime(historyItem.timestamp)}
                            </p>
                            {historyItem.location && (
                              <div className="flex items-center mt-1">
                                <MapPin size={12} className="text-gray-400 mr-1" />
                                <span className="text-sm text-gray-500">
                                  {historyItem.location}
                                </span>
                              </div>
                            )}
                            {historyItem.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {historyItem.description}
                              </p>
                            )}
                          </div>
                        )}

                        {state === 'current' && !historyItem && (
                          <p className="text-sm text-blue-500 font-medium">In Progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-200"
            onClick={() => setShowDetails(!showDetails)}
          >
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showDetails && (
            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Order Items */}
                <div className="space-y-6">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Order Items ({order.items?.length || 0})
                  </h4>
                  
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.images?.[0] || item.image || '/api/placeholder/64/80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <span className="text-gray-600">Size: <span className="text-gray-900">{item.size || 'N/A'}</span></span>
                            <span className="text-gray-600">Qty: <span className="text-gray-900">{item.quantity}</span></span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            {currency}{(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Shipping Address
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <address className="not-italic text-gray-700">
                        <p className="mt-1">{order.address?.street || 'N/A'}</p>
                        <p>
                          {order.address?.city || ''}{order.address?.city && order.address?.state ? ', ' : ''}
                          {order.address?.state || ''} {order.address?.pincode || order.address?.zipCode || ''}
                        </p>
                        <p>{order.address?.country || 'N/A'}</p>
                        {order.address?.phone && (
                          <div className="flex items-center mt-2">
                            <Phone size={14} className="text-gray-400 mr-2" />
                            <span>{order.address.phone}</span>
                          </div>
                        )}
                      </address>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Order Summary
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>
                          {currency}
                          {order.amount
                            ? (order.amount - (order.delivery_fee || 0) - (order.tax || 0)).toFixed(2)
                            : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Shipping</span>
                        <span>{currency}{order.delivery_fee ? order.delivery_fee.toFixed(2) : '0.00'}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Tax</span>
                          <span>{currency}{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{currency}{order.amount ? order.amount.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Payment Method
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 font-medium">{order.paymentMethod || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;