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

// Define constants locally
import { backendUrl, currency } from "../App";

// --- Main Admin Panel Component ---
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
        <div className="flex flex-col w-full min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background border-b border-primary/20 shadow-sm">
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <Shield className="text-text" size={18} />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-bold text-primary">Admin Dashboard</h1>
                                    <p className="text-[10px] sm:text-xs text-secondary">Management Panel</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard'
                                    ? 'bg-primary text-text shadow-md'
                                    : 'text-secondary hover:text-primary hover:bg-background/30'
                                    }`}
                            >
                                <BarChart2 size={14} />
                                <span className="hidden sm:inline">Dashboard</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === 'profile'
                                    ? 'bg-primary text-text shadow-md'
                                    : 'text-secondary hover:text-primary hover:bg-background/30'
                                    }`}
                            >
                                <User size={14} />
                                <span className="hidden sm:inline">Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 sm:p-6">
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
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(58, 42, 33, 0.1)' },
                ticks: { color: '#3c2a21' }
            },
            y: {
                grid: { color: 'rgba(58, 42, 33, 0.1)' },
                ticks: { color: '#3c2a21' }
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
            borderColor: "#1a120b",
            backgroundColor: "rgba(26, 18, 11, 0.1)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3c2a21",
            pointBorderColor: "#1a120b",
        }],
    };

    const ordersChart = {
        labels: orderDates.slice(0, 10).reverse(),
        datasets: [{
            label: "Items per Order",
            data: orders.slice(0, 10).reverse().map(o => o.items.length),
            backgroundColor: "#3c2a21",
            borderRadius: 8,
        }],
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-text rounded-2xl shadow-sm border border-primary/10 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold text-primary mt-1">{currency} {stats.totalRevenue.toFixed(2)}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-green-600" />
                                <span className="text-xs text-green-600 font-medium">+12.5%</span>
                                <span className="text-xs text-secondary">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <IndianRupee className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-text rounded-2xl shadow-sm border border-primary/10 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-sm font-medium">Total Orders</p>
                            <p className="text-2xl font-bold text-primary mt-1">{stats.totalOrders}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-blue-600" />
                                <span className="text-xs text-blue-600 font-medium">+8.2%</span>
                                <span className="text-xs text-secondary">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-text rounded-2xl shadow-sm border border-primary/10 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-secondary text-sm font-medium">Total Products</p>
                            <p className="text-2xl font-bold text-primary mt-1">{stats.totalProducts}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={14} className="text-orange-600" />
                                <span className="text-xs text-orange-600 font-medium">+3.1%</span>
                                <span className="text-xs text-secondary">vs last month</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Package className="text-orange-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-text rounded-2xl shadow-sm border border-primary/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-primary">Sales Revenue</h3>
                            <p className="text-sm text-secondary">Recent sales performance</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-green-600" size={20} />
                        </div>
                    </div>
                    <div className="h-64">
                        <Line data={salesChart} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-text rounded-2xl shadow-sm border border-primary/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-primary">Order Volume</h3>
                            <p className="text-sm text-secondary">Items per order analysis</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BarChart2 className="text-blue-600" size={20} />
                        </div>
                    </div>
                    <div className="h-64">
                        <Bar data={ordersChart} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-text rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
                <div className="p-6 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-primary">Recent Orders</h3>
                            <p className="text-sm text-secondary">Latest customer orders</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors">
                            <Eye size={16} />
                            View All
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-background/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {orders.slice(0, 5).map((order, index) => (
                                <tr key={order._id} className="hover:bg-background/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                        #{(index + 1).toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <User size={14} className="text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-primary">{order.address.Name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">
                                        {currency} {order.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.payment
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {order.payment ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
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
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-secondary">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-text border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-br from-primary via-secondary to-primary"></div>

                {/* Profile Content */}
                <div className="px-6 pb-6 relative">
                    {/* Profile Image */}
                    <div className="w-32 h-32 rounded-2xl border-4 border-text overflow-hidden -mt-16 mb-6 shadow-lg bg-text">
                        <img src={adminData.image || 'https://via.placeholder.com/150'} alt="Admin" className="w-full h-full object-cover" />
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-3xl font-bold text-primary">{adminData.name}</h2>
                            </div>

                            <div className="flex items-center gap-2 mb-4 text-secondary">
                                <Mail size={18} />
                                <span className="text-lg">{adminData.email}</span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-secondary mb-6">
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-background/30 to-background/10 rounded-xl p-4 border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Shield size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-secondary">Account Status</p>
                                            <p className="font-semibold text-green-600">Active</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-background/30 to-background/10 rounded-xl p-4 border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Users size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-secondary">Role</p>
                                            <p className="font-semibold text-primary">Administrator</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-background/30 to-background/10 rounded-xl p-4 border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Calendar size={20} className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-secondary">Last Login</p>
                                            <p className="font-semibold text-primary">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:mt-8">
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-text font-semibold rounded-xl hover:bg-secondary transition-all duration-200 shadow-md hover:shadow-lg"
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
                    <div className="bg-text rounded-2xl w-full max-w-md shadow-2xl border border-primary/20">
                        <div className="flex justify-between items-center p-6 border-b border-primary/10">
                            <h3 className="text-xl font-semibold text-primary">Edit Profile</h3>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="p-2 hover:bg-background/30 rounded-xl transition-colors"
                            >
                                <X size={20} className="text-secondary" />
                            </button>
                        </div>

                        <form className="p-6 space-y-6" onSubmit={handleEditProfileSubmit}>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={editProfile.imagePreview || 'https://via.placeholder.com/150'}
                                        alt="Preview"
                                        className="w-28 h-28 rounded-2xl object-cover border-4 border-primary/10"
                                    />
                                    <label className="absolute -bottom-2 -right-2 bg-primary text-text p-2 rounded-xl cursor-pointer hover:bg-secondary transition-colors shadow-lg">
                                        <Camera size={16} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Full Name</label>
                                <input
                                    className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background/30"
                                    value={editProfile.name}
                                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-background/30"
                                    value={editProfile.email}
                                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-6 py-3 border border-primary/20 text-secondary font-medium rounded-xl hover:bg-background/30 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-text rounded-xl font-medium hover:bg-secondary disabled:opacity-50 transition-colors shadow-md"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-text border-t-transparent rounded-full animate-spin"></div>
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