import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
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

  return (
    <div className="min-h-screen px-6 py-10 bg-primary">
      <div className="my-8 flex flex-col md:flex-col lg:flex-row gap-12 items-center">
        {/* Left Panel - Image */}
        <div className="w-full md:w-1/2 hidden md:block bg-secondary">
          <div className="h-full flex items-center justify-center overflow-hidden">
            <img src={assets.login_bg} alt="Aharya Craftsmanship" className="object-cover h-full w-full opacity-90" />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Title text1={currentState === 'Login' ? 'Welcome' : 'Join'} text2={currentState === 'Login' ? 'Back' : 'Us'} />
              <p className="text-text mt-2">
                {currentState === 'Login' ? 'Sign in to access your account' : 'Create an account to start your journey'}
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              {currentState === 'Sign Up' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-secondary/25 focus:border-secondary'}`} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-secondary/25 focus:border-secondary'}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-secondary/25 focus:border-secondary'}`} />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {currentState === 'Login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-secondary hover:text-secondary/80 hover:underline transition-colors">
                    Forgot your password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? 'Processing...' : currentState === 'Login' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="mt-6 text-center">
                {currentState === 'Login' ? (
                  <p className="text-text">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setCurrentState('Sign Up')} className="text-secondary font-medium hover:underline"> Sign up </button>
                  </p>
                ) : (
                  <p className="text-text">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setCurrentState('Login')} className="text-secondary font-medium hover:underline"> Sign in </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;