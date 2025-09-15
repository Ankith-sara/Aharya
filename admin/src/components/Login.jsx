import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    setOtp(updated.join(''));
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e) => { // Fixed: added 'e' parameter
    e.preventDefault();
    if (!email) return toast.error('Please enter a valid email');
    if (!name) return toast.error('Please enter your full name');
    if (!password) return toast.error('Please enter a password');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      // Send name and password along with email
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
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.error('Enter the complete 6-digit OTP');

    setLoading(true);
    try {
      // Only send email and otp - user details are already stored
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Admin registration successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/admin-login`, { email, password });
      if (res.data.success) {
        toast.success('Admin login successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormMode = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
    setShowPassword(false);
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  return (
    <div className="min--+h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Admin {isRegistering ? 'Registration' : 'Login'}
          </h1>
          <p className="text-sm text-gray-600">
            {isRegistering ? 'Create your admin account' : 'Welcome back! Sign in to continue'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-xl shadow-sm border-x border-b border-gray-200 p-8">
          {!otpSent ? (
            <form onSubmit={isRegistering ? (e) => handleSendOtp(e) : handleLogin} className="space-y-6">
              {/* Name Field (Registration only) */}
              {isRegistering && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegistering ? 'Send Verification Code' : 'Sign In'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>

              {/* OTP Input Grid */}
              <div className="flex justify-center gap-3 mb-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center border border-gray-300 rounded-lg text-xl font-semibold focus:outline-none focus:border-black transition-colors"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0 || loading}
                  className="text-sm text-black hover:text-gray-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium transition-colors"
              >
                Back to Registration
              </button>
            </form>
          )}

          {/* Toggle Form Mode */}
          {!otpSent && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                {isRegistering ? 'Already have an admin account?' : 'Need to create an admin account?'}
              </p>
              <button
                onClick={toggleFormMode}
                className="text-black font-medium hover:text-gray-600 transition-colors text-sm"
              >
                {isRegistering ? 'Sign In Instead' : 'Create New Account'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Secure admin access powered by your platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;