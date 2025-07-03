import React, { useState } from 'react';
import axios from 'axios';
import { backendURl } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setToken }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isRegistering ? '/api/user/admin-register' : '/api/user/admin';
            const payload = isRegistering ? { name, email, password } : { email, password };

            const response = await axios.post(`${backendURl}${endpoint}`, payload);

            if (response.data.success) {
                toast.success(response.data.message || 'Success');
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Admin {isRegistering ? 'Register' : 'Login'} Panel
                </h1>

                <form onSubmit={onSubmitHandler}>
                    {isRegistering && (
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Full Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder="Your name"
                                className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Email address</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="your@email.com"
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Your password"
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            required
                        />
                    </div>

                    <button
                        className="w-full py-2 px-4 rounded-md text-white bg-black font-semibold hover:opacity-90 transition"
                        type="submit"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        className="text-indigo-600 hover:underline font-medium"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Login here' : 'Register here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;