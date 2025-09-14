import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import {
  Package, Truck, CheckCircle, Clock, MapPin, AlertCircle,
  ChevronDown, ChevronUp, ArrowLeft, Calendar, Phone,
  Hash, CreditCard
} from 'lucide-react';

const TrackOrder = () => {
  const { backendUrl, currency, token } = useContext(ShopContext);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <CheckCircle size={16} />;
      case 'Processing': return <Package size={16} />;
      case 'Shipping': return <Truck size={16} />;
      case 'Out for Delivery': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Out for Delivery':
      case 'Shipping':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Order Placed':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
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
      <div className="min-h-screen bg-white text-black mt-20">
        <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-3xl mb-6">
                <Title text1="ORDER" text2="TRACKING" />
              </div>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <span className="text-gray-600 font-light">Loading order details...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white text-black mt-20">
        <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-3xl mb-6">
                <Title text1="ORDER" text2="TRACKING" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 shadow-sm">
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <div className="text-center max-w-md mb-8">
                <h3 className="text-2xl font-medium mb-3 tracking-wide">ORDER NOT FOUND</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {error || 'The order you are looking for could not be found.'}
                </p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
              >
                VIEW ALL ORDERS
              </button>
            </div>
          </div>
        </section>
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
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">
              <Title text1="ORDER" text2="TRACKING" />
            </div>
            <p className="text-gray-500 font-light">
              Track your order progress and delivery status
            </p>
          </div>
        </div>
      </section>

      {/* Order Status Card */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Order Header Card */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER ID:</span>
                    <span className="font-medium text-black tracking-wide">{order._id?.slice(-8)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600 font-light">{formatDate(order.date)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600 font-light">{order.paymentMethod || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 border text-xs font-medium uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2 font-light">
                  <span className="uppercase tracking-wider">Order Progress</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 h-1">
                  <div
                    className="bg-black h-1 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-6">
              <h3 className="text-xl font-medium mb-8 text-black tracking-wide uppercase">Tracking Timeline</h3>
              
              {/* Desktop Timeline */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
                  <div 
                    className="absolute top-6 left-0 h-0.5 bg-black transition-all duration-1000"
                    style={{ width: `${(getProgressPercentage() / 100) * 100}%` }}
                  ></div>

                  <div className="flex justify-between relative">
                    {allStatuses.map((status, index) => {
                      const state = getStatusState(status);
                      const historyItem = findHistoryForStatus(status);
                      
                      return (
                        <div key={index} className="flex-1 relative">
                          <div className="flex flex-col items-center">
                            {/* Status Circle */}
                            <div
                              className={`relative z-10 flex items-center justify-center w-12 h-12 border-2 transition-all duration-300 ${
                                state === 'completed'
                                  ? 'bg-black border-black text-white'
                                  : state === 'current'
                                  ? 'bg-white border-black text-black'
                                  : 'bg-white border-gray-300 text-gray-400'
                              }`}
                            >
                              {getStatusIcon(status)}
                            </div>

                            {/* Status Details */}
                            <div className="mt-4 text-center max-w-32">
                              <h4
                                className={`font-medium text-sm uppercase tracking-wide ${
                                  state === 'upcoming'
                                    ? 'text-gray-400'
                                    : state === 'current'
                                    ? 'text-black'
                                    : 'text-black'
                                }`}
                              >
                                {status}
                              </h4>

                              {historyItem && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-xs text-gray-500 font-light">
                                    {formatDate(historyItem.timestamp)}
                                  </p>
                                  <p className="text-xs text-gray-500 font-light">
                                    {formatTime(historyItem.timestamp)}
                                  </p>
                                  {historyItem.location && (
                                    <div className="flex items-center justify-center mt-1">
                                      <MapPin size={10} className="text-gray-400 mr-1" />
                                      <span className="text-xs text-gray-400 font-light">
                                        {historyItem.location}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {state === 'current' && !historyItem && (
                                <p className="text-xs text-black mt-1 font-medium uppercase tracking-wider">In Progress</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                        className={`flex items-center justify-center w-12 h-12 border-2 transition-all ${
                          state === 'completed'
                            ? 'bg-black border-black text-white'
                            : state === 'current'
                            ? 'bg-white border-black text-black'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {getStatusIcon(status)}
                      </div>

                      {/* Status Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium uppercase tracking-wide ${
                            state === 'upcoming'
                              ? 'text-gray-400'
                              : 'text-black'
                          }`}
                        >
                          {status}
                        </h4>

                        {historyItem && (
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600 font-light">
                              {formatDate(historyItem.timestamp)} at {formatTime(historyItem.timestamp)}
                            </p>
                            {historyItem.location && (
                              <div className="flex items-center mt-1">
                                <MapPin size={12} className="text-gray-400 mr-1" />
                                <span className="text-sm text-gray-500 font-light">
                                  {historyItem.location}
                                </span>
                              </div>
                            )}
                            {historyItem.description && (
                              <p className="text-sm text-gray-600 font-light mt-1">
                                {historyItem.description}
                              </p>
                            )}
                          </div>
                        )}

                        {state === 'current' && !historyItem && (
                          <p className="text-sm text-black font-medium uppercase tracking-wider">In Progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <button
              className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-100"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h3 className="text-lg font-medium text-black uppercase tracking-wide">Order Details</h3>
              {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {showDetails && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Order Items */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Order Items ({order.items?.length || 0})
                    </h4>
                    
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 border border-gray-200 hover:shadow-sm transition-all duration-300">
                          <div className="w-16 h-full bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                            <img
                              src={item.images?.[0] || item.image || '/api/placeholder/64/80'}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-black">{item.name}</h5>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <span className="text-gray-600 font-light">
                                Size: <span className="text-black font-medium">{item.size || 'N/A'}</span>
                              </span>
                              <span className="text-gray-600 font-light">
                                Qty: <span className="text-black font-medium">{item.quantity}</span>
                              </span>
                            </div>
                            <p className="text-lg font-medium text-black mt-2">
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
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Shipping Address
                      </h4>
                      <div className="border border-gray-200 p-4">
                        <address className="not-italic text-gray-700 font-light">
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
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Order Summary
                      </h4>
                      <div className="border border-gray-200 p-4 space-y-3">
                        <div className="flex justify-between text-gray-700 font-light">
                          <span>Subtotal</span>
                          <span>
                            {currency}
                            {order.amount
                              ? (order.amount - (order.delivery_fee || 0) - (order.tax || 0)).toFixed(2)
                              : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-700 font-light">
                          <span>Shipping</span>
                          <span>{currency}{order.delivery_fee ? order.delivery_fee.toFixed(2) : '0.00'}</span>
                        </div>
                        {order.tax > 0 && (
                          <div className="flex justify-between text-gray-700 font-light">
                            <span>Tax</span>
                            <span>{currency}{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-medium text-black">
                          <span>Total</span>
                          <span>{currency}{order.amount ? order.amount.toFixed(2) : '0.00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Payment Method
                      </h4>
                      <div className="border border-gray-200 p-4">
                        <p className="text-gray-700 font-medium">{order.paymentMethod || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center pt-8">
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
            >
              <ArrowLeft size={16} />
              <span>BACK TO ORDERS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackOrder;