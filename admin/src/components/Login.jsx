import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURl } from '../App';

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

  const handleSendOtp = async () => {
    if (!email) return toast.error('Please enter a valid email');
    try {
      const res = await axios.post(`${backendURl}/api/user/send-otp`, { email });
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
      const res = await axios.post(`${backendURl}/api/user/verify-otp`, {
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
      const res = await axios.post(`${backendURl}/api/user/admin-login`, { email, password });
      if (res.data.success) {
        toast.success('Admin login successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
    }
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin {isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={isRegistering ? handleVerifyOtp : handleLogin}>
          {isRegistering && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 px-3 py-2 border rounded"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />

          {isRegistering && !otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpTimer > 0}
              className="w-full bg-black text-white py-2 rounded hover:opacity-90 mb-3"
            >
              {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Send OTP'}
            </button>
          )}

          {isRegistering && otpSent && (
            <>
              <div className="flex justify-between gap-2 mb-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <input
                      key={i}
                      maxLength="1"
                      ref={(el) => (otpRefs.current[i] = el)}
                      value={otpDigits[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-10 h-10 text-center border rounded"
                    />
                  ))}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            {isRegistering ? 'Verify & Register' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isRegistering ? 'Already an admin?' : 'New admin?'}{' '}
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setOtpSent(false);
              setOtp('');
              setOtpDigits(Array(6).fill(''));
            }}
            className="text-indigo-600 hover:underline"
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
