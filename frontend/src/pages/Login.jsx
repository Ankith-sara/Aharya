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

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

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
        const errorMsg = res.data.message || 'Failed to send OTP';
        setOtpError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error sending OTP';
      setOtpError(errorMsg);
      toast.error(errorMsg);
    }
    setOtpLoading(false);
  };

  // VERIFY OTP & CREATE ACCOUNT
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setOtpError('');

    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success('Account created successfully!');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
      } else {
        setOtpError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error verifying OTP';
      setOtpError(errorMsg);
      toast.error(errorMsg);
    }
    setIsLoading(false);
  };

  // LOGIN HANDLER
  const handleLogin = async (event) => {
    event.preventDefault();
    
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
        toast.success('Welcome back!');
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
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
    <div className="h-screen overflow-hidden bg-white">
      <div className="flex h-full">
        {/* Left Panel - Image with Premium Overlay */}
        <div className="hidden lg:block lg:w-1/2 relative h-full">
          {/* Background Image */}
          <img 
            src="https://okhai.org/cdn/shop/files/LD25330610_1_Hero_414x650.jpg?v=1745928986" 
            alt="Aharyas Heritage" 
            className="w-full h-full object-cover filter grayscale"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-12 left-12 w-16 h-16 border border-white/20"></div>
          <div className="absolute bottom-12 right-12 w-16 h-16 border border-white/20"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center p-16">
            <div className="text-white max-w-lg">
              <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-[0.15em]">
                AHARYAS
              </h1>
              <div className="w-20 h-0.5 bg-white mb-8"></div>
              <p className="text-xl font-light leading-relaxed opacity-90">
                Where heritage meets high design, rooted deeply in culture, craft, and community.
              </p>
              <blockquote className="mt-12 border-l-2 border-white/40 pl-6 italic text-lg font-light opacity-80">
                "Fashion should honor hands and carry stories forward."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto">
          <div className="min-h-full flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              {/* Logo for Mobile */}
              <div className="lg:hidden text-center mb-12">
                <h1 className="text-4xl font-light tracking-[0.2em] mb-2">AHARYAS</h1>
                <div className="w-16 h-0.5 bg-black mx-auto"></div>
              </div>

              {/* Header */}
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-3">
                  {currentState === 'Login' ? 'WELCOME BACK' : otpSent ? 'VERIFY EMAIL' : 'JOIN US'}
                </h2>
                <div className="w-16 h-0.5 bg-black mb-6"></div>
                <p className="text-gray-600 font-light leading-relaxed">
                  {currentState === 'Login' 
                    ? 'Sign in to continue your journey with conscious luxury' 
                    : otpSent 
                    ? 'Enter the 6-digit code sent to your email'
                    : 'Create an account to begin your journey with handcrafted heritage'}
                </p>
              </div>

              {/* LOGIN FORM */}
              {currentState === 'Login' && (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 border-b-2 bg-transparent ${
                          errors.email ? 'border-red-400' : 'border-gray-200 focus:border-black'
                        } focus:outline-none transition-colors font-light text-base`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-2 font-light">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 border-b-2 bg-transparent ${
                          errors.password ? 'border-red-400' : 'border-gray-200 focus:border-black'
                        } focus:outline-none transition-colors font-light text-base`}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-2 font-light">{errors.password}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-8 py-4 bg-black text-white font-light tracking-[0.2em] text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                  >
                    {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>
                </form>
              )}

              {/* SIGNUP FORM */}
              {currentState === 'Sign Up' && !otpSent && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 border-b-2 bg-transparent ${
                          errors.name ? 'border-red-400' : 'border-gray-200 focus:border-black'
                        } focus:outline-none transition-colors font-light text-base`}
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-2 font-light">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 border-b-2 bg-transparent ${
                          errors.email ? 'border-red-400' : 'border-gray-200 focus:border-black'
                        } focus:outline-none transition-colors font-light text-base`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-2 font-light">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 border-b-2 bg-transparent ${
                          errors.password ? 'border-red-400' : 'border-gray-200 focus:border-black'
                        } focus:outline-none transition-colors font-light text-base`}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-2 font-light">{errors.password}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full mt-8 py-4 bg-black text-white font-light tracking-[0.2em] text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                  >
                    {otpLoading ? 'SENDING...' : 'CONTINUE'}
                  </button>
                </div>
              )}

              {/* OTP VERIFICATION */}
              {currentState === 'Sign Up' && otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div>
                    <p className="text-sm text-gray-600 font-light text-center mb-8">
                      We sent a verification code to<br />
                      <span className="font-normal text-black">{email}</span>
                    </p>
                    
                    <div className="flex gap-3 justify-center mb-2">
                      {Array(6).fill(0).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          ref={(el) => (otpRefs.current[i] = el)}
                          value={otpDigits[i] || ''}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-12 h-14 text-center text-lg font-light border-b-2 border-gray-300 focus:border-black focus:outline-none transition-all bg-transparent"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {otpError && (
                    <div className="bg-red-50 border-l-2 border-red-500 p-3">
                      <p className="text-red-600 text-sm font-light">{otpError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black text-white font-light tracking-[0.2em] text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? 'VERIFYING...' : 'VERIFY & CREATE ACCOUNT'}
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                        setOtpDigits(Array(6).fill(''));
                        setOtpError('');
                      }}
                      className="text-sm text-gray-600 hover:text-black transition-colors font-light tracking-wide"
                    >
                      BACK
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || otpTimer > 0}
                      className="text-sm text-gray-600 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light tracking-wide"
                    >
                      {otpTimer > 0 ? `RESEND IN ${otpTimer}S` : 'RESEND CODE'}
                    </button>
                  </div>
                </form>
              )}

              {/* Toggle Login/Signup */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 font-light">
                  {currentState === 'Login' ? (
                    <>
                      New to Aharyas?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentState('Sign Up');
                          resetForm();
                        }}
                        className="text-black font-normal hover:underline transition-all tracking-wide"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already part of our community?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentState('Login');
                          resetForm();
                        }}
                        className="text-black font-normal hover:underline transition-all tracking-wide"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;