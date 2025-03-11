import React, { useState } from "react";
import {
  ChevronRight,
  MapPin,
  Heart,
  Clock,
  User,
} from "lucide-react";
import Title from "../components/Title";

const MyProfile = () => {
  const [userData] = useState({
    name: "Aswanth",
    status: "Active",
  });

  const menuItems = [
    { icon: <User size={18} />, text: "Edit Profile" },
    { icon: <MapPin size={18} />, text: "Shopping Address" },
    { icon: <Heart size={18} />, text: "Wishlist" },
    { icon: <Clock size={18} />, text: "Order History" },
  ];

  return (
    <div className="min-h-screen m-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10 bg-primary">
      {/* Profile Title */}
      <div className="text-2xl sm:text-3xl text-text text-center">
        <Title text1="My" text2="Profile" />
      </div>

      {/* Profile Section */}
      <div className="my-8 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
        <div className="bg-background p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center w-full sm:w-3/4 md:w-2/3 lg:w-1/3">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-4 border-secondary">
            <img src="/api/placeholder/128/128" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-text mb-1">
            {userData.name}
          </h2>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-500">{userData.status} status</span>
          </div>
        </div>

        {/* Menu Items Section */}
        <div className="w-full sm:w-3/4 md:w-2/3 lg:flex-1">
          <div className="bg-background p-5 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-text text-center">
              Account Settings
            </h3>
            <div className="grid gap-4 sm:gap-5">
              {menuItems.map((item, index) => (
                <button key={index} className="border border-secondary bg-background text-text p-3 sm:p-4 flex items-center justify-between rounded-lg shadow-md hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-2 sm:gap-3">{item.icon} <span className="text-sm sm:text-base font-medium">{item.text}</span></div>
                  <ChevronRight size={16} className="text-gray-700" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background p-5 sm:p-6 rounded-lg shadow-lg mt-6 sm:mt-8 text-center">
        <h3 className="text-lg font-semibold text-text mb-3">Recent Activity</h3>
        <p className="text-gray-400 text-sm sm:text-base">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default MyProfile;