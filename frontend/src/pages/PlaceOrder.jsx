import React, { useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreditCard, Home, Shield, ArrowLeft, MapPin, Phone, Mail, User, Package } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const initPay = async (order, userId, orderItems, totalAmount) => {
    await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Aharyas',
      description: 'Payment for order',
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, {
            ...response,
            userId,
            items: orderItems,
            amount: totalAmount,
            address: formData
          }, { headers: { Authorization: `Bearer ${token}` } });

          if (verifyRes.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(verifyRes.data.message);
          }
        } catch (err) {
          console.error('Error verifying Razorpay payment:', err);
          toast.error('Payment verification failed.');
        }
      },
      prefill: {
        name: formData.Name,
        email: formData.email,
        contact: formData.phone
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!agreeToTerms) {
      toast.error('Please agree to our Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);

    const decoded = jwtDecode(token);

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find((p) => p._id === items);
            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItems[items][item],
                size: item,
                image: product.images?.[0] || null
              });
            }
          }
        }
      }

      let orderData = {
        userId: decoded.id,
        address: formData,
        items: orderItems,
        amount: finalAmount,
        discount: discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order, decoded.id, orderItems, orderData.amount);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black mt-20">
      <section className="py-12 px-4 sm:px-8 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-3xl mb-6">
              <Title text1="CHECKOUT" text2="DETAILS" />
            </div>
            <p className="text-gray-500 font-light">
              Complete your order by providing delivery and payment information
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="px-4 sm:px-8 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={onSubmitHandler} className="grid xl:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              {/* Delivery Information */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Home size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Information
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          onChange={onChangeHandler}
                          name="Name"
                          value={formData.Name}
                          className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                          type="text"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            onChange={onChangeHandler}
                            name="email"
                            value={formData.email}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                            type="email"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          onChange={onChangeHandler}
                          name="phone"
                          value={formData.phone}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                          type="tel"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      Delivery Address
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Street Address *
                        </label>
                        <input
                          onChange={onChangeHandler}
                          name="street"
                          value={formData.street}
                          className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                          type="text"
                          placeholder="House number, street name, area"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            City *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="city"
                            value={formData.city}
                            className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                            type="text"
                            placeholder="Enter your city"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            State *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="state"
                            value={formData.state}
                            className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                            type="text"
                            placeholder="Enter your state"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Postal Code *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="pincode"
                            value={formData.pincode}
                            className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                            type="text"
                            placeholder="Enter postal code"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="country"
                            value={formData.country}
                            className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-light"
                            type="text"
                            placeholder="Enter your country"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          id="agree-terms"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="w-4 h-4 text-black bg-white border-gray-300 focus:ring-black focus:ring-2 cursor-pointer"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="agree-terms" className="block text-sm text-gray-700 cursor-pointer leading-relaxed font-light">
                          I agree to the{' '}
                          <a href="/termsconditions" target="_blank" className="text-black font-medium underline hover:text-gray-700 transition-colors"> Terms & Conditions</a>,{' '}
                          <a href="/privacypolicy" target="_blank" className="text-black font-medium underline hover:text-gray-700 transition-colors"> Privacy Policy</a>, and{' '}
                          <a href="/shippingpolicy" target="_blank" className="text-black font-medium underline hover:text-gray-700 transition-colors"> Shipping Policy</a>
                          . I understand that orders are processed within 0-7 days and Aharya is not liable for courier delays. *
                        </label>

                        {!agreeToTerms && (
                          <p className="text-xs text-red-600 mt-2 flex items-center gap-1 font-light">
                            <Shield size={10} />
                            You must agree to our terms before placing your order
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 p-4 border border-gray-200 bg-gray-50">
                      <h4 className="font-medium text-black text-sm mb-2 tracking-wide">Key Policy Highlights:</h4>
                      <ul className="text-xs text-gray-600 space-y-1 font-light">
                        <li>• Processing time: 0-7 days from order confirmation</li>
                        <li>• Shipping via registered courier services (domestic & international)</li>
                        <li>• Aharya ensures timely handover to courier companies</li>
                        <li>• Support available at +91 9063284008 or aharyasofficial@gmail.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <PaymentOption method={method} setMethod={setMethod} type="razorpay" logo={assets.razorpay_logo} />
                  <PaymentOption method={method} setMethod={setMethod} type="cod" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 shadow-sm sticky top-6">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Summary
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <CartTotal />

                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading || !agreeToTerms}
                      className={`w-full py-4 font-light tracking-wide transition-all duration-300 uppercase ${!agreeToTerms
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="font-light">Processing...</span>
                        </div>
                      ) : (
                        'Place Order'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="w-full py-4 border border-gray-300 text-black font-light tracking-wide hover:border-black hover:bg-gray-50 transition-all duration-300 uppercase"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        <span>Back to Cart</span>
                      </div>
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3 font-light">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="uppercase tracking-wider">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed text-center font-light">
                      Your information is protected with industry-standard encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const PaymentOption = ({ method, setMethod, type, logo }) => (
  <div
    onClick={() => setMethod(type)}
    className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-300 hover:shadow-sm ${method === type
      ? 'border-black bg-gray-50'
      : 'border-gray-200 hover:border-gray-400'
      }`}
  >
    <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${method === type ? 'border-black' : 'border-gray-300'
      }`}>
      {method === type && <div className="w-2.5 h-2.5 bg-black"></div>}
    </div>

    {logo ? (
      <div className="flex items-center gap-3">
        <img className="h-6 object-contain" src={logo} alt={`${type} payment`} />
        <div className="flex flex-col">
          <span className="font-medium text-black capitalize tracking-wide">{type}</span>
          <span className="text-xs text-gray-500 font-light">
            {type === 'Razorpay' ? 'Credit/Debit Cards' : 'UPI, Net Banking, Wallets'}
          </span>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 border border-gray-200">
          <CreditCard size={18} className="text-gray-600" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-black tracking-wide">Cash on Delivery</span>
          <span className="text-xs text-gray-500 font-light">Pay when you receive</span>
        </div>
      </div>
    )}
  </div>
);

export default PlaceOrder;