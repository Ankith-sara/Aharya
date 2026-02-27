import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, ChevronRight, KeyRound } from 'lucide-react';
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
        setOtpSent(true); setOtpTimer(60);
        toast.success('OTP sent to your email');
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
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
          resetForm(); setIsForgotPassword(false);
        }
      } else toast.error(res.data.message || 'Invalid OTP');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    } finally { setLoading(false); }
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
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setOtp(''); setOtpSent(false); setOtpDigits(Array(6).fill(''));
    setOtpTimer(0); setShowPassword(false); setShowConfirmPassword(false);
  };

  const toggleFormMode = () => { setIsRegistering(!isRegistering); resetForm(); };
  const handleForgotPassword = () => { setIsForgotPassword(true); setIsRegistering(false); resetForm(); };
  const handleBackToLogin = () => { setIsForgotPassword(false); resetForm(); };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm bg-white text-black placeholder-gray-400";
  const labelClass = "block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center flex-shrink-0">
              {isForgotPassword ? <KeyRound className="text-black" size={20} /> : <Shield className="text-black" size={20} />}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-black uppercase tracking-wide">Aharyas Admin</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-light">
                {isForgotPassword ? 'Password Recovery' : isRegistering ? 'Create Account' : 'Management Panel'}
              </p>
            </div>
          </div>
          <div className="w-full h-0.5 bg-black"></div>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200">

          {/* Tab Switcher */}
          {!isForgotPassword && !otpSent && (
            <div className="border-b border-gray-200 flex">
              <button type="button" onClick={() => isRegistering && toggleFormMode()}
                className={`flex-1 py-3 sm:py-4 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${!isRegistering ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                Sign In
              </button>
              <button type="button" onClick={() => !isRegistering && toggleFormMode()}
                className={`flex-1 py-3 sm:py-4 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${isRegistering ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                Register
              </button>
            </div>
          )}

          {/* Forgot Password / OTP section header */}
          {(isForgotPassword || otpSent) && (
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 sm:gap-3">
                {isForgotPassword
                  ? <KeyRound size={18} className="text-gray-600" />
                  : <Mail size={18} className="text-gray-600" />}
                <div>
                  <h2 className="text-sm sm:text-base font-medium uppercase tracking-wide text-black">
                    {otpSent ? 'Verify OTP' : 'Reset Password'}
                  </h2>
                  <p className="text-xs text-gray-500 font-light uppercase tracking-wider">
                    {otpSent ? `Code sent to ${email}` : 'Enter your email and new password'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={isForgotPassword || isRegistering ? handleSendOtp : handleLogin} className="p-5 sm:p-8 space-y-4 sm:space-y-5">

              {/* Name (Register only) */}
              {isRegistering && !isForgotPassword && (
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" placeholder="Enter your full name" value={name}
                      onChange={(e) => setName(e.target.value)} className={inputClass} required />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" placeholder="admin@aharyas.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}>{isForgotPassword ? 'New Password' : 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm bg-white text-black placeholder-gray-400"
                    required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Forgot only) */}
              {isForgotPassword && (
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 focus:outline-none focus:border-black transition-all duration-300 text-sm bg-white text-black placeholder-gray-400"
                      required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password link */}
              {!isRegistering && !isForgotPassword && (
                <div className="flex justify-end">
                  <button type="button" onClick={handleForgotPassword}
                    className="text-xs text-gray-500 hover:text-black uppercase tracking-wider font-light transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full bg-black text-white py-3 sm:py-4 px-6 font-light text-sm uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {isForgotPassword ? 'Send Reset Code' : isRegistering ? 'Send Verification Code' : 'Sign In'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Back to login */}
              {isForgotPassword && (
                <button type="button" onClick={handleBackToLogin}
                  className="w-full py-2 text-xs text-gray-500 hover:text-black uppercase tracking-wider font-light transition-colors border border-gray-200 hover:border-black">
                  ← Back to Sign In
                </button>
              )}
            </form>
          ) : (
            /* OTP Form */
            <form onSubmit={handleVerifyOtp} className="p-5 sm:p-8 space-y-5 sm:space-y-6">

              <div className="text-center">
                <p className="text-xs text-gray-500 font-light uppercase tracking-wider mb-1">Enter the 6-digit code sent to</p>
                <p className="text-sm font-medium text-black uppercase tracking-wide break-all">{email}</p>
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, i) => (
                  <input key={i} type="text" maxLength="1"
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center border-2 border-gray-300 focus:border-black focus:outline-none text-lg sm:text-2xl font-medium text-black transition-all duration-300"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="text-center">
                <p className="text-xs text-gray-500 font-light mb-2 uppercase tracking-wider">Didn't receive the code?</p>
                <button type="button" onClick={handleSendOtp} disabled={otpTimer > 0 || loading}
                  className="text-xs font-medium uppercase tracking-wider text-black hover:text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                  {otpTimer > 0 ? (
                    <><div className="w-3 h-3 border border-gray-400 border-t-black rounded-full animate-spin"></div> Resend in {otpTimer}s</>
                  ) : (
                    <>Resend Code <ChevronRight size={13} /></>
                  )}
                </button>
              </div>

              {/* Verify */}
              <button type="submit" disabled={loading || otp.length < 6}
                className="w-full bg-black text-white py-3 sm:py-4 px-6 font-light text-sm uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>{isForgotPassword ? 'Reset Password' : 'Verify & Create Account'} <ArrowRight size={16} /></>
                )}
              </button>

              <button type="button" onClick={() => setOtpSent(false)}
                className="w-full py-2 text-xs text-gray-500 hover:text-black uppercase tracking-wider font-light transition-colors border border-gray-200 hover:border-black">
                ← {isForgotPassword ? 'Back to Reset Form' : 'Back to Registration'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-light">
            <Shield size={12} />
            <span>Secure admin access · Aharyas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;