import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURl, currency } from "../App";
import { toast } from "react-toastify";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const AdminDashboard = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });

    useEffect(() => {
        if (token) {
            fetchOrders();
            fetchProducts();
        }
    }, [token]);

    // Fetch Orders
    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${backendURl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success && Array.isArray(response.data.orders)) {
                const fetchedOrders = response.data.orders;
                setOrders(fetchedOrders.slice().reverse());

                const totalRevenue = fetchedOrders.reduce((sum, order) => sum + order.amount, 0);
                setStats((prev) => ({ ...prev, totalRevenue, totalOrders: fetchedOrders.length }));
            } else {
                setOrders([]); 
                if(response.data.message) toast.info("No Orders yet");
            }
        } catch (error) {
            toast.error("Error fetching orders.");
            setOrders([]);
        }
    };

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendURl}/api/product/list`, { headers: { token } });
            if (response.data.success && Array.isArray(response.data.products)) {
                const fetchedProducts = response.data.products;
                setProducts(fetchedProducts);
                setStats((prev) => ({ ...prev, totalProducts: fetchedProducts.length }));
            } else {
                setProducts([]);
                if(response.data.message) toast.info("No Products in the Inventory");
            }
        } catch (error) {
            toast.error("Error fetching products.");
            setProducts([]);
        }
    };

    // Chart Data (Sales Overview)
    const orderDates = orders.map((order) => new Date(order.date).toLocaleDateString());
    const salesData = orders.map((order) => order.amount);

    const salesChart = {
        labels: orderDates.slice(0, 10),
        datasets: [
            {
                label: "Sales Revenue",
                data: salesData.slice(0, 10),
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <div className="flex flex-col w-full items-start gap-6 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-gray-800 w-full text-center">Admin Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
                <div className="bg-background shadow-md p-4 rounded-lg text-center border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Total Revenue</h3>
                    <p className="text-xl sm:text-2xl text-green-600 font-bold">{currency} {stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-background shadow-md p-4 rounded-lg text-center border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Total Orders</h3>
                    <p className="text-xl sm:text-2xl text-blue-600 font-bold">{stats.totalOrders}</p>
                </div>
                <div className="bg-background shadow-md p-4 rounded-lg text-center border border-gray-200">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Total Products</h3>
                    <p className="text-xl sm:text-2xl text-orange-600 font-bold">{stats.totalProducts}</p>
                </div>
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="bg-background p-4 shadow-md rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales Revenue Over Time</h3>
                    <Line data={salesChart} />
                </div>
                <div className="bg-background p-4 shadow-md rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Orders Per Day</h3>
                    <Bar
                        data={{
                            labels: orderDates.slice(0, 10),
                            datasets: [
                                {
                                    label: "Orders",
                                    data: orders.slice(0,10).map(() => Math.floor(Math.random() * 10) + 1), // Example data
                                    backgroundColor: "#f97316",
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="w-full bg-background p-4 shadow-md rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="p-3 text-left border-b-2 border-gray-200">Order No.</th>
                                <th className="p-3 text-left border-b-2 border-gray-200">Customer</th>
                                <th className="p-3 text-left border-b-2 border-gray-200">Amount</th>
                                <th className="p-3 text-left border-b-2 border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map((order, index) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 border-b border-gray-200">{index + 1}</td>
                                    <td className="p-3 border-b border-gray-200">{order.address.Name}</td>
                                    <td className="p-3 border-b border-gray-200">{currency} {order.amount}</td>
                                    <td className={`p-3 border-b border-gray-200 font-semibold ${order.payment ? "text-green-600" : "text-red-600"}`}>
                                        {order.payment ? "Paid" : "Pending"}
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

export default AdminDashboard;