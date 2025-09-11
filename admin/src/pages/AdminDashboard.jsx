import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import {
    User, ShoppingBag, BarChart2, Edit2, X, Camera, Mail,
    TrendingUp, Package, Users, Calendar, Activity, Shield,
    Settings, Eye, ArrowUpRight, IndianRupee
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

import { backendUrl, currency } from "../App";

const AdminPanel = ({ token, setToken }) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();

    // Fetch admin data when component mounts
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const decoded = jwtDecode(token);
                const res = await axios.get(`${backendUrl}/api/user/profile/${decoded.id}`, { headers: { token } });
                if (res.data.success) {
                    setAdminData(res.data.user);
                }
            } catch (error) {
                if (error.response?.status === 401) navigate("/login");
            }
        };
        if (token) fetchAdminData();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                <Shield className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">Management Panel</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard'
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <BarChart2 size={16} />
                                Dashboard
                            </button>

                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'profile'
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <User size={16} />
                                Profile
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-8">
                {activeTab === "dashboard" && <AdminDashboard token={token} adminData={adminData} />}
                {activeTab === "profile" && <AdminProfile token={token} adminData={adminData} setAdminData={setAdminData} />}
            </main>
        </div>
    );
};

// --- Dashboard Component ---
const AdminDashboard = ({ token, adminData }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchOrders();
            fetchProducts();
        }
    }, [token]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                const fetchedOrders = response.data.orders || [];
                setOrders(fetchedOrders.slice().reverse());
                const totalRevenue = fetchedOrders.reduce((sum, order) => sum + order.amount, 0);
                setStats(prev => ({ ...prev, totalRevenue, totalOrders: fetchedOrders.length }));
            }
        } catch (error) {
            if (error.response?.status === 401) navigate("/login");
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`, { headers: { token } });
            if (response.data.success) {
                const fetchedProducts = response.data.products || [];
                setProducts(fetchedProducts);
                setStats(prev => ({ ...prev, totalProducts: fetchedProducts.length }));
            }
        } catch (error) {
            if (error.response?.status === 401) navigate("/login");
        }
    };

    // Chart configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#f9fafb',
                bodyColor: '#f9fafb',
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { 
                    color: 'rgba(107, 114, 128, 0.1)',
                    borderColor: 'rgba(107, 114, 128, 0.2)'
                },
                ticks: { 
                    color: '#6b7280',
                    font: { size: 12 }
                }
            },
            y: {
                grid: { 
                    color: 'rgba(107, 114, 128, 0.1)',
                    borderColor: 'rgba(107, 114, 128, 0.2)'
                },
                ticks: { 
                    color: '#6b7280',
                    font: { size: 12 }
                }
            }
        }
    };

    const orderDates = orders.map(order => new Date(order.date).toLocaleDateString());
    const salesData = orders.map(order => order.amount);

    const salesChart = {
        labels: orderDates.slice(0, 10).reverse(),
        datasets: [{
            label: "Sales Revenue",
            data: salesData.slice(0, 10).reverse(),
            borderColor: "#000000",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#000000",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
        }],
    };

    const ordersChart = {
        labels: orderDates.slice(0, 10).reverse(),
        datasets: [{
            label: "Items per Order",
            data: orders.slice(0, 10).reverse().map(o => o.items.length),
            backgroundColor: "#000000",
            borderRadius: 4,
        }],
    };

    return (
        <div className="max-w-8xl mx-auto space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">{currency} {stats.totalRevenue.toFixed(2)}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-green-600" />
                                <span className="text-sm text-green-600 font-medium">+12.5%</span>
                                <span className="text-sm text-gray-500">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <IndianRupee className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-blue-600" />
                                <span className="text-sm text-blue-600 font-medium">+8.2%</span>
                                <span className="text-sm text-gray-500">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-orange-600" />
                                <span className="text-sm text-orange-600 font-medium">+3.1%</span>
                                <span className="text-sm text-gray-500">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-black text-white p-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp size={24} className="text-gray-300" />
                            <div>
                                <h3 className="text-xl font-semibold">Sales Revenue</h3>
                                <p className="text-sm text-gray-300">Recent sales performance</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <Line data={salesChart} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-black text-white p-6">
                        <div className="flex items-center gap-3">
                            <BarChart2 size={24} className="text-gray-300" />
                            <div>
                                <h3 className="text-xl font-semibold">Order Volume</h3>
                                <p className="text-sm text-gray-300">Items per order analysis</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="h-64">
                            <Bar data={ordersChart} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-black text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag size={24} className="text-gray-300" />
                            <div>
                                <h3 className="text-xl font-semibold">Recent Orders</h3>
                                <p className="text-sm text-gray-300">Latest customer orders</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-lg">
                            <Eye size={16} />
                            View All
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.slice(0, 8).map((order, index) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{(index + 1).toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <User size={14} className="text-gray-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{order.address.Name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {currency} {order.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${order.payment
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {order.payment ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Admin Profile Component ---
const AdminProfile = ({ token, adminData, setAdminData }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProfile, setEditProfile] = useState({ name: "", email: "", image: null, imagePreview: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (adminData) {
            setEditProfile({
                name: adminData.name,
                email: adminData.email,
                image: null,
                imagePreview: adminData.image || ""
            });
        }
    }, [adminData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditProfile(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", editProfile.name);
        formData.append("email", editProfile.email);
        if (editProfile.image) {
            formData.append("image", editProfile.image);
        }

        try {
            const res = await axios.put(`${backendUrl}/api/user/profile/${adminData._id}`, formData, {
                headers: { token, "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                setAdminData(res.data.user);
                toast.success("Profile updated successfully!");
                setEditModalOpen(false);
            } else {
                toast.error(res.data.message || "Failed to update profile.");
            }
        } catch (err) {
            toast.error("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!adminData) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-gray-900 via-black to-gray-900"></div>

                {/* Profile Content */}
                <div className="px-6 pb-6 relative">
                    {/* Profile Image */}
                    <div className="w-32 h-32 rounded-xl border-4 border-white overflow-hidden -mt-16 mb-6 shadow-lg bg-white">
                        <img 
                            src={adminData.image || 'https://via.placeholder.com/150'} 
                            alt="Admin" 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="mb-4">
                                <h2 className="text-3xl font-semibold text-gray-900 mb-2">{adminData.name}</h2>
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <Mail size={18} />
                                    <span className="text-lg">{adminData.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Joined {new Date(adminData.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Activity size={16} />
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Online Now
                                </span>
                            </div>

                            {/* Profile Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Shield size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Account Status</p>
                                            <p className="font-semibold text-green-600">Active</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Users size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Role</p>
                                            <p className="font-semibold text-gray-900">Administrator</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Calendar size={20} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Last Login</p>
                                            <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:mt-8">
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                            >
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-gray-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form className="p-6 space-y-6" onSubmit={handleEditProfileSubmit}>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={editProfile.imagePreview || 'https://via.placeholder.com/150'}
                                        alt="Preview"
                                        className="w-28 h-28 rounded-xl object-cover border-4 border-gray-200"
                                    />
                                    <label className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors shadow-lg">
                                        <Camera size={16} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                                    value={editProfile.name}
                                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                                    value={editProfile.email}
                                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-md transform hover:scale-[1.02] disabled:hover:scale-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;