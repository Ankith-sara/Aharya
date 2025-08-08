import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

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
    <div className="flex items-center py-4 px-6 justify-between bg-background border-b border-primary/20 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="w-36 h-10 bg-text rounded-xl flex items-center justify-center">
          <img
            className="w-20 h-20 object-contain"
            src={assets.logo}
            alt="Logo"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-primary">Admin Dashboard</h1>
          <p className="text-xs text-secondary">Management Panel</p>
        </div>
      </div>
      
      <button onClick={() => setToken('')} className="flex items-center gap-2 bg-primary hover:bg-secondary text-text hover:text-background px-4 py-2 sm:px-6 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
        <LogOut size={16} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;