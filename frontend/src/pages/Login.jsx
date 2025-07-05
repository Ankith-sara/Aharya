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
  const [otpVerified, setOtpVerified] = useState(false); // New
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

  // Redirect if logged in
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    document.title = 'Login | Aharyas';
  }, []);

  // OTP HANDLERS
  const handleSendOtp = async () => {
    setOtpError('');
    setErrors({});

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { email });
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

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (!name || !password || !email) {
      toast.error('Please fill in all fields');
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
        navigate('/');
      } else {
        setOtpError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Error verifying OTP');
    }
    setIsLoading(false);
  };

  // --- PASSWORD LOGIN/SIGNUP HANDLERS ---
  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    if (currentState === 'Sign Up' && !name) newErrors.name = 'Name is required';

    setErrors(newErrors);

    const isFormValid = Object.keys(newErrors).length === 0;

    // Show toast if OTP is not verified after all other validations pass
    if (currentState === 'Sign Up' && isFormValid && !otpVerified) {
      toast.error('Please verify OTP before creating account.');
      return false;
    }

    return isFormValid;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const url = backendUrl + (currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login');
      const payload = currentState === 'Sign Up' ? { name, email, password } : { email, password };
      const response = await axios.post(url, payload);
      if (response.data.success) {
        toast.success(currentState === 'Sign Up' ? 'Account created successfully!' : `Welcome back, ${response.data.name}!`);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
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
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="w-full flex flex-col md:flex-row">
        {/* Left Panel - Image with overlay */}
        <div className="w-full md:w-1/2 relative hidden md:block">
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <div className="h-full flex items-center justify-center overflow-hidden">
            <img src="https://okhai.org/cdn/shop/files/LD25330610_1_Hero_414x650.jpg?v=1745928986" alt="Premium craftsmanship" className="grayscale" />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center p-10">
            <div className="border border-white/20 p-6 bg-black/40 backdrop-blur-sm">
              <h2 className="text-3xl font-light tracking-wider mb-2">ELEVATE YOUR</h2>
              <h1 className="text-5xl font-bold tracking-tight">EXPERIENCE</h1>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 bg-white flex items-center text-black p-6 md:p-10">
          <div className="max-w-md mx-auto">
            <div className="mb-5">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {currentState === 'Login' ? 'WELCOME BACK' : 'JOIN US'}
              </h1>
              <div className="h-1 w-16 bg-black mb-6"></div>
              <p className="text-gray-600">
                {currentState === 'Login'
                  ? 'Sign in to access your exclusive experience'
                  : 'Create an account to begin your premium journey'}
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={onSubmitHandler}
              className="space-y-3"
            >
              {/* Name (Sign Up only) */}
              {currentState === 'Sign Up' && (
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider font-medium text-gray-600">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs uppercase tracking-wider font-medium text-gray-600">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                    disabled={otpSent && currentState === 'Login'}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Password */}
              {(!otpSent || currentState !== 'Login') && (
                <div className="space-y-1">
                  <label htmlFor="password" className="text-xs uppercase tracking-wider font-medium text-gray-600">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-12 pr-12 py-3 border-b focus:outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-black'}`}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                </div>
              )}

              {/* Send OTP */}
              {currentState === 'Sign Up' && !otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || otpTimer > 0}
                  className="w-full py-3 bg-black text-white text-sm uppercase font-medium hover:bg-gray-900 transition-colors mt-2"
                >
                  {otpLoading ? 'Sending OTP...' : otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Send OTP'}
                </button>
              )}

              {/* Enter OTP */}
              {currentState === 'Sign Up' && otpSent && !otpVerified && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-xs uppercase tracking-wider font-medium text-gray-600">
                    Enter OTP
                  </label>
                  <div className="flex gap-2 justify-between">
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
                          className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:border-black"
                        />
                      ))}
                  </div>
                  {otpError && <p className="text-red-500 text-xs mt-1">{otpError}</p>}
                  <button
                    type="submit"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-gray-900 transition-colors mt-2"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}

              {currentState === 'Login' && !otpSent && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Sign In'}
                </button>
              )}

              {/* Switch between Login and Sign Up */}
              <div className="pt-6 border-gray-200">
                <div className="flex justify-center">
                  {currentState === 'Login' ? (
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentState('Sign Up');
                          setOtpSent(false);
                          setOtp('');
                          setOtpError('');
                          setPassword('');
                          setErrors({});
                        }}
                        className="text-black font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentState('Login');
                          setOtpSent(false);
                          setOtp('');
                          setOtpError('');
                          setPassword('');
                          setErrors({});
                        }}
                        className="text-black font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;