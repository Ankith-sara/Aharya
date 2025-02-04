import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const MyProfile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [userData, setUserData] = useState({ name: '', email: '', cartData: {} });
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/login`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch user data.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        fetchUserData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-text">My Profile</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {!isEditing ? (
          <>
            <p className="mb-4"><strong>Name:</strong> {userData.name}</p>
            <p className="mb-4"><strong>Email:</strong> {userData.email}</p>
            <p className="mb-4"><strong>Cart Data:</strong> {JSON.stringify(userData.cartData)}</p>
            <button
              className="bg-secondary text-primary w-full p-3 rounded hover:bg-[#432c10] transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={updateProfile}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-secondary text-primary w-[48%] p-3 rounded hover:bg-[#432c10] transition"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-black w-[48%] p-3 rounded hover:bg-gray-400 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;