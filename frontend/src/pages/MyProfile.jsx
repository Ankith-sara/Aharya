import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  ChevronRight, Heart, Clock, User, ShoppingBag, Settings, LogOut, Edit2, Trash2,
  MapPinHouse
} from "lucide-react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

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
      imageFile: file, // keep the File object for upload
      image: URL.createObjectURL(file), // preview only
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
        formData.append("image", editProfile.imageFile); // single file input name 'image'
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${userData._id}`,
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
        setActiveSection(null);
      } else {
        alert(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      alert("Failed to update profile.");
    }
    setLoading(false);
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
    { icon: <MapPinHouse size={18} />, text: "Delivery Address", description: "View your Delivery locations" },
    { icon: <ShoppingBag size={18} />, text: "Order History", link: "/orders", description: "View your past orders" },
    { icon: <Heart size={18} />, text: "Wishlist", description: "Items you've saved" },
    { icon: <Settings size={18} />, text: "Account Settings", description: "Notifications, password, privacy" },
  ];

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading profile...</span>
      </div>
    );
  }

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
            <div className="h-32 bg-gray-100"></div>
            <div className="px-6 pb-6 flex flex-col items-center relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden -mt-16 mb-4 shadow-md relative group">
                <img
                  src={userData.image || defaultAvatar}
                  alt="Profile"
                  className="w-full h-full object-cover bg-white"
                />
                <button
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 transition"
                  onClick={() => setActiveSection("Edit Profile")}
                  title="Edit Photo"
                >
                  <Edit2 className="text-white" />
                </button>
              </div>
              <h2 className="text-xl font-medium text-black mb-1">{userData.name}</h2>
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="w-full border-t border-gray-200 mt-2 pt-4">
                <div className="grid grid-cols-1 gap-3 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Email</p>
                    <p className="text-sm">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Member Since</p>
                    <p className="text-sm">{new Date(userData.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <button
                className="mt-6 w-full py-2 px-4 border border-black text-black font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setActiveSection("Edit Profile")}
              >
                EDIT PROFILE
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm p-2">
            <button className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-black transition-colors">
              <LogOut size={18} />
              <span className="font-medium" onClick={() => { if (window.confirm("Are you sure you want to log out?")) logout(); }}>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column - Account Settings */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Account Management</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {menuItems.map((item, index) => {
                const content = (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveSection(item.text)}
                  >
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
                );
                return item.link ? (
                  <Link to={item.link} key={index}>
                    {content}
                  </Link>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
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

      {/* Edit Profile Modal */}
      {activeSection === "Edit Profile" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleEditProfileSubmit}>
              <label className="block mb-2">Name</label>
              <input
                className="border p-2 w-full mb-4"
                value={editProfile.name}
                onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
                required
              />
              <label className="block mb-2">Email</label>
              <input
                className="border p-2 w-full mb-4"
                value={editProfile.email}
                onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                required
              />
              <label className="block mb-2">Profile Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
              {editProfile.image && (
                <img src={editProfile.image} alt="Preview" className="w-16 h-16 rounded-full mb-4" />
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => setActiveSection(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeSection === "Delivery Address" && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Address Management */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Addresses</h3>
                <button
                  className="bg-black text-white px-3 py-1 rounded"
                  onClick={() => setAddressModal({ open: true, address: {}, index: -1 })}
                >
                  Add Address
                </button>
              </div>
              {(!userData.addresses || userData.addresses.length === 0) ? (
                <div className="text-gray-500">No addresses yet.</div>
              ) : (
                <div className="space-y-3">
                  {userData.addresses.map((addr, idx) => (
                    <div key={idx} className="border rounded p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{addr.label || "Address"}</div>
                        <div className="text-sm">{addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setAddressModal({ open: true, address: addr, index: idx })}><Edit2 size={18} /></button>
                        <button onClick={() => deleteAddress(idx)}><Trash2 size={18} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={() => setActiveSection(null)}
              >
                Close
              </button>
            </div>
          </div>
          {addressModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{addressModal.index >= 0 ? "Edit Address" : "Add Address"}</h2>
                <AddressForm
                  initial={addressModal.address}
                  onSave={(addr) => saveAddress(addr, addressModal.index)}
                  onCancel={() => setAddressModal({ open: false, address: {}, index: -1 })}
                  loading={loading}
                />
              </div>
            </div>
          )}
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
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <label className="block mb-1">Address</label>
      <input className="border p-2 w-full mb-2" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
      <label className="block mb-1">City</label>
      <input className="border p-2 w-full mb-2" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
      <label className="block mb-1">State</label>
      <input className="border p-2 w-full mb-2" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required />
      <label className="block mb-1">ZIP</label>
      <input className="border p-2 w-full mb-2" value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} required />
      <label className="block mb-1">Country</label>
      <input className="border p-2 w-full mb-4" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
      <div className="flex gap-2">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button type="button" className="px-4 py-2 rounded border" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default MyProfile;