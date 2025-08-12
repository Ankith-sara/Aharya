import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { backendUrl } from "../App";

const Navbar = ({ token, setToken }) => {
  const [adminData, setAdminData] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const decoded = jwtDecode(token);
        const res = await axios.get(`${backendUrl}/api/user/profile/${decoded.id}`, {
          headers: { token }
        });
        if (res.data.success) {
          setAdminData(res.data.user);
        }
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      }
    };
    if (token) fetchAdminData();
  }, [token, navigate, backendUrl]);

  const handleLogout = () => {
    setToken('');
    setShowUserMenu(false);
  };

  return (
    <div className="flex items-center py-4 px-6 justify-between bg-background border-b border-primary/20 backdrop-blur-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-32 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center border border-primary/20">
            <img
              className="w-28 h-8 object-contain filter brightness-0 invert"
              src={assets.logo}
              alt="Logo"
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-primary tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-secondary font-medium">Management Panel</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-3 p-2 hover:bg-gradient-to-r hover:from-background/30 hover:to-background/10 rounded-xl transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                <User size={16} className="text-text" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-primary group-hover:text-primary transition-colors duration-200">
                  {adminData?.name || 'Admin User'}
                </p>
                <p className="text-xs text-secondary group-hover:text-primary transition-colors duration-200">
                  {adminData?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-primary/20 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="p-4 border-b border-primary/20 bg-gradient-to-r from-background/30 to-background/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User size={18} className="text-text" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {adminData?.name || 'Admin User'}
                      </p>
                      <p className="text-xs text-secondary truncate">
                        {adminData?.email || 'admin@example.com'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-background/30 hover:to-background/10 rounded-lg transition-all duration-200 group text-left"
                  >
                    <User size={16} className="text-secondary group-hover:text-primary transition-colors duration-200" />
                    <span className="text-sm text-secondary group-hover:text-primary transition-colors duration-200">
                      View Profile
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 rounded-lg transition-all duration-200 group text-left"
                  >
                    <LogOut size={16} className="text-secondary group-hover:text-red-500 transition-colors duration-200" />
                    <span className="text-sm text-secondary group-hover:text-red-500 transition-colors duration-200">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;