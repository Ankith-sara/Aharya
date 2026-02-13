import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingBag, User, MapPin, CreditCard, Package2, Filter, Search, CheckCircle, Clock, Truck, Package, PackageCheck, AlertCircle, Phone, IndianRupee, ChevronLeft, ChevronRight, TrendingUp, BarChart3, RefreshCw
} from 'lucide-react';
import { backendUrl, currency } from '../App';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Package,
      dotColor: "bg-blue-500"
    },
    "Processing": {
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: Clock,
      dotColor: "bg-yellow-500"
    },
    "Shipping": {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Truck,
      dotColor: "bg-purple-500"
    },
    "Out of delivery": {
      color: "bg-orange-50 text-orange-700 border-orange-200",
      icon: Package2,
      dotColor: "bg-orange-500"
    },
    "Delivered": {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: PackageCheck,
      dotColor: "bg-green-500"
    }
  };

  const config = statusConfig[status] || statusConfig["Order Placed"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs font-light uppercase tracking-wider ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      <Icon size={12} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-2">
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-light uppercase tracking-wider ${payment ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
      {payment ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{paymentMethod}</p>
  </div>
);

const OrderCard = ({ order, orderNumber, onStatusChange }) => (
  <div className="bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
    <div className="bg-gray-50 border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag size={20} className="text-gray-600" />
          <div>
            <h3 className="text-lg font-medium uppercase tracking-wide text-black">Order #{orderNumber}</h3>
            <p className="text-gray-600 mt-1 text-xs font-light uppercase tracking-wider">{new Date(order.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </div>

    <div className="p-6 space-y-1">
      {/* Order Items */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
            <Package size={16} />
            Order Items ({order.items.length})
          </h4>
        </div>
        <div className="p-4">
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm uppercase tracking-wide">{item.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-600 font-light uppercase tracking-wide">Qty: {item.quantity}</span>
                    {item.size && (
                      <span className="text-xs text-gray-600 font-light uppercase tracking-wide">Size: {item.size}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
              <User size={16} />
              Customer Information
            </h4>
          </div>
          <div className="p-4 space-y-3">
            <p className="font-medium text-gray-900 uppercase tracking-wide">{order.address.Name}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span className="text-sm font-light">{order.address.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
              <MapPin size={16} />
              Delivery Address
            </h4>
          </div>
          <div className="p-4 space-y-1 text-sm text-gray-600 font-light">
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.country}</p>
            <p className="font-medium uppercase tracking-wide">PIN: {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Payment, Amount & Status Update */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
              <CreditCard size={16} />
              Payment Status
            </h4>
          </div>
          <div className="p-4">
            <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
              <IndianRupee size={16} />
              Total Amount
            </h4>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1">
              <IndianRupee size={18} className="text-black" />
              <span className="text-xl font-medium text-black">{order.amount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 uppercase tracking-wide">
              <Package2 size={16} />
              Update Status
            </h4>
          </div>
          <div className="p-4">
            <select
              onChange={(event) => onStatusChange(event, order._id)}
              value={order.status}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm font-light uppercase tracking-wide"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipping">Shipping</option>
              <option value="Out of delivery">Out of delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [authError, setAuthError] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error('Authentication token is missing. Please log in again.');
      setAuthError(true);
      return;
    }

    setLoading(true);
    setAuthError(false);

    try {
      const response = await axios.get(
        `${backendUrl}/api/order/list`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const ordersData = response.data.orders.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401) {
          setAuthError(true);
          toast.error('Authentication failed. Please log in again.');
        } else if (status === 403) {
          toast.error('Access denied. You do not have permission to view orders.');
        } else if (status === 404) {
          toast.error('Orders endpoint not found. Please check the API configuration.');
        } else {
          toast.error(`Server Error: ${message || 'Unable to fetch orders'}`);
        }
      } else if (error.request) {
        toast.error('Network Error: Could not connect to the server');
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to update order status');
      }
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    let filtered = orders;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.address?.Name?.toLowerCase().includes(searchLower) ||
        order.address?.phone?.includes(searchTerm) ||
        order.items?.some(item => item.name?.toLowerCase().includes(searchLower)) ||
        order.address?.city?.toLowerCase().includes(searchLower) ||
        order.address?.country?.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(order => {
        if (paymentFilter === 'paid') return order.payment;
        if (paymentFilter === 'pending') return !order.payment;
        return true;
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Order Placed').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    revenue: orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0)
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={64} />
          <h2 className="text-2xl font-medium text-black mb-2 uppercase tracking-wide">Authentication Required</h2>
          <p className="text-gray-600 mb-6 font-light">
            Your session has expired or you don't have permission to view orders. Please log in again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide font-light"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-black mb-3 tracking-wide uppercase">Order Management</h1>
          <div className="w-20 h-0.5 bg-black mb-4"></div>
          <p className="text-gray-600 font-light tracking-wide">
            Track, manage, and update all customer orders from one dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="bg-white border border-gray-200 shadow-sm mb-1 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-gray-600" />
              <h2 className="text-lg font-medium uppercase tracking-wide text-black">Order Statistics</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center p-6 bg-gray-50 border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider font-light">Total Orders</p>
                <p className="text-3xl font-light text-black">{stats.total}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider font-light">Pending</p>
                <p className="text-3xl font-light text-black">{stats.pending}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <Package className="text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider font-light">Processing</p>
                <p className="text-3xl font-light text-black">{stats.processing}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <PackageCheck className="text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider font-light">Delivered</p>
                <p className="text-3xl font-light text-black">{stats.delivered}</p>
              </div>

              <div className="text-center p-6 bg-gray-50 border border-gray-200">
                <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-gray-600" size={24} />
                </div>
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wider font-light">Revenue</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee size={18} className="text-black" />
                  <span className="text-2xl font-light text-black">{stats.revenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 shadow-sm mb-1 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-gray-600" />
                <h2 className="text-lg font-medium uppercase tracking-wide text-black">Search & Filter</h2>
              </div>
              <button
                onClick={fetchAllOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white transition-all duration-300 disabled:opacity-50 uppercase tracking-wide text-xs font-light"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by customer, phone, product, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Filter by Status</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none"
                  >
                    <option value="">All Status</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Out of delivery">Out of delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Payment Status</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none"
                  >
                    <option value="">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <div className="text-xs text-gray-600 uppercase tracking-wider font-light">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-gray-600" />
              <h2 className="text-lg font-medium uppercase tracking-wide text-black">Customer Orders</h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-light uppercase tracking-wide">Loading orders...</span>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-medium text-black mb-2 uppercase tracking-wide">No orders found</h3>
                <p className="text-gray-600 max-w-md mx-auto font-light">
                  {orders.length === 0
                    ? "Your store hasn't received any orders yet"
                    : "Try adjusting your filters"}
                </p>
                {(searchTerm || statusFilter || paymentFilter) ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                      setPaymentFilter('');
                    }}
                    className="mt-6 px-8 py-3 bg-black text-white uppercase tracking-wide font-light hover:bg-gray-800 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentItems.map((order, index) => (
                    <OrderCard
                      key={order._id || index}
                      order={order}
                      orderNumber={startIndex + index + 1}
                      onStatusChange={statusHandler}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                    <div className="text-sm text-gray-600 font-light">
                      Page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                        title="Previous Page"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
                        title="Next Page"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 font-light">
                      {filteredOrders.length} total items
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;