import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, ChevronRight, KeyRound } from 'lucide-react';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter a valid email');
    if (!name && !isForgotPassword) return toast.error('Please enter your full name');
    if (!password) return toast.error('Please enter a password');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    
    if (isForgotPassword) {
      if (!confirmPassword) return toast.error('Please confirm your password');
      if (password !== confirmPassword) return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const endpoint = isForgotPassword 
        ? `${backendUrl}/api/user/forgot-password-otp`
        : `${backendUrl}/api/user/send-admin-otp`;
      
      const payload = isForgotPassword 
        ? { email, newPassword: password }
        : { email, name, password };

      const res = await axios.post(endpoint, payload);

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
      const endpoint = isForgotPassword
        ? `${backendUrl}/api/user/reset-password`
        : `${backendUrl}/api/user/verify-admin-otp`;
      
      const res = await axios.post(endpoint, { email, otp });

      if (res.data.success) {
        toast.success(res.data.message || (isForgotPassword ? 'Password reset successful' : 'Admin registration successful'));
        
        if (!isForgotPassword) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        } else {
          // After password reset, go back to login
          resetForm();
          setIsForgotPassword(false);
        }
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

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setOtpSent(false);
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleFormMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsRegistering(false);
    resetForm();
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    resetForm();
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Floating Header */}
        <div className="text-center flex flex-row justify-center gap-5 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            {isForgotPassword ? <KeyRound className="text-black" size={36} /> : <Shield className="text-black" size={36} />}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Aharyas Admin
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <p className="text-sm">
                {isForgotPassword 
                  ? 'Reset your password securely'
                  : isRegistering 
                    ? 'Create your secure account' 
                    : 'Welcome back to the command center'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {!otpSent ? (
            <form onSubmit={isForgotPassword || isRegistering ? handleSendOtp : handleLogin} className="p-8 space-y-6">
              {/* Tab Switcher - Only show if not in forgot password mode */}
              {!isForgotPassword && (
                <div className="flex bg-black/20 p-1.5 rounded-xl mb-8">
                  <button
                    type="button"
                    onClick={() => !isRegistering && toggleFormMode()}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isRegistering
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => isRegistering && toggleFormMode()}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isRegistering
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Forgot Password Header */}
              {isForgotPassword && (
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
                  <p className="text-gray-400 text-sm">Enter your email and new password</p>
                </div>
              )}

              {/* Name Field (Registration only) */}
              {isRegistering && !isForgotPassword && (
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-2.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-white mb-2.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={20} />
                  <input
                    type="email"
                    placeholder="admin@aharyas.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-white mb-2.5 ml-1">
                  {isForgotPassword ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Forgot Password only) */}
              {isForgotPassword && (
                <div className="group">
                  <label className="block text-sm font-semibold text-white mb-2.5 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-white transition-colors" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link - Show only on login form */}
              {!isRegistering && !isForgotPassword && (
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:hover:scale-100 mt-8"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {isForgotPassword 
                        ? 'Send Reset Code' 
                        : isRegistering 
                          ? 'Send Verification Code' 
                          : 'Sign In'}
                    </span>
                  </>
                )}
              </button>

              {/* Back to Login - Show only on forgot password form */}
              {isForgotPassword && (
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full text-gray-400 hover:text-white py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Back to Sign In
                </button>
              )}

              {/* Helper Text */}
              {!isRegistering && !isForgotPassword && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  Secure admin access with encrypted authentication
                </p>
              )}
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="p-8 space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
                  <Mail className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {isForgotPassword ? 'Verify Reset Code' : 'Verify Your Email'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-white font-semibold mt-2">{email}</p>
              </div>

              {/* OTP Input Grid */}
              <div className="flex justify-center gap-3 mb-8">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-14 h-16 text-center bg-white/5 border-2 border-white/20 rounded-xl text-2xl font-bold text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-3">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0 || loading}
                  className="text-sm text-white hover:text-gray-300 font-semibold disabled:text-gray-600 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {otpTimer > 0 ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Resend in {otpTimer}s
                    </>
                  ) : (
                    <>
                      Resend Code
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>
                      {isForgotPassword ? 'Reset Password' : 'Verify & Create Account'}
                    </span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-gray-400 hover:text-white py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isForgotPassword ? 'Back to Reset Form' : 'Back to Registration'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
            <Shield size={14} />
            <span>Secure admin access powered by Aharyas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;