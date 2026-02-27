import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from "chart.js";
import { useNavigate } from "react-router-dom";
import {
    User, ShoppingBag, BarChart2, Edit2, X, Camera, Mail,
    TrendingUp, Package, Users, Calendar, Activity, Shield,
    Eye, IndianRupee, Clock,
    CheckCircle, XCircle, Download, Search, Menu
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { backendUrl, currency } from "../App";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

const AdminPanel = ({ token, setToken }) => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [adminData, setAdminData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const decoded = jwtDecode(token);
                const res = await axios.get(`${backendUrl}/api/user/profile/${decoded.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data.success) setAdminData(res.data.user);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    navigate("/login");
                }
            }
        };
        if (token) fetchAdminData();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-black flex items-center justify-center flex-shrink-0">
                                <Shield className="text-black" size={16} />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-xl font-medium text-black uppercase tracking-wide">Admin Dashboard</h1>
                                <p className="text-xs text-gray-600 uppercase tracking-wider font-light hidden sm:block">Management Panel</p>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-light uppercase tracking-wide transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                            >
                                <BarChart2 size={16} /> Dashboard
                            </button>
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-light uppercase tracking-wide transition-all duration-300 ${activeTab === 'profile' ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                            >
                                <User size={16} /> Profile
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="sm:hidden p-2 hover:bg-gray-100 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Menu size={20} />
                        </button>
                    </div>

                    {/* Mobile Nav Dropdown */}
                    {mobileMenuOpen && (
                        <div className="sm:hidden flex gap-2 pt-3 pb-1 border-t border-gray-100 mt-3">
                            <button
                                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-light uppercase tracking-wide transition-all ${activeTab === 'dashboard' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600'}`}
                            >
                                <BarChart2 size={14} /> Dashboard
                            </button>
                            <button
                                onClick={() => { setActiveTab("profile"); setMobileMenuOpen(false); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-light uppercase tracking-wide transition-all ${activeTab === 'profile' ? 'bg-black text-white' : 'border border-gray-300 text-gray-600'}`}
                            >
                                <User size={14} /> Profile
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="px-3 sm:px-6 md:px-10 lg:px-20 py-5 sm:py-10">
                {activeTab === "dashboard" && <AdminDashboard token={token} adminData={adminData} />}
                {activeTab === "profile" && <AdminProfile token={token} adminData={adminData} setAdminData={setAdminData} />}
            </main>
        </div>
    );
};

const AdminDashboard = ({ token, adminData }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0, totalOrders: 0, totalProducts: 0,
        pendingOrders: 0, completedOrders: 0, avgOrderValue: 0,
        todayRevenue: 0, todayOrders: 0
    });
    const [timeFilter, setTimeFilter] = useState('7days');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) { fetchOrders(); fetchProducts(); }
    }, [token]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                const fetchedOrders = response.data.orders || [];
                // Sort latest first
                const sortedOrders = [...fetchedOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);

                const totalRevenue = fetchedOrders.reduce((sum, order) => sum + order.amount, 0);
                const pendingOrders = fetchedOrders.filter(order => !order.payment).length;
                const completedOrders = fetchedOrders.filter(order => order.payment).length;
                const avgOrderValue = fetchedOrders.length > 0 ? totalRevenue / fetchedOrders.length : 0;
                const today = new Date().toDateString();
                const todayOrders = fetchedOrders.filter(order => new Date(order.date).toDateString() === today);
                const todayRevenue = todayOrders.reduce((sum, order) => sum + order.amount, 0);

                setStats(prev => ({
                    ...prev, totalRevenue, totalOrders: fetchedOrders.length,
                    pendingOrders, completedOrders, avgOrderValue, todayRevenue, todayOrders: todayOrders.length
                }));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate("/login");
            }
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                const fetchedProducts = response.data.products || [];
                setProducts(fetchedProducts);
                setStats(prev => ({ ...prev, totalProducts: fetchedProducts.length }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#000', titleColor: '#fff', bodyColor: '#fff', borderColor: '#333', borderWidth: 1 }
        },
        scales: {
            x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#666', font: { size: 10 }, maxTicksLimit: 7 } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#666', font: { size: 10 } } }
        }
    };

    // Chart data: oldest to newest for correct trend direction
    const chartOrders = [...orders].reverse();
    const salesChart = {
        labels: chartOrders.slice(-14).map(o => new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
            label: "Sales Revenue",
            data: chartOrders.slice(-14).map(o => o.amount),
            borderColor: "#000000", backgroundColor: "rgba(0,0,0,0.05)",
            fill: true, tension: 0.4,
            pointBackgroundColor: "#000", pointBorderColor: "#fff", pointBorderWidth: 2, pointRadius: 3,
        }],
    };

    const categoryData = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});

    const doughnutChart = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData),
            backgroundColor: ['#e100ff', '#4841a4', '#5dc4c6', '#75b771', '#eeff00'],
            borderWidth: 2, borderColor: '#fff'
        }]
    };

    const filteredOrders = orders.filter(order =>
        order.address?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-8xl mx-auto space-y-4 sm:space-y-6">

            {/* Quick Stats — 2 cols mobile, 4 cols lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                    { label: "Total Revenue", value: `${currency} ${stats.totalRevenue.toFixed(2)}`, trend: "+12.5%", color: "text-green-600" },
                    { label: "Total Orders", value: stats.totalOrders, trend: "+8.2%", color: "text-blue-600", icon: <ShoppingBag size={18} /> },
                    { label: "Total Products", value: stats.totalProducts, trend: "+3.1%", color: "text-orange-600", icon: <Package size={18} /> },
                    { label: "Avg Order Value", value: `${currency} ${stats.avgOrderValue.toFixed(2)}`, trend: "+5.3%", color: "text-purple-600" },
                ].map((item, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-4 sm:p-6 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center">
                                {item.icon || <IndianRupee className="text-black" size={18} />}
                            </div>
                            <div className={`flex items-center gap-1 ${item.color}`}>
                                <TrendingUp size={12} />
                                <span className="text-xs font-medium">{item.trend}</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider leading-tight">{item.label}</p>
                        <p className="text-lg sm:text-2xl font-light text-black">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Today's Performance — 2 cols mobile, 3 cols lg */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <div className="col-span-2 lg:col-span-1 bg-black text-white p-4 sm:p-6 border border-black">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={18} />
                        <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider">Today's Revenue</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-light mb-1">{currency} {stats.todayRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{stats.todayOrders} orders today</p>
                </div>

                <div className="bg-white border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle size={18} className="text-green-600" />
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Completed</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.completedOrders}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}% rate
                    </p>
                </div>

                <div className="bg-white border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <XCircle size={18} className="text-red-600" />
                        <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl font-light text-black mb-1">{stats.pendingOrders}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {stats.totalOrders > 0 ? ((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1) : 0}% pending
                    </p>
                </div>
            </div>

            {/* Charts — stacked on mobile, side-by-side on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp size={18} className="text-gray-600" />
                                <div>
                                    <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Sales Revenue</h3>
                                    <p className="text-xs text-gray-600 uppercase tracking-wider font-light hidden sm:block">Last 14 days performance</p>
                                </div>
                            </div>
                            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}
                                className="px-2 sm:px-3 py-1.5 border border-gray-300 text-xs uppercase tracking-wide focus:outline-none focus:border-black">
                                <option value="7days">7 Days</option>
                                <option value="14days">14 Days</option>
                                <option value="30days">30 Days</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-3 sm:p-6">
                        <div className="h-48 sm:h-64">
                            <Line data={salesChart} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2">
                            <Package size={18} className="text-gray-600" />
                            <div>
                                <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Categories</h3>
                                <p className="text-xs text-gray-600 uppercase tracking-wider font-light hidden sm:block">Product distribution</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 sm:p-6 flex items-center justify-center">
                        <div className="h-48 sm:h-64 w-full flex items-center justify-center">
                            <Doughnut data={doughnutChart} options={{
                                responsive: true, maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 10, color: '#666' } } }
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShoppingBag size={18} className="text-gray-600" />
                            <div>
                                <h3 className="text-sm sm:text-lg font-medium uppercase tracking-wide text-black">Recent Orders</h3>
                                <p className="text-xs text-gray-600 uppercase tracking-wider font-light hidden sm:block">Latest customer transactions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input type="text" placeholder="Search orders..." value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 pr-3 py-2 border border-gray-300 text-xs focus:outline-none focus:border-black w-full sm:w-44" />
                            </div>
                            <button className="flex items-center gap-1 px-3 py-2 text-xs font-light uppercase tracking-wide border border-gray-300 hover:border-black transition-colors whitespace-nowrap">
                                <Download size={14} />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {["Order ID", "Customer", "Items", "Amount", "Status", "Date", "Action"].map(h => (
                                    <th key={h} className={`px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Action' ? 'text-center' : 'text-left'}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.slice(0, 10).map((order, index) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">#{(index + 1).toString().padStart(5, '0')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 border border-gray-200 flex items-center justify-center">
                                                <User size={14} className="text-gray-600" />
                                            </div>
                                            <span className="text-sm font-medium text-black">{order.address?.Name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{order.items?.length || 0} items</td>
                                    <td className="px-6 py-4 text-sm font-medium text-black whitespace-nowrap">{currency} {order.amount?.toFixed(2) || '0.00'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 border text-xs font-light uppercase tracking-wide ${order.payment ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                            {order.payment ? <CheckCircle size={12} className="mr-1" /> : <XCircle size={12} className="mr-1" />}
                                            {order.payment ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-light whitespace-nowrap">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 border border-gray-200 hover:border-black transition-colors"><Eye size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden divide-y divide-gray-100">
                    {filteredOrders.slice(0, 10).map((order, index) => (
                        <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">#{(index + 1).toString().padStart(5, '0')}</p>
                                    <p className="text-sm font-medium text-black mt-0.5">{order.address?.Name || 'N/A'}</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 border text-xs font-light uppercase ${order.payment ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                    {order.payment ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                    {order.payment ? "Paid" : "Pending"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{order.items?.length || 0} items</span>
                                    <span>·</span>
                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-black">{currency} {order.amount?.toFixed(2) || '0.00'}</span>
                                    <button className="p-1.5 border border-gray-200 hover:border-black transition-colors"><Eye size={12} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminProfile = ({ token, adminData, setAdminData }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProfile, setEditProfile] = useState({ name: "", email: "", image: null, imagePreview: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (adminData) {
            setEditProfile({ name: adminData.name, email: adminData.email, image: null, imagePreview: adminData.image || "" });
        }
    }, [adminData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setEditProfile(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    };

    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", editProfile.name);
        formData.append("email", editProfile.email);
        if (editProfile.image) formData.append("image", editProfile.image);

        try {
            const res = await axios.put(`${backendUrl}/api/user/profile/${adminData._id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                setAdminData(res.data.user);
                toast.success("Profile updated successfully!");
                setEditModalOpen(false);
            } else {
                toast.error(res.data.message || "Failed to update profile.");
            }
        } catch (err) {
            console.error('Error updating profile:', err);
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
                    <p className="text-gray-600 font-light uppercase tracking-wide text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="h-24 sm:h-32 bg-black"></div>

                <div className="px-4 sm:px-6 pb-6 relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white overflow-hidden -mt-12 sm:-mt-16 mb-4 sm:mb-6 shadow-sm bg-white">
                        <img src={adminData.image || 'https://via.placeholder.com/150'} alt="Admin" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl sm:text-3xl font-light text-black mb-1 sm:mb-2 uppercase tracking-wide">{adminData.name}</h2>
                            <div className="flex items-center gap-2 text-gray-600 mb-3 sm:mb-4">
                                <Mail size={14} />
                                <span className="text-sm font-light break-all">{adminData.email}</span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-500 mb-4 sm:mb-6 uppercase tracking-wider">
                                <span className="flex items-center gap-2"><Calendar size={13} /> Joined {new Date(adminData.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><Activity size={13} /><span className="w-2 h-2 bg-green-500 inline-block"></span> Online</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                <div className="bg-gray-50 border border-gray-100 p-3 sm:p-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 border border-blue-200 flex items-center justify-center flex-shrink-0">
                                            <Users size={15} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
                                            <p className="font-medium text-black text-xs sm:text-sm">Admin</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-3 sm:p-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 border border-orange-200 flex items-center justify-center flex-shrink-0">
                                            <Calendar size={15} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Last Login</p>
                                            <p className="font-medium text-black text-xs sm:text-sm">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:mt-8">
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="flex items-center justify-center sm:justify-start gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 text-sm w-full sm:w-auto"
                            >
                                <Edit2 size={15} /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-gray-50 sticky top-0">
                            <h3 className="text-base sm:text-lg font-medium text-black uppercase tracking-wide">Edit Profile</h3>
                            <button onClick={() => setEditModalOpen(false)} className="p-2 hover:bg-gray-100 transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form className="p-4 sm:p-6 space-y-5" onSubmit={handleEditProfileSubmit}>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img src={editProfile.imagePreview || 'https://via.placeholder.com/150'} alt="Preview"
                                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-4 border-gray-200" />
                                    <label className="absolute -bottom-2 -right-2 bg-black text-white p-2 cursor-pointer hover:bg-gray-800 transition-colors">
                                        <Camera size={14} />
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                                <input className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
                                    value={editProfile.name} onChange={e => setEditProfile({ ...editProfile, name: e.target.value })} required />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
                                    value={editProfile.email} onChange={e => setEditProfile({ ...editProfile, email: e.target.value })} required />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setEditModalOpen(false)}
                                    className="px-4 sm:px-6 py-2.5 border-2 border-gray-300 text-black font-light uppercase tracking-wide hover:border-black transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="px-4 sm:px-6 py-2.5 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm">
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </div>
                                    ) : "Save Changes"}
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