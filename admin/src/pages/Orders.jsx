import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar,
  Package2,
  Filter,
  Search,
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  Package,
  PackageCheck,
  AlertCircle,
  Phone,
  Mail,
  IndianRupee,
  Grid,
  List as ListIcon,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    "Order Placed": { 
      color: "bg-blue-100 text-blue-700 border-blue-200", 
      icon: Package,
      dotColor: "bg-blue-500" 
    },
    "Processing": { 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
      icon: Clock,
      dotColor: "bg-yellow-500" 
    },
    "Shipping": { 
      color: "bg-purple-100 text-purple-700 border-purple-200", 
      icon: Truck,
      dotColor: "bg-purple-500" 
    },
    "Out of delivery": { 
      color: "bg-orange-100 text-orange-700 border-orange-200", 
      icon: Package2,
      dotColor: "bg-orange-500" 
    },
    "Delivered": { 
      color: "bg-green-100 text-green-700 border-green-200", 
      icon: PackageCheck,
      dotColor: "bg-green-500" 
    }
  };

  const config = statusConfig[status] || statusConfig["Order Placed"];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      <Icon size={12} />
      {status}
    </span>
  );
};

const PaymentBadge = ({ payment, paymentMethod }) => (
  <div className="space-y-1">
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {payment ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {payment ? 'Paid' : 'Pending'}
    </span>
    <p className="text-xs text-gray-600">{paymentMethod}</p>
  </div>
);

const OrderCard = ({ order, index, onStatusChange }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    {/* Header */}
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order #{index + 1}</h3>
            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString('en-US', { 
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

      {/* Order Items */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={14} />
          Items ({order.items.length})
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package size={14} className="text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-600">
                  Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <User size={14} />
            Customer Details
          </h4>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">{order.address.Name}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={12} />
              <span>{order.address.phone}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <MapPin size={14} />
            Delivery Address
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.country}</p>
            <p>PIN: {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Payment & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <CreditCard size={14} />
            Payment
          </h4>
          <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <IndianRupee size={14} />
            Total Amount
          </h4>
          <p className="text-lg font-semibold text-green-600">
            {currency} {order.amount}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
            <Package2 size={14} />
            Update Status
          </h4>
          <select 
            onChange={(event) => onStatusChange(event, order._id)} 
            value={order.status} 
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
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
);

const OrderTable = ({ orders, onStatusChange }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">#{index + 1}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{order.address.Name}</p>
                  <p className="text-sm text-gray-600">{order.address.phone}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-900">
                      {item.name} x{item.quantity}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 font-semibold text-green-600">
                  <IndianRupee size={14} />
                  {order.amount}
                </div>
              </td>
              <td className="px-6 py-4">
                <PaymentBadge payment={order.payment} paymentMethod={order.paymentMethod} />
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4">
                <select 
                  onChange={(event) => onStatusChange(event, order._id)} 
                  value={order.status} 
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                >
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
  </div>
);

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Fetch Orders
  const fetchAllOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const ordersData = response.data.orders.reverse();
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status', 
        { orderId, status: event.target.value }, 
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Order status updated successfully');
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.address.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.phone.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(order => order.status === 'Order Placed').length,
    processing: orders.filter(order => order.status === 'Processing').length,
    delivered: orders.filter(order => order.status === 'Delivered').length,
    revenue: orders.reduce((sum, order) => sum + parseFloat(order.amount), 0)
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-indigo-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchAllOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <PackageCheck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{currency}{stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-text rounded-2xl shadow-sm border border-secondary mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders by customer name, phone, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors appearance-none"
                >
                  <option value="">All Status</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Out of delivery">Out of delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Payment Filter */}
            <div className="lg:w-48">
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors appearance-none"
                >
                  <option value="">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <Grid size={20} className={viewMode === 'cards' ? 'text-indigo-600' : 'text-gray-600'} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              >
                <ListIcon size={20} className={viewMode === 'table' ? 'text-indigo-600' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        {loading ? (
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-12">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg text-gray-600">Loading orders...</span>
              </div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-text rounded-2xl shadow-sm border border-secondary p-12">
            <div className="text-center">
              <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {orders.length === 0 ? "No orders have been placed yet" : "Try adjusting your search or filters"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <div className="space-y-6">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={index}
                    order={order}
                    index={index}
                    onStatusChange={statusHandler}
                  />
                ))}
              </div>
            ) : (
              <OrderTable 
                orders={filteredOrders} 
                onStatusChange={statusHandler} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;