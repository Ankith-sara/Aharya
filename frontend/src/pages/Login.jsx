import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/frontend_assets/assets';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

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

    try {
      const url = backendUrl + (currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login');
      const payload = currentState === 'Sign Up' ? { name, email, password } : { email, password };

      const response = await axios.post(url, payload);

      if (response.data.success) {
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
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className="flex flex-wrap m-20 bg-background">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 h-[80vh] hidden md:flex items-center justify-center">
        <img src={assets.login_bg} alt="Login Illustration" className=" h-[80vh] object-cover" />
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 h-[80vh] flex items-center justify-center p-6">
        <form onSubmit={onSubmitHandler} className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-text">{currentState}</h2>
          {
            currentState === 'Sign Up' && (
              <div className="mb-4">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-secondary" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )
          }

          <div className="mb-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-secondary" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-secondary rounded focus:outline-none focus:ring-2 focus:ring-secondary" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-between text-sm mt-[-8px] mb-4">
            <p className="cursor-pointer text-secondary hover:underline">Forgot your password?</p>
            {
              currentState === 'Login' ? (
                <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-secondary hover:underline" > Create account </p>
              ) : (
                <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-secondary hover:underline" > Login here </p>
              )
            }
          </div>

          <button type="submit" className="bg-secondary text-primary w-full p-3 rounded hover:bg-[#432c10] transition" >
            {
              currentState === 'Login' ? 'Sign In' : 'Sign Up'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;