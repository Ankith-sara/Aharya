import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ShoppingBag, User, MapPin, CreditCard, Package2, Filter, Search,
  CheckCircle, Clock, Truck, Package, PackageCheck, AlertCircle,
  Phone, IndianRupee, ChevronLeft, ChevronRight, TrendingUp, BarChart3, RefreshCw
} from 'lucide-react';
import { backendUrl, currency } from '../App';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed":   { color: "bg-blue-50 text-blue-700 border-blue-200",   icon: Package,     dotColor: "bg-blue-500"   },
    "Processing":     { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock,   dotColor: "bg-yellow-500" },
    "Shipping":       { color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck,   dotColor: "bg-purple-500" },
    "Out of delivery":{ color: "bg-orange-50 text-orange-700 border-orange-200", icon: Package2,dotColor: "bg-orange-500" },
    "Delivered":      { color: "bg-green-50 text-green-700 border-green-200",  icon: PackageCheck,dotColor:"bg-green-500" }
  };
  const config = statusConfig[status] || statusConfig["Order Placed"];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 border text-xs font-light uppercase tracking-wider whitespace-nowrap ${config.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor}`}></div>
      <Icon size={11} className="flex-shrink-0" />
      <span className="hidden sm:inline">{status}</span>
      <span className="sm:hidden">{status === 'Order Placed' ? 'Placed' : status === 'Out of delivery' ? 'Out' : status}</span>
    </span>
  );
};

const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-1.5">
    <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 border text-xs font-light uppercase tracking-wider ${payment ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
      {payment ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{paymentMethod}</p>
  </div>
);

const OrderCard = ({ order, orderNumber, onStatusChange }) => (
  <div className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">

    {/* Card header */}
    <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-6">
      <div className="flex items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <ShoppingBag size={15} className="text-gray-600 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-medium uppercase tracking-wide text-black leading-tight">Order #{orderNumber}</h3>
            <p className="text-gray-500 mt-0.5 text-xs font-light uppercase tracking-wider">
              {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </div>

    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">

      {/* Order Items */}
      <div className="border border-gray-200 overflow-hidden">
        <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
          <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Package size={13} /> Items ({order.items.length})
          </h4>
        </div>
        <div className="p-2 sm:p-4">
          <div className="space-y-2 max-h-36 sm:max-h-48 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-xs sm:text-sm uppercase tracking-wide">{item.name}</p>
                  <div className="flex items-center gap-2 sm:gap-4 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500 font-light uppercase">Qty: {item.quantity}</span>
                    {item.size && <span className="text-xs text-gray-500 font-light uppercase">Size: {item.size}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer & Address — 2 cols on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
              <User size={12} /> Customer
            </h4>
          </div>
          <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
            <p className="font-medium text-gray-900 uppercase tracking-wide text-xs sm:text-sm">{order.address.Name}</p>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Phone size={12} className="flex-shrink-0" />
              <span className="text-xs font-light">{order.address.phone}</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
              <MapPin size={12} /> Address
            </h4>
          </div>
          <div className="p-2.5 sm:p-4 space-y-0.5 text-xs text-gray-600 font-light">
            <p className="truncate">{order.address.street}</p>
            <p>{order.address.city}, {order.address.country}</p>
            <p className="font-medium uppercase tracking-wide">PIN: {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Payment / Amount / Status — 1 col mobile, 3 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
              <CreditCard size={12} /> Payment
            </h4>
          </div>
          <div className="p-2.5 sm:p-4">
            <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
          </div>
        </div>

        <div className="border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
              <IndianRupee size={12} /> Amount
            </h4>
          </div>
          <div className="p-2.5 sm:p-4">
            <div className="flex items-center gap-0.5">
              <IndianRupee size={15} className="text-black" />
              <span className="text-lg sm:text-xl font-medium text-black">{order.amount}</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="text-xs font-medium text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Package2 size={12} /> Update
            </h4>
          </div>
          <div className="p-2.5 sm:p-4">
            <select
              onChange={(e) => onStatusChange(e, order._id)}
              value={order.status}
              className="w-full px-2 sm:px-3 py-2 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-xs font-light uppercase tracking-wide"
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchAllOrders = async () => {
    if (!token) { toast.error('Authentication token missing.'); setAuthError(true); return; }
    setLoading(true); setAuthError(false);
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        const ordersData = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(ordersData); setFilteredOrders(ordersData);
      } else toast.error(response.data.message || 'Failed to fetch orders');
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) { setAuthError(true); toast.error('Authentication failed. Please log in again.'); }
        else if (status === 403) toast.error('Access denied.');
        else toast.error(`Server Error: ${data?.message || 'Unable to fetch orders'}`);
      } else if (error.request) toast.error('Network Error: Could not connect.');
      else toast.error(`Error: ${error.message}`);
    } finally { setLoading(false); }
  };

  const statusHandler = async (event, orderId) => {
    if (!token) { toast.error('Authentication required'); return; }
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`,
        { orderId, status: event.target.value },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (response.data.success) { toast.success('Order status updated'); await fetchAllOrders(); }
      else toast.error(response.data.message || 'Failed to update status');
    } catch (error) {
      if (error.response?.status === 401) toast.error('Authentication failed.');
      else toast.error('Failed to update order status');
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else if (currentPage <= 3) { [1,2,3,4,'...',totalPages].forEach(p => pages.push(p)); }
    else if (currentPage >= totalPages - 2) { [1,'...',totalPages-3,totalPages-2,totalPages-1,totalPages].forEach(p => pages.push(p)); }
    else { [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages].forEach(p => pages.push(p)); }
    return pages;
  };

  useEffect(() => {
    let filtered = orders;
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(o =>
        o.address?.Name?.toLowerCase().includes(s) || o.address?.phone?.includes(searchTerm) ||
        o.items?.some(item => item.name?.toLowerCase().includes(s)) ||
        o.address?.city?.toLowerCase().includes(s) || o.address?.country?.toLowerCase().includes(s)
      );
    }
    if (statusFilter) filtered = filtered.filter(o => o.status === statusFilter);
    if (paymentFilter) filtered = filtered.filter(o => paymentFilter === 'paid' ? o.payment : !o.payment);
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => { fetchAllOrders(); }, [token]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Order Placed').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0)
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-6 sm:p-8 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-xl sm:text-2xl font-medium text-black mb-2 uppercase tracking-wide">Authentication Required</h2>
          <p className="text-gray-600 mb-6 font-light text-sm">Your session has expired. Please log in again.</p>
          <button onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide font-light text-sm">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light text-black mb-2 sm:mb-3 tracking-wide uppercase">Order Management</h1>
          <div className="w-16 sm:w-20 h-0.5 bg-black mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 font-light tracking-wide">Track, manage, and update all customer orders</p>
        </div>

        {/* Stats — 2 cols mobile, 3 cols sm, 5 cols lg */}
        <div className="bg-white border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 sm:gap-3">
              <BarChart3 size={18} className="text-gray-600" />
              <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Order Statistics</h2>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
              {[
                { label: 'Total Orders', value: stats.total, icon: ShoppingBag },
                { label: 'Pending',      value: stats.pending, icon: Clock },
                { label: 'Processing',   value: stats.processing, icon: Package },
                { label: 'Delivered',    value: stats.delivered, icon: PackageCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="text-center p-3 sm:p-6 bg-gray-50 border border-gray-200">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon className="text-gray-600" size={18} />
                  </div>
                  <p className="text-xs text-gray-600 mb-1 sm:mb-2 uppercase tracking-wider font-light leading-tight">{label}</p>
                  <p className="text-2xl sm:text-3xl font-light text-black">{value}</p>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1 text-center p-3 sm:p-6 bg-gray-50 border border-gray-200">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white border border-gray-200 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <TrendingUp className="text-gray-600" size={18} />
                </div>
                <p className="text-xs text-gray-600 mb-1 sm:mb-2 uppercase tracking-wider font-light">Revenue</p>
                <div className="flex items-center justify-center gap-0.5">
                  <IndianRupee size={15} className="text-black" />
                  <span className="text-xl sm:text-2xl font-light text-black">{stats.revenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Search size={18} className="text-gray-600" />
                <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Search & Filter</h2>
              </div>
              <button onClick={fetchAllOrders} disabled={loading}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-black hover:bg-gray-800 text-white transition-all duration-300 disabled:opacity-50 uppercase tracking-wide text-xs font-light">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <input type="text" placeholder="Customer, phone, product, location..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none text-sm">
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
                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Payment</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 appearance-none text-sm">
                    <option value="">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-600 uppercase tracking-wider font-light">
                {filteredOrders.length > 0
                  ? `${startIndex + 1}–${Math.min(endIndex, filteredOrders.length)} of ${filteredOrders.length} orders`
                  : '0 orders'}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingBag size={18} className="text-gray-600" />
              <h2 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Customer Orders</h2>
            </div>
          </div>

          <div className="p-3 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 font-light uppercase tracking-wide">Loading orders...</span>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={52} />
                <h3 className="text-lg sm:text-xl font-medium text-black mb-2 uppercase tracking-wide">No orders found</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto font-light px-4">
                  {orders.length === 0 ? "Your store hasn't received any orders yet" : "Try adjusting your filters"}
                </p>
                {(searchTerm || statusFilter || paymentFilter) && (
                  <button onClick={() => { setSearchTerm(''); setStatusFilter(''); setPaymentFilter(''); }}
                    className="mt-6 px-6 sm:px-8 py-3 bg-black text-white text-sm uppercase tracking-wide font-light hover:bg-gray-800 transition-all duration-300">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* 2-col grid on mobile/sm, 1-col on md+ for full-width order cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                  {currentItems.map((order, index) => (
                    <OrderCard key={order._id || index} order={order}
                      orderNumber={startIndex + index + 1} onStatusChange={statusHandler} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 pt-4 sm:pt-6">
                    <div className="text-xs sm:text-sm text-gray-600 font-light order-2 sm:order-1">
                      Page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
                      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                        className="p-1.5 sm:p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                        <ChevronLeft size={15} />
                      </button>
                      <div className="flex gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`e-${index}`} className="px-2 py-1.5 text-gray-400 text-sm">...</span>
                          ) : (
                            <button key={page} onClick={() => goToPage(page)}
                              className={`w-8 h-8 sm:w-9 sm:h-9 text-xs border transition-all duration-300 ${currentPage === page ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                              {page}
                            </button>
                          )
                        ))}
                      </div>
                      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                        className="p-1.5 sm:p-2 border border-gray-300 hover:border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                        <ChevronRight size={15} />
                      </button>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-light order-3">{filteredOrders.length} total</div>
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