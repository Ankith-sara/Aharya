import React, { useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreditCard, Truck, Home } from 'lucide-react';
import { useEffect } from 'react';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const res = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
        headers: { token }
      });

      if (res.data.success) {
        const user = res.data.user;

        // Autofill the form
        setFormData(prev => ({
          ...prev,
          Name: user.name || '',
          email: user.email || '',
          street: user.addresses?.[0]?.address || '',
          city: user.addresses?.[0]?.city || '',
          state: user.addresses?.[0]?.state || '',
          pincode: user.addresses?.[0]?.zip || '',
          country: user.addresses?.[0]?.country || '',
          phone: user.addresses?.[0]?.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  fetchUser();
}, []);

  // Handles input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Payment for order',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, response, { headers: { token } });
          if (data.success) {
            setCartItems({});
            navigate('/orders');
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  // Handles form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Prepare order items
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black mt-20 px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="text-3xl text-center mb-12">
        <Title text1="CHECKOUT" text2="DETAILS" />
      </div>
      <form onSubmit={onSubmitHandler} className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Delivery Information */}
        <div className="space-y-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <Home size={22} className="text-black" />
              <h3 className="font-medium text-lg">Delivery Information</h3>
            </div>
            <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Name</label>
                  <input onChange={onChangeHandler} name="Name" value={formData.Name} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" placeholder="Enter your name" required />
                </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Email Address</label>
                <input onChange={onChangeHandler} name="email" value={formData.email} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="email" placeholder="Enter your email address" required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Street Address</label>
                <input onChange={onChangeHandler} name="street" value={formData.street} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" placeholder="Enter your street address" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">City</label>
                  <input onChange={onChangeHandler} name="city" value={formData.city} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" placeholder="Enter your city" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">State</label>
                  <input onChange={onChangeHandler} name="state" value={formData.state} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" placeholder="Enter your state" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Postal Code</label>
                  <input onChange={onChangeHandler} name="pincode" value={formData.pincode} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="number" placeholder="Enter your postal code" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Country</label>
                  <input onChange={onChangeHandler} name="country" value={formData.country} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="text" placeholder="Enter your country" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-gray-900 font-medium">Phone Number</label>
                <input onChange={onChangeHandler} name="phone" value={formData.phone} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="number" placeholder="Enter your phone number" required />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
              <CartTotal />
            </div>
            <div className="p-6 space-y-4 bg-gray-50">
              <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-black to-gray-900 text-white font-semibold hover:from-gray-900 hover:to-black transition-all">
                PLACE ORDER
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our <span className="underline cursor-pointer hover:text-black">Terms of Service</span> and <span className="underline cursor-pointer hover:text-black">Privacy Policy</span>
              </p>
            </div>

            {/* Payment Method */}
            <div className="border-t border-gray-100 bg-white">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <CreditCard size={22} className="text-black" />
                <h3 className="font-semibold text-lg text-gray-900">Payment Method</h3>
              </div>
              <div className="p-6 space-y-4">
                <PaymentOption method={method} setMethod={setMethod} type="stripe" logo={assets.stripe_logo} />
                <PaymentOption method={method} setMethod={setMethod} type="razorpay" logo={assets.razorpay_logo} />
                <PaymentOption method={method} setMethod={setMethod} type="cod" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const PaymentOption = ({ method, setMethod, type, logo }) => (
  <div onClick={() => setMethod(type)} className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-all ${method === type ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
    <div className={`w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center ${method === type ? 'border-black' : ''}`}>
      {method === type && <div className="w-3 h-3 bg-black rounded-full"></div>}
    </div>
    {logo ? (
      <img className="h-6" src={logo} alt={`${type} payment`} />
    ) : (
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 p-1 rounded">
          <CreditCard size={18} />
        </div>
        <span className="font-medium">Cash on Delivery</span>
      </div>
    )}
  </div>
);

export default PlaceOrder;