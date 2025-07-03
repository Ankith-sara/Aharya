import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURl, currency } from "../App";
import { toast } from "react-toastify";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";

// Register Chart.js components
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
      if (response.data.success) {
        setOrders(response.data.orders.reverse());

        // Calculate Stats
        const totalRevenue = response.data.orders.reduce((sum, order) => sum + order.amount, 0);
        setStats((prev) => ({ ...prev, totalRevenue, totalOrders: response.data.orders.length }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching orders.");
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendURl}/api/product/list`, { headers: { token } });
      if (response.data.success) {
        setProducts(response.data.products);
        setStats((prev) => ({ ...prev, totalProducts: response.data.products.length }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching products.");
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
    <div className="flex flex-col w-full items-start gap-6 p-6 bg-background rounded-lg shadow-md max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-white shadow-md p-4 rounded-lg text-center border border-gray-900">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <p className="text-2xl text-green-600 font-bold">{currency} {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg text-center border border-gray-900">
          <h3 className="text-xl font-semibold">Total Orders</h3>
          <p className="text-2xl text-blue-600 font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg text-center border border-gray-900">
          <h3 className="text-xl font-semibold">Total Products</h3>
          <p className="text-2xl text-orange-600 font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Sales Graph */}
        <div className="bg-white p-4 shadow-md rounded-lg border border-gray-900">
          <h3 className="text-lg font-semibold mb-4">Sales Revenue Over Time</h3>
          <Line data={salesChart} />
        </div>

        {/* Order Count Graph */}
        <div className="bg-white p-4 shadow-md rounded-lg border border-gray-900">
          <h3 className="text-lg font-semibold mb-4">Orders Per Day</h3>
          <Bar
            data={{
              labels: orderDates.slice(0, 10),
              datasets: [
                {
                  label: "Orders",
                  data: Array(10).fill().map(() => Math.floor(Math.random() * 10) + 1),
                  backgroundColor: "#f97316",
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-full bg-white p-4 shadow-md rounded-lg border border-gray-900">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-900">
            <thead className="bg-primary text-text text-sm uppercase">
              <tr>
                <th className="p-3 text-left border border-gray-900">Order No.</th>
                <th className="p-3 text-left border border-gray-900">Customer</th>
                <th className="p-3 text-left border border-gray-900">Amount</th>
                <th className="p-3 text-left border border-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order, index) => (
                <tr key={order._id} className="hover:bg-background transition-all">
                  <td className="p-3 border border-gray-900">{index + 1}</td>
                  <td className="p-3 border border-gray-900">{order.address.Name}</td>
                  <td className="p-3 border border-gray-900">{currency} {order.amount}</td>
                  <td className={`p-3 border border-gray-900 ${order.payment ? "text-green-600" : "text-red-600"}`}>
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