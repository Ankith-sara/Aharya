import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import {
  Package, Truck, CheckCircle, Clock, MapPin, AlertCircle,
  ChevronDown, ChevronUp, ArrowLeft, Calendar
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
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        // Demo mode - using static data
        if (!backendUrl || !token || !orderId) {
          // Mock data similar to paste-2.txt example
          const mockOrder = {
            _id: 'ORD-75209634',
            date: '2025-04-22T14:35:00Z',
            estimatedDelivery: '2025-05-01T17:00:00Z',
            status: 'In Transit',
            customer: {
              name: 'Alex Johnson',
              email: 'alex@example.com',
            },
            address: {
              firstName: 'Alex',
              lastName: 'Johnson',
              street: '123 Fashion Avenue',
              city: 'New York',
              state: 'NY',
              pincode: '10001',
              country: 'United States',
              phone: '555-123-4567'
            },
            items: [
              {
                id: 'PROD-12345',
                name: 'Premium Cotton T-Shirt',
                price: 49.99,
                quantity: 2,
                size: 'M',
                image: '/api/placeholder/120/150'
              },
              {
                id: 'PROD-67890',
                name: 'Slim Fit Denim Jeans',
                price: 89.99,
                quantity: 1,
                size: 'L',
                image: '/api/placeholder/120/150'
              }
            ],
            trackingNumber: 'TRK-8347562190',
            carrier: 'Premium Logistics',
            trackingHistory: [
              {
                status: 'Order Placed',
                location: 'Online',
                timestamp: '2025-04-22T14:35:00Z',
                description: 'Your order has been confirmed and payment processed.'
              },
              {
                status: 'Processing',
                location: 'New York Warehouse',
                timestamp: '2025-04-23T09:12:00Z',
                description: 'Your order is being prepared for shipment.'
              },
              {
                status: 'Shipped',
                location: 'New York Distribution Center',
                timestamp: '2025-04-25T16:48:00Z',
                description: 'Your package has left our warehouse and is on its way.'
              },
              {
                status: 'In Transit',
                location: 'Chicago Sorting Facility',
                timestamp: '2025-04-27T10:23:00Z',
                description: 'Your package is in transit to the next facility.'
              }
            ],
            amount: 221.37,
            delivery_fee: 15.00,
            tax: 16.40,
            paymentMethod: 'Credit Card (ending in 4321)'
          };

          setOrder(mockOrder);
        } else {
          // Fetch from API if we have real credentials
          const response = await fetch(
            `${backendUrl}/api/order/track/${orderId}`,
            { headers: { token } }
          );

          const data = await response.json();

          if (data.success) {
            setOrder(data.order);
          } else {
            throw new Error(data.message || 'Failed to load order');
          }
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
      case 'Order Placed': return <Clock size={24} />;
      case 'Processing': return <Package size={24} />;
      case 'Shipping': return <Package size={24} />;
      case 'Out for Delivery': return <Truck size={24} />;
      case 'Delivered': return <CheckCircle size={24} />;
      default: return <AlertCircle size={24} />;
    }
  };

  // Determine status for the complete timeline
  const getStatusState = (status) => {
    if (!order || !order.status) return 'upcoming';

    const currentStatusIndex = allStatuses.indexOf(order.status);
    const statusIndex = allStatuses.indexOf(status);

    if (statusIndex < 0) return 'upcoming';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-red-600">{error || 'Order not found.'}</span>
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
    <div className="min-h-screen bg-white text-black mt-20 mb-10 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-12">
        <Title text1="ORDER" text2="TRACKING" />
      </div>

      {/* Tracking Results */}
      <div className="max-w-5xl mx-auto">
        {/* Order Status Banner */}
        <div className="bg-gray-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-300">Order: {order._id}</p>
            <h2 className="text-xl font-medium mt-1">
              Status: {order.status}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">
                {order.estimatedDelivery ? 'Expected Delivery' : 'Order Placed'}
              </p>
              <p className="font-medium">
                {formatDate(order.estimatedDelivery || order.date)}
              </p>
            </div>
            <Calendar size={24} />
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium">Tracking Progress</h3>
          </div>

          {/* Complete Timeline */}
          <div className="p-6 w-full overflow-x-auto">
            <div className="relative min-w-max">
              {/* Horizontal line */}
              <div className="absolute top-16 left-0 w-full h-0.5 bg-gray-200"></div>

              {/* Status points */}
              <div className="flex">
                {allStatuses.map((status, index) => {
                  const state = getStatusState(status);
                  const historyItem = findHistoryForStatus(status);

                  return (
                    <div key={index} className="flex-1 px-2 first:pl-0 last:pr-0 min-w-48">
                      <div className="flex flex-col items-center">
                        {/* Icon circle */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full transition-all ${state === 'completed'
                              ? 'bg-green-500 text-white border-2 border-green-500'
                              : state === 'current'
                                ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg animate-pulse'
                                : 'border-2 border-gray-300 bg-white text-gray-400'
                            }`}
                        >
                          {state === 'completed'
                            ? <CheckCircle size={24} />
                            : getStatusIcon(status)}
                        </div>

                        {/* Status label and details */}
                        <div className="mt-4 text-center">
                          <h4 className={`text-md font-medium ${state === 'upcoming' ? 'text-gray-400' :
                              state === 'current' ? 'text-blue-600' : 'text-black'
                            }`}>
                            {status}
                          </h4>

                          {historyItem && (
                            <>
                              <span className="text-xs text-gray-500 block mt-1">
                                {formatDate(historyItem.timestamp)}, {formatTime(historyItem.timestamp)}
                              </span>
                              <p className={`mt-2 text-sm ${state === 'upcoming' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {historyItem.description}
                              </p>
                              <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                                <MapPin size={12} className="mr-1" />
                                {historyItem.location}
                              </div>
                            </>
                          )}

                          {state === 'current' && !historyItem && (
                            <p className="mt-1 text-sm text-blue-600">Current stage</p>
                          )}

                          {state === 'upcoming' && !historyItem && (
                            <p className="mt-1 text-sm text-gray-400">Awaiting</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Toggle */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <button
            className="w-full p-6 flex justify-between items-center border-b border-gray-200 hover:bg-gray-50 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            <h3 className="text-lg font-medium">Order Details</h3>
            {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showDetails && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Items */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Items in this order</h4>
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                          <img
                            src={item.images?.[0] || item.image || '/api/placeholder/120/150'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-medium">{item.name}</h5>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>Size: {item.size || 'N/A'}</p>
                            <p>Qty: {item.quantity}</p>
                            <p className="font-medium text-black">
                              {currency}{(item.price || 0).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-8">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Shipping Address</h4>
                    <address className="not-italic">
                      <p className="font-medium">
                        {order.address?.firstName || ''} {order.address?.lastName || order.customer?.name || ''}
                      </p>
                      <p>{order.address?.street || 'N/A'}</p>
                      <p>
                        {order.address?.city || ''}{order.address?.city && order.address?.state ? ', ' : ''}
                        {order.address?.state || ''} {order.address?.pincode || order.address?.zipCode || ''}
                      </p>
                      <p>{order.address?.country || 'N/A'}</p>
                      {order.address?.phone && <p>Phone: {order.address.phone}</p>}
                    </address>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>
                          {currency}
                          {order.amount
                            ? (order.amount - (order.delivery_fee || 0) - (order.tax || 0)).toFixed(2)
                            : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{currency}{order.delivery_fee ? order.delivery_fee.toFixed(2) : '0.00'}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{currency}{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{currency}{order.amount ? order.amount.toFixed(2) : '--'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Payment Method</h4>
                    <p>{order.paymentMethod || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-start mt-10">
          <button onClick={() => window.history.back()} className="flex items-center text-gray-700 hover:text-black transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;