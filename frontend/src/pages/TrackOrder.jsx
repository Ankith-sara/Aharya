import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ChevronDown, ChevronUp, ArrowLeft, Calendar } from 'lucide-react';

const TrackOrder = () => {
  const { currency } = useContext(ShopContext);
  const [showDetails, setShowDetails] = useState(false);

  // Mock order tracking data (displayed directly)
  const trackingData = {
    orderId: 'ORD-75209634',
    placedDate: '2025-04-22T14:35:00Z',
    estimatedDelivery: '2025-05-01T17:00:00Z',
    status: 'In Transit',
    customer: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
    },
    shippingAddress: {
      street: '123 Fashion Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
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
    subtotal: 189.97,
    shipping: 15.00,
    tax: 16.40,
    total: 221.37,
    paymentMethod: 'Credit Card (ending in 4321)'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <Clock size={22} />;
      case 'Processing': return <Package size={22} />;
      case 'Shipped': return <Package size={22} />;
      case 'In Transit': return <Truck size={22} />;
      case 'Out for Delivery': return <Truck size={22} />;
      case 'Delivered': return <CheckCircle size={22} />;
      default: return <AlertCircle size={22} />;
    }
  };

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
            <p className="text-sm text-gray-300">Order #{trackingData.orderId}</p>
            <h2 className="text-xl font-medium mt-1">
              Status: {trackingData.status}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Expected Delivery</p>
              <p className="font-medium">{formatDate(trackingData.estimatedDelivery)}</p>
            </div>
            <Calendar size={24} />
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Tracking Progress</h3>
              <div>
                <span className="text-sm text-gray-500 mr-2">Tracking Number:</span>
                <span className="font-medium">{trackingData.trackingNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Visual Timeline */}
          <div className="p-6">
            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute left-6 ml-1 top-1 h-full w-0.5 bg-gray-200"></div>
              
              {/* Timeline items */}
              {trackingData.trackingHistory.map((event, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="flex items-start">
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      index === 0 ? 'border-black bg-black text-white' : 'border-gray-400 bg-white text-gray-700'
                    }`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="ml-6">
                      <div className="flex items-baseline">
                        <h4 className="text-lg font-medium">{event.status}</h4>
                        <span className="ml-4 text-sm text-gray-500">{formatDate(event.timestamp)}, {formatTime(event.timestamp)}</span>
                      </div>
                      <p className="mt-1 text-gray-600">{event.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                    {trackingData.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h5 className="font-medium">{item.name}</h5>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>Size: {item.size}</p>
                            <p>Qty: {item.quantity}</p>
                            <p className="font-medium text-black">
                              {currency}{item.price} each
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
                      <p className="font-medium">{trackingData.customer.name}</p>
                      <p>{trackingData.shippingAddress.street}</p>
                      <p>{trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zipCode}</p>
                      <p>{trackingData.shippingAddress.country}</p>
                    </address>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Order Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{currency}{trackingData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{currency}{trackingData.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{currency}{trackingData.tax.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-medium">
                        <span>Total</span>
                        <span>{currency}{trackingData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider font-medium text-gray-500 mb-4">Payment Method</h4>
                    <p>{trackingData.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Back Button */}
        <div className="flex justify-start mt-10">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-gray-700 hover:text-black transition-colors"
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