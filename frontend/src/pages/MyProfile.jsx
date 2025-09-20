import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ChevronRight, Heart, Clock, User, ShoppingBag, Settings, LogOut, Edit2, Trash2,
  MapPinHouse, X, Camera, Mail, Calendar, Plus, ArrowRight, Package, Phone
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
      .get(backendUrl + `/api/user/profile/${userId}`, { headers: { token } })
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
  }, [navigate]);

  // Fetch recently viewed products
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(storedProducts);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
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
            token,
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
        alert(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Edit profile failed:", err);
      alert("Failed to update profile.");
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
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address/${userData._id}`,
        { addressObj, index },
        { headers: { token } }
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
        setAddressModal({ open: false, address: {}, index: -1 });
      } else {
        alert(res.data.message || "Failed to save address.");
      }
    } catch (err) {
      alert("Failed to save address.");
    }
    setLoading(false);
  };

  const deleteAddress = async (index) => {
    if (!window.confirm("Delete this address?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/address/${userData._id}`,
        { data: { index }, headers: { token } }
      );
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, addresses: res.data.addresses }));
      } else {
        alert(res.data.message || "Failed to delete address.");
      }
    } catch (err) {
      alert("Failed to delete address.");
    }
    setLoading(false);
  };

  const menuItems = [
    { icon: <MapPinHouse size={18} />, text: "Delivery Address", description: "Manage your delivery locations" },
    { icon: <ShoppingBag size={18} />, text: "Order History", link: "/orders", description: "View your past orders" },
    { icon: <Heart size={18} />, text: "Wishlist", description: "Items you've saved for later" },
    { icon: <Settings size={18} />, text: "Account Settings", description: "Notifications, password, privacy" },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-white text-black mt-20">
        <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-3xl mb-6">
                <Title text1="MY" text2="PROFILE" />
              </div>
            </div>
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <span className="text-gray-600 font-light">Loading profile...</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">
              <Title text1="MY" text2="PROFILE" />
            </div>
            <p className="text-gray-500 font-light">
              Manage your account and personal preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid xl:grid-cols-[1fr_2fr] gap-8">
            {/* Profile Information Card */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile Information
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-32 h-32 overflow-hidden">
                        <img
                          src={userData.image}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <button
                        className="absolute inset-0 flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 bg-black bg-opacity-20 transition-all duration-200"
                        onClick={() => setActiveSection("Edit Profile")}
                        title="Edit Photo"
                      >
                        <Camera className="text-white" size={16} />
                      </button>
                    </div>

                    <h3 className="text-xl font-medium text-black mt-4 mb-2 tracking-wide">{userData.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded bg-green-500"></div>
                      <span className="text-sm text-gray-500 font-light uppercase tracking-wider">Active Member</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                      </div>
                      <p className="text-sm text-black font-light">{userData.email}</p>
                    </div>

                    <div className="border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</span>
                      </div>
                      <p className="text-sm text-black font-light">
                        {new Date(userData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <button 
                    className="w-full py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300 uppercase"
                    onClick={() => setActiveSection("Edit Profile")}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Sign Out Card */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <button
                  className="w-full flex items-center justify-center gap-3 p-6 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-light tracking-wide"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to log out?")) logout();
                  }}
                >
                  <LogOut size={18} />
                  <span className="uppercase">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Account Management */}
            <div className="space-y-8">
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-gray-400" />
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
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                        onClick={() => !item.link && setActiveSection(item.text)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-600">
                            {item.icon}
                          </div>
                          <div>
                            <p className="font-medium text-black tracking-wide">{item.text}</p>
                            <p className="text-sm text-gray-500 font-light">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
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
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recently Viewed
                      </span>
                    </div>
                  </div>
                </div>

                {recentlyViewed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center mb-6">
                      <Clock size={24} className="text-gray-400" />
                    </div>
                    <div className="text-center max-w-md mb-8">
                      <h3 className="text-xl font-medium mb-3 tracking-wide uppercase">No Recent Activity</h3>
                      <p className="text-gray-600 font-light leading-relaxed">
                        Start browsing our amazing collection to see your recently viewed items here
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/collection')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-all duration-300"
                    >
                      <span>DISCOVER PRODUCTS</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                      <div className="text-center mt-6">
                        <button className="px-6 py-3 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase">
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-medium tracking-wide uppercase">Edit Profile</h2>
              <button
                onClick={() => setActiveSection(null)}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form className="p-4 space-y-4" onSubmit={handleEditProfileSubmit}>
              {/* Profile Image */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    {editProfile.image ? (
                      <img src={editProfile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-black text-white p-1 cursor-pointer hover:bg-gray-800 transition-colors">
                    <Camera size={10} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 font-light">Click camera to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light text-sm"
                    value={editProfile.name}
                    onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light text-sm"
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-light tracking-wide uppercase"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-black hover:border-black hover:bg-gray-50 transition-all duration-300 text-xs font-light tracking-wide uppercase"
                  onClick={() => setActiveSection(null)}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinHouse size={16} className="text-gray-400" />
                  <div>
                    <h2 className="text-lg font-medium tracking-wide uppercase">Delivery Addresses</h2>
                    <p className="text-gray-500 text-sm font-light">Manage your delivery locations</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 font-light hover:bg-gray-800 transition-colors uppercase tracking-wide"
                >
                  <Plus size={14} />
                  Add New
                </button>
              </div>

              <div className="p-6">
                {(!userData.addresses || userData.addresses.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center mx-auto mb-6">
                      <MapPinHouse size={24} className="text-gray-400" />
                    </div>
                    <div className="text-center max-w-md mb-8 mx-auto">
                      <h3 className="text-xl font-medium text-black mb-3 tracking-wide uppercase">No Addresses Found</h3>
                      <p className="text-gray-600 font-light leading-relaxed">Add your first delivery address to get started</p>
                    </div>
                    <button
                      onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                      className="px-6 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-800 transition-colors uppercase"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData.addresses.map((addr, idx) => (
                      <div key={idx} className="border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-black mb-1 tracking-wide">
                              {addr.label || `Address ${idx + 1}`}
                            </div>
                            <div className="text-sm text-gray-600 font-light">
                              {addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                              {addr.phone && (
                                <><br />Phone: {addr.phone}</>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => setAddressModal({ open: true, address: addr, index: idx })}
                              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => deleteAddress(idx)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setActiveSection(null)}
                    className="px-6 py-3 border border-gray-300 text-black font-light hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase tracking-wide"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Form Modal */}
      {addressModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-medium tracking-wide uppercase">
                {addressModal.index >= 0 ? "Edit Address" : "Add New Address"}
              </h2>
            </div>
            <div className="p-6">
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
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Address Label (Optional)</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
          value={form.label}
          onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          placeholder="e.g., Home, Office"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
          value={form.address}
          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          placeholder="Enter your street address"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">City</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
            value={form.city}
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">State</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
            value={form.state}
            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
            placeholder="State"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">ZIP Code</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
            value={form.zip}
            onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
            placeholder="ZIP"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Country</label>
          <input
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
            value={form.country}
            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            placeholder="Country"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
        <input
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          placeholder="Enter phone number for this address"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 text-black font-light hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase tracking-wide"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default MyProfile;