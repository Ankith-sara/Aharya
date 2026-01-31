import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ChevronRight, Heart, Clock, User, ShoppingBag, Settings, LogOut, Edit2, Trash2,
  MapPinHouse, X, Camera, Mail, Calendar, Plus, ArrowRight, AlertCircle, Eye, EyeOff, Lock
} from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [editProfile, setEditProfile] = useState({ name: "", email: "", image: "" });
  const [addressModal, setAddressModal] = useState({ open: false, address: {}, index: -1 });
  const [loading, setLoading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteAddressModal, setDeleteAddressModal] = useState({ open: false, index: -1 });
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const { backendUrl, setToken, navigate } = useContext(ShopContext);

  // Fetch user details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      navigate("/login");
      return;
    }
    axios
      .get(backendUrl + `/api/user/profile/${userId}`, { 
        headers: { Authorization: `Bearer ${token}` } // Changed from 'token' to 'Authorization'
      })
      .then((res) => {
        if (res.data.success) {
          setUserData(res.data.user);
          setEditProfile({
            name: res.data.user.name,
            email: res.data.user.email,
            image: res.data.user.image || "",
          });
        } else {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate, backendUrl]);

  // Fetch recently viewed products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(storedProducts);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem('userId');
    setToken("");
  };

  // --- Profile Image Upload ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditProfile((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file),
    }));
  };

  // --- Edit Profile Submit ---
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", editProfile.name);
      formData.append("email", editProfile.email);
      if (editProfile.imageFile) {
        formData.append("image", editProfile.imageFile);
      }

      const res = await axios.put(
        `${backendUrl}/api/user/profile/${userData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Changed from 'token' to 'Authorization'
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setUserData(res.data.user);
        setEditProfile({
          name: res.data.user.name,
          email: res.data.user.email,
          image: res.data.user.image || "",
        });
        setActiveSection(null);
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to update profile." });
      }
    } catch (err) {
      console.error("Edit profile failed:", err);
      setErrorModal({ open: true, message: "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  // --- Address Management ---
  const saveAddress = async (addressObj, index = -1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/address/${userData._id}`,
        { addressObj, index },
        { headers: { Authorization: `Bearer ${token}` } } // Changed from 'token' to 'Authorization'
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
        setAddressModal({ open: false, address: {}, index: -1 });
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to save address." });
      }
    } catch (err) {
      setErrorModal({ open: true, message: "Failed to save address." });
    }
    setLoading(false);
  };

  const confirmDeleteAddress = async () => {
    const index = deleteAddressModal.index;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${backendUrl}/api/user/address/${userData._id}`,
        { 
          data: { index }, 
          headers: { Authorization: `Bearer ${token}` } // Changed from 'token' to 'Authorization'
        }
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
        setDeleteAddressModal({ open: false, index: -1 });
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to delete address." });
      }
    } catch (err) {
      setErrorModal({ open: true, message: "Failed to delete address." });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    // Validation
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/change-password/${userData._id}`,
        { password: passwordForm.newPassword },
        { headers: { Authorization: `Bearer ${token}` } } // Changed from 'token' to 'Authorization'
      );

      if (res.data.success) {
        alert("Password updated successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setActiveSection(null);
      } else {
        setErrorModal({ open: true, message: res.data.message || "Failed to update password" });
      }
    } catch (err) {
      console.error("Change password failed:", err);
      setErrorModal({
        open: true,
        message: err.response?.data?.message || "Failed to update password"
      });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: <MapPinHouse size={18} />, text: "Delivery Address", description: "Manage your delivery locations" },
    { icon: <ShoppingBag size={18} />, text: "Order History", link: "/orders", description: "View your past orders" },
    { icon: <Heart size={18} />, text: "Wishlist", link: "/wishlist", description: "Items you've saved for later" },
    { icon: <Settings size={18} />, text: "Account Settings", description: "Notifications, password, privacy" },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-2xl sm:text-3xl mb-4 sm:mb-6">
                <Title text1="MY" text2="PROFILE" />
              </div>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <span className="text-gray-600 font-light text-sm">Loading profile...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-16 sm:mt-20">
      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-sm sm:max-w-md w-full animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-medium tracking-wide">Confirm Logout</h3>
              <button
                onClick={() => setLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-2.5 sm:py-3 border border-gray-300 text-black font-light tracking-wide hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => { setLogoutModal(false); logout(); }}
                className="flex-1 py-2.5 sm:py-3 bg-white text-black border border-gray-300 font-light tracking-wide hover:bg-red-100 hover:text-red-600 active:bg-red-200 transition-all duration-300 uppercase text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Address Confirmation Modal */}
      {deleteAddressModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-sm sm:max-w-md w-full animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-medium tracking-wide">Delete Address</h3>
              <button
                onClick={() => setDeleteAddressModal({ open: false, index: -1 })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                Are you sure you want to delete this delivery address? This action cannot be undone.
              </p>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setDeleteAddressModal({ open: false, index: -1 })}
                className="flex-1 py-2.5 sm:py-3 border border-gray-300 text-black font-light tracking-wide hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAddress}
                disabled={loading}
                className="flex-1 py-2.5 sm:py-3 bg-red-500 text-white font-light tracking-wide hover:bg-red-600 active:bg-red-700 transition-all duration-300 uppercase disabled:opacity-50 text-sm"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-sm shadow-2xl max-w-sm sm:max-w-md w-full animate-slideUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-medium tracking-wide">Error</h3>
              </div>
              <button
                onClick={() => setErrorModal({ open: false, message: "" })}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed break-words">
                {errorModal.message}
              </p>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => setErrorModal({ open: false, message: "" })}
                className="w-full py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 uppercase text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
              <Title text1="MY" text2="PROFILE" />
            </div>
            <p className="text-sm sm:text-base text-gray-500 font-light">
              Manage your account and personal preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-4 sm:px-6 lg:px-20 pb-12 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid xl:grid-cols-[1fr_2fr] gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Information Card */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <User size={14} sm:size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile Information
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden">
                        <img
                          src={userData.image}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <button
                        className="absolute inset-0 flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 active:opacity-100 bg-black bg-opacity-20 transition-all duration-200"
                        onClick={() => setActiveSection("Edit Profile")}
                        title="Edit Photo"
                      >
                        <Camera className="text-white" size={16} />
                      </button>
                    </div>

                    <h3 className="text-lg sm:text-xl font-medium text-black mt-3 sm:mt-4 mb-2 tracking-wide text-center break-words max-w-full px-2">{userData.name}</h3>

                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="w-2 h-2 rounded bg-green-500"></div>
                      <span className="text-xs sm:text-sm text-gray-500 font-light uppercase tracking-wider">Active Member</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="border border-gray-200 p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={12} sm:size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                      </div>
                      <p className="text-xs sm:text-sm text-black font-light break-all">{userData.email}</p>
                    </div>

                    <div className="border border-gray-200 p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={12} sm:size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</span>
                      </div>
                      <p className="text-xs sm:text-sm text-black font-light">
                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 uppercase text-sm" onClick={() => setActiveSection("Edit Profile")}>
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Sign Out Card */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <button
                  className="w-full flex items-center justify-center gap-3 p-4 sm:p-6 text-gray-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-300 font-light tracking-wide"
                  onClick={() => setLogoutModal(true)}
                >
                  <LogOut size={16} sm:size={18} />
                  <span className="uppercase text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Settings size={14} sm:size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Management
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {menuItems.map((item, index) => {
                    const content = (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300 cursor-pointer"
                        onClick={() => !item.link && setActiveSection(item.text)}
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-200 text-gray-600 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-black tracking-wide text-sm sm:text-base truncate">{item.text}</p>
                            <p className="text-xs sm:text-sm text-gray-500 font-light truncate">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} sm:size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                    );

                    return item.link ? (
                      <Link to={item.link} key={index}>
                        {content}
                      </Link>
                    ) : (
                      content
                    );
                  })}
                </div>
              </div>

              {/* Recently Viewed Section */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} sm:size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recently Viewed
                      </span>
                    </div>
                  </div>
                </div>

                {recentlyViewed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 flex items-center justify-center mb-4 sm:mb-6">
                      <Clock size={20} sm:size={24} className="text-gray-400" />
                    </div>
                    <div className="text-center max-w-md mb-6 sm:mb-8">
                      <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 tracking-wide uppercase">No Recent Activity</h3>
                      <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                        Start browsing our amazing collection to see your recently viewed items here
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/collection')}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 text-sm"
                    >
                      <span>DISCOVER PRODUCTS</span>
                      <ArrowRight size={14} sm:size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                      {recentlyViewed.slice(0, 8).map((item) => (
                        <ProductItem
                          key={item._id}
                          id={item._id}
                          name={item.name}
                          price={item.price}
                          image={item.images}
                        />
                      ))}
                    </div>
                    {recentlyViewed.length > 8 && (
                      <div className="text-center mt-4 sm:mt-6">
                        <button className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase text-sm">
                          View More
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {activeSection === "Edit Profile" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg shadow-xl overflow-hidden sm:rounded-sm max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-medium tracking-wide uppercase">Edit Profile</h2>
              <button
                onClick={() => setActiveSection(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form className="p-4 sm:p-6 space-y-4 sm:space-y-5" onSubmit={handleEditProfileSubmit}>
              {/* Profile Image */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center rounded-full">
                    {editProfile.image ? (
                      <img src={editProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} sm:size={24} className="text-gray-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-black text-white p-1.5 sm:p-2 cursor-pointer hover:bg-gray-800 active:bg-gray-900 transition-colors rounded-full">
                    <Camera size={12} sm:size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 font-light flex-1">Click camera to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
                    value={editProfile.name}
                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sticky bottom-0 bg-white pb-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-black text-white px-4 py-3 hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-light tracking-wide uppercase order-1 sm:order-1"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-3 border border-gray-300 text-black hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm font-light tracking-wide uppercase order-2 sm:order-2"
                  onClick={() => setActiveSection(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeSection === "Account Settings" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md shadow-xl overflow-hidden sm:rounded-sm max-h-screen overflow-y-auto">
            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Lock size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-medium tracking-wide uppercase truncate">Change Password</h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-light">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveSection(null);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className={`w-full px-3 py-2.5 sm:py-3 pr-10 border focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base ${passwordErrors.currentPassword ? "border-red-400" : "border-gray-300"
                        }`}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black active:text-gray-600 transition-colors"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-xs mt-1.5 font-light">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className={`w-full px-3 py-2.5 sm:py-3 pr-10 border focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base ${passwordErrors.newPassword ? "border-red-400" : "border-gray-300"
                        }`}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black active:text-gray-600 transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1.5 font-light">{passwordErrors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-3 py-2.5 sm:py-3 pr-10 border focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base ${passwordErrors.confirmPassword ? "border-red-400" : "border-gray-300"
                        }`}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black active:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5 font-light">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-gray-600 font-light space-y-1">
                    <li>• Minimum 8 characters long</li>
                    <li>• Should be different from current password</li>
                    <li>• Use a strong, unique password</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-black text-white px-4 sm:px-6 py-3 font-light hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm order-1"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-black font-light hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase tracking-wide text-sm order-2"
                  onClick={() => {
                    setActiveSection(null);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordErrors({});
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Management Modal */}
      {activeSection === "Delivery Address" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl shadow-xl overflow-hidden sm:rounded-sm max-h-screen overflow-y-auto">
            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPinHouse size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-medium tracking-wide uppercase truncate">Delivery Addresses</h2>
                    <p className="text-gray-500 text-xs sm:text-sm font-light">Manage your delivery locations</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                  className="flex items-center gap-1.5 sm:gap-2 bg-black text-white px-3 sm:px-4 py-2 font-light hover:bg-gray-800 active:bg-gray-900 transition-colors uppercase tracking-wide flex-shrink-0 text-xs sm:text-sm"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {(!userData.addresses || userData.addresses.length === 0) ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gray-300 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <MapPinHouse size={20} sm:size={24} className="text-gray-400" />
                  </div>
                  <div className="text-center max-w-md mb-6 sm:mb-8 mx-auto px-4">
                    <h3 className="text-lg sm:text-xl font-medium text-black mb-2 sm:mb-3 tracking-wide uppercase">No Addresses Found</h3>
                    <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">Add your first delivery address to get started</p>
                  </div>
                  <button
                    onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 active:bg-gray-900 transition-colors uppercase text-sm"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {userData.addresses.map((addr, idx) => (
                    <div key={idx} className="border border-gray-200 p-3 sm:p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-black mb-1 tracking-wide text-sm sm:text-base truncate">
                            {addr.label || `Address ${idx + 1}`}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 font-light break-words">
                            {addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                            {addr.phone && (
                              <><br />Phone: {addr.phone}</>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => setAddressModal({ open: true, address: addr, index: idx })}
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            aria-label="Edit address"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteAddressModal({ open: true, index: idx })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors"
                            aria-label="Delete address"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveSection(null)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-black font-light hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase tracking-wide text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {addressModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md shadow-xl overflow-hidden sm:rounded-sm max-h-screen overflow-y-auto">
            <div className="sticky top-0 z-10 p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-medium tracking-wide uppercase">
                  {addressModal.index >= 0 ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => setAddressModal({ open: false, address: {}, index: -1 })}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <AddressForm
                initial={addressModal.address}
                onSave={(addr) => saveAddress(addr, addressModal.index)}
                onCancel={() => setAddressModal({ open: false, address: {}, index: -1 })}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Address Form Component
function AddressForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    address: initial.address || "",
    city: initial.city || "",
    state: initial.state || "",
    zip: initial.zip || "",
    country: initial.country || "",
    label: initial.label || "",
    phone: initial.phone || "",
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-3 sm:space-y-4"
    >
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Address Label (Optional)</label>
        <input
          className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
          value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          placeholder="e.g., Home, Office"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Street Address</label>
        <input
          className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">City</label>
          <input
            className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">State</label>
          <input
            className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">ZIP Code</label>
          <input
            className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
            value={form.zip}
            onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
            placeholder="ZIP"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Country</label>
          <input
            className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            placeholder="Country"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
        <input
          type="tel"
          className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light text-sm sm:text-base"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
        <button
          type="submit"
          className="w-full sm:flex-1 bg-black text-white px-4 sm:px-6 py-3 font-light hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm order-1"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-black font-light hover:border-black hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 uppercase tracking-wide text-sm order-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MyProfile;