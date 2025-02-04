import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        if (!token) return;

        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifystripe`,
                { orderId, success },
                { headers: { token } }
            );

            if (response.data.success) {
                setCartItems({});
                setTimeout(() => navigate('/orders'), 2000);
            } else {
                setTimeout(() => navigate('/cart'), 2000);
            }
        } catch (error) {
            console.error("Payment Verification Error:", error);
            toast.error("Payment verification failed.");
            setTimeout(() => navigate('/cart'), 2000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div className='m-20 text-center'>
            {loading ? ( 
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    <p className="ml-2 text-gray-600">Verifying payment...</p>
                </div>
            ) : (
                <p className="text-secondary font-semibold">Redirecting...</p>
            )}
        </div>
    );
};

export default Verify;