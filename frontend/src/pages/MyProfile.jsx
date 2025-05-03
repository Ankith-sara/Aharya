import React, { useState, useEffect } from "react";
import { ChevronRight, MapPin, Heart, Clock, User, ShoppingBag, Settings, LogOut, Shield } from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const MyProfile = () => {
  const [userData] = useState({
    name: "Aswanth",
    email: "aswanth@example.com",
    memberSince: "January 2023",
    status: "Active",
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
  };

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setRecentlyViewed(storedProducts);
  }, []);

  const menuItems = [
    { icon: <User size={18} />, text: "Edit Profile", description: "Update your personal information" },
    { icon: <MapPin size={18} />, text: "Addresses", description: "Manage your shipping addresses" },
    { icon: <ShoppingBag size={18} />, text: "Order History", description: "View your past orders" },
    { icon: <Heart size={18} />, text: "Wishlist", description: "Items you've saved" },
    { icon: <Settings size={18} />, text: "Account Settings", description: "Notifications, password, privacy" },
    { icon: <Shield size={18} />, text: "Security", description: "Two-factor authentication, sessions" },
  ];

  return (
    <div className="min-h-screen text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      {/* Profile Title */}
      <div className="text-3xl text-center mb-6">
        <Title text1="MY" text2="PROFILE" />
      </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Profile Banner */}
            <div className="h-32 bg-gray-100"></div>

            {/* Profile Info */}
            <div className="px-6 pb-6 flex flex-col items-center relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden -mt-16 mb-4 shadow-md">
                <img
                  src="/api/placeholder/128/128"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-medium text-black mb-1">{userData.name}</h2>

              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-black mr-2"></div>
                <span className="text-sm text-gray-600">{userData.status}</span>
              </div>

              <div className="w-full border-t border-gray-200 mt-2 pt-4">
                <div className="grid grid-cols-1 gap-3 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
                    <p className="text-sm">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Member Since</p>
                    <p className="text-sm">{userData.memberSince}</p>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full py-2 px-4 border border-black text-black font-medium hover:bg-black hover:text-white transition-colors">
                EDIT PROFILE
              </button>
            </div>
          </div>

          {/* Logout Card */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm p-2">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-black transition-colors">
              <LogOut size={18} />
              <span className="font-medium" onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }}>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column - Account Settings */}
        <div className="lg:col-span-2">
          {/* Account Settings Section */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Account Management</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <button key={index} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                      {item.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{item.text}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Recently Viewed</h3>
              <button className="text-sm font-medium hover:underline">View All</button>
            </div>

            {recentlyViewed.length === 0 ? (
              <div className="p-8 text-center">
                <Clock size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No items viewed recently</p>
                <button className="mt-4 px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors">
                  DISCOVER PRODUCTS
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {recentlyViewed.map((item) => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={item.images}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;