import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  // Form fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    setOtp(updated.join(''));
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // OTP Timer effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Handle redirect after login
  const handlePostLoginRedirect = () => {
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      navigate(returnUrl);
    } else {
      navigate('/');
    }
  };

  // Redirect if logged in
  useEffect(() => {
    if (token) {
      handlePostLoginRedirect();
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = 'Login | Aharyas';
  }, []);

  // Reset form when switching between Login/SignUp
  const resetForm = () => {
    setName('');
    setPassword('');
    setEmail('');
    setErrors({});
    setOtpSent(false);
    setOtp('');
    setOtpError('');
    setOtpTimer(0);
    setOtpDigits(Array(6).fill(''));
  };

  // SEND OTP
  const handleSendOtp = async () => {
    setOtpError('');
    setErrors({});

    // Basic validation before sending OTP
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { 
        email, 
        name, 
        password 
      });
      if (res.data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        toast.success('OTP sent to your email');
      } else {
        setOtpError(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Error sending OTP');
    }
    setOtpLoading(false);
  };

  // VERIFY OTP & CREATE ACCOUNT
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        name,
        email,
        password,
        otp,
      });

      if (res.data.success) {
        toast.success('Account created successfully!');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        // Redirect will be handled by useEffect when token changes
      } else {
        setOtpError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Error verifying OTP');
    }
    setIsLoading(false);
  };

  // LOGIN HANDLER
  const handleLogin = async (event) => {
    event.preventDefault();
    
    // Validate login form
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, { 
        email, 
        password 
      });
      
      if (response.data.success) {
        toast.success(`Welcome back, ${response.data.name}!`);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        // Redirect will be handled by useEffect when token changes
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black">
      <div className="flex flex-col lg:flex-row">
        {/* Left Panel - Image with overlay */}
        <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="h-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://okhai.org/cdn/shop/files/LD25330610_1_Hero_414x650.jpg?v=1745928986" 
              alt="Premium craftsmanship" 
              className="w-full h-full object-cover filter grayscale" 
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center p-10">
            <div className="bg-white/95 backdrop-blur-sm p-12 shadow-2xl border-l-4 border-black max-w-md">
              <h2 className="text-3xl font-light tracking-wider mb-4 text-black">ELEVATE YOUR</h2>
              <h1 className="text-5xl font-light tracking-tight mb-6 text-black">EXPERIENCE</h1>
              <div className="w-16 h-0.5 bg-black mb-6"></div>
              <blockquote className="text-lg font-light text-gray-700 leading-relaxed">
                "Join a community that believes fashion should honor heritage, empower artisans, and carry stories forward."
              </blockquote>
            </div>
          </div>
          <div className="absolute top-8 left-8 w-16 h-16 border border-white/20 z-30"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border border-white/20 z-30"></div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-white to-stone-50 flex items-center">
          <div className="w-full max-w-lg mx-auto p-8 lg:p-12">
            <div className="mb-12">
              <h1 className="text-4xl font-light tracking-wider mb-4 text-black">
                {currentState === 'Login' ? 'WELCOME BACK' : 'JOIN US'}
              </h1>
              <div className="w-16 h-0.5 bg-black mb-6"></div>
              <p className="text-gray-600 font-light text-lg leading-relaxed">
                {currentState === 'Login'
                  ? 'Sign in to access your exclusive experience with conscious luxury'
                  : 'Create an account to begin your premium journey with handcrafted heritage'}
              </p>
            </div>

            {/* LOGIN FORM */}
            {currentState === 'Login' && (
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-light text-gray-700 tracking-wide uppercase">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Mail size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-14 pr-4 py-4 bg-white border-b-2 focus:outline-none transition-all duration-300 font-light text-lg ${
                        errors.email 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-black'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 font-light">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-light text-gray-700 tracking-wide uppercase">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Lock size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-14 pr-14 py-4 bg-white border-b-2 focus:outline-none transition-all duration-300 font-light text-lg ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-black'
                      }`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 font-light">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black text-white text-sm uppercase font-light tracking-widest hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {currentState === 'Sign Up' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-light text-gray-700 tracking-wide uppercase">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <User size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-14 pr-4 py-4 bg-white border-b-2 focus:outline-none transition-all duration-300 font-light text-lg ${
                        errors.name 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-black'
                      }`}
                      placeholder="Enter your full name"
                      disabled={otpSent}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 font-light">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-light text-gray-700 tracking-wide uppercase">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Mail size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-14 pr-4 py-4 bg-white border-b-2 focus:outline-none transition-all duration-300 font-light text-lg ${
                        errors.email 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-black'
                      }`}
                      placeholder="Enter your email address"
                      disabled={otpSent}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 font-light">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-light text-gray-700 tracking-wide uppercase">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Lock size={20} className="text-gray-400 group-focus-within:text-black transition-colors duration-300" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-14 pr-14 py-4 bg-white border-b-2 focus:outline-none transition-all duration-300 font-light text-lg ${
                        errors.password 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-gray-200 focus:border-black'
                      }`}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      disabled={otpSent}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-2 font-light">{errors.password}</p>
                    )}
                  </div>
                </div>

                {!otpSent && (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="w-full py-4 bg-black text-white text-sm uppercase font-light tracking-widest hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {otpLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </div>
                )}

                {otpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6 pt-4">
                    <div className="text-center">
                      <h3 className="text-xl font-light mb-2 text-black tracking-wide">VERIFY YOUR EMAIL</h3>
                      <div className="w-12 h-0.5 bg-black mx-auto mb-4"></div>
                      <p className="text-gray-600 font-light">Enter the 6-digit code sent to your email</p>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            ref={(el) => (otpRefs.current[i] = el)}
                            value={otpDigits[i] || ''}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="w-12 h-12 text-center text-lg font-light border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 bg-white"
                          />
                        ))}
                    </div>
                    
                    {otpError && (
                      <p className="text-red-500 text-sm text-center font-light">{otpError}</p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-black text-white text-sm uppercase font-light tracking-widest hover:bg-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || otpTimer > 0}
                        className="text-sm text-gray-600 hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light"
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Switch between Login and Sign Up */}
            <div className="pt-8 border-t border-gray-200 mt-8">
              <div className="text-center">
                {currentState === 'Login' ? (
                  <p className="text-gray-600 font-light">
                    New to Aharyas?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState('Sign Up');
                        resetForm();
                      }}
                      className="text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-0.5 tracking-wide"
                    >
                      Create an account
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600 font-light">
                    Already part of our community?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState('Login');
                        resetForm();
                      }}
                      className="text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-0.5 tracking-wide"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;