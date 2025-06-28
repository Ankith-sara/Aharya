import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/frontend_assets/assets';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';

    if (!password) newErrors.password = 'Password is required';
    if (currentState === 'Sign Up' && !name) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        toast.success(currentState === 'Sign Up' ? 'Account created successfully!' : 'Welcome back!');
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = 'Login | Aharyas'
  })

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
                {currentState === 'Login' ? 'Sign in to access your exclusive experience' : 'Create an account to begin your premium journey'}
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-3">
              {currentState === 'Sign Up' && (
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs uppercase tracking-wider font-medium text-gray-600">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs uppercase tracking-wider font-medium text-gray-600">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-12 pr-4 py-3 border-b focus:outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs uppercase tracking-wider font-medium text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-12 pr-12 py-3 border-b focus:outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-black'}`} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              {currentState === 'Login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs uppercase tracking-wider text-gray-600 hover:text-black hover:underline transition-colors">
                    Forgot your password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Processing...' : currentState === 'Login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="pt-6 border-gray-200">
                <div className="flex justify-center">
                  {currentState === 'Login' ? (
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => setCurrentState('Sign Up')} className="text-black font-medium hover:underline">
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <button type="button" onClick={() => setCurrentState('Login')} className="text-black font-medium hover:underline">
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