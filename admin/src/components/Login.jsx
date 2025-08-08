import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
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

  const handleSendOtp = async () => {
    if (!email) return toast.error('Please enter a valid email');
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { email });
      if (res.data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        toast.success('OTP sent to your email');
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.error('Enter the complete 6-digit OTP');
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        name,
        email,
        password,
        otp,
        role: 'admin'
      });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/user/admin-login`, { email, password });
      if (res.data.success) {
        toast.success('Admin login successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
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
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-white shadow-md rounded-lg border border-secondary p-6 sm:p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Admin {isRegistering ? 'Registration' : 'Login'}
          </h2>
          <p className="text-sm text-gray-600">
            {isRegistering ? 'Create your admin account' : 'Sign in to your admin account'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleVerifyOtp : handleLogin} className="space-y-4">
          {/* Name Field (Registration only) */}
          {isRegistering && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                required
                disabled={otpSent}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={isRegistering && otpSent}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              required
              disabled={isRegistering && otpSent}
            />
          </div>

          {/* OTP Section (Registration only) */}
          {isRegistering && otpSent && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit OTP sent to your email address
                </p>
              </div>

              {/* OTP Input Grid */}
              <div className="flex justify-center gap-2 mb-4">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-12 text-center border border-gray-200 rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-text focus:border-transparent transition-colors"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0}
                  className="text-sm text-background hover:text-text hover:underline disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            {isRegistering ? (
              !otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary"
                >
                  Send Verification Code
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary"
                >
                  Verify & Create Account
                </button>
              )
            ) : (
              <button
                type="submit"
                className="w-full bg-secondary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary"
              >
                Sign In
              </button>
            )}
          </div>
        </form>

        {/* Toggle Form Mode */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            {isRegistering ? 'Already have an admin account?' : 'Need to create an admin account?'}
          </p>
          <button
            onClick={toggleFormMode}
            className="w-full mt-2 text-primary font-semibold hover:text-gray-800 hover:underline transition-colors"
          >
            {isRegistering ? 'Sign In Instead' : 'Create New Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;