import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { Tag, X, Check } from 'lucide-react';

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');

    const coupon = {
        code: 'FLAT1000',
        discount: 1000,
        minAmount: 6000,
        type: 'flat'
    };

    useEffect(() => {
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (error) {
                console.error('Error loading saved coupon:', error);
                localStorage.removeItem('appliedCoupon');
            }
        }
    }, []);

    const handleApplyCoupon = () => {
        setCouponError('');

        // Validate coupon code
        if (!couponInput.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        if (couponInput.toUpperCase() !== coupon.code) {
            setCouponError('Invalid coupon code');
            return;
        }

        // Check if cart meets minimum amount
        const subtotal = getCartAmount ? getCartAmount() : 0;
        if (subtotal < coupon.minAmount) {
            setCouponError(`Minimum order of ${currency}${coupon.minAmount} required`);
            return;
        }

        // Apply coupon
        setAppliedCoupon(coupon);
        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
        setCouponInput('');
        setCouponError('');
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
        setCouponInput('');
        setCouponError('');
    };

    const subtotal = getCartAmount ? getCartAmount() : 0;
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee - discount;
    const isEligible = subtotal >= coupon.minAmount;

    return (
        <div className='w-full'>
            <div className='text-2xl mb-4'>
                <Title text1={'CART'} text2={'TOTAL'} />
            </div>

            {/* Coupon Section */}
            <div className='mb-6'>
                {!appliedCoupon ? (
                    <div className='space-y-3'>
                        <div className='space-y-2'>
                            <label className='block text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Have a coupon code?
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    value={couponInput}
                                    onChange={(e) => {
                                        setCouponInput(e.target.value.toUpperCase());
                                        setCouponError('');
                                    }}
                                    placeholder='Enter code'
                                    className='flex-1 px-4 py-2.5 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors font-medium text-sm uppercase tracking-wide'
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className='px-6 py-2.5 bg-black text-white font-light tracking-wider text-xs hover:bg-gray-800 transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md'
                                >
                                    APPLY
                                </button>
                            </div>
                            {couponError && (
                                <p className='text-xs text-red-600 font-light flex items-center gap-1'>
                                    <X size={12} />
                                    {couponError}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='p-4 border-2 border-green-500 bg-green-50 rounded-sm'>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0'>
                                    <Check size={16} className='text-white' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='font-medium text-sm text-green-800 tracking-wide'>{appliedCoupon.code}</span>
                                        <span className='text-xs px-2 py-0.5 bg-green-600 text-white rounded-full'>Applied</span>
                                    </div>
                                    <p className='text-xs text-green-700 font-light'>
                                        You saved {currency}{appliedCoupon.discount}!
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className='p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors flex-shrink-0'
                                aria-label='Remove coupon'
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency}{subtotal}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery_fee}.00</p>
                </div>
                {appliedCoupon && (
                    <>
                        <hr />
                        <div className='flex justify-between text-green-600'>
                            <p>Discount ({appliedCoupon.code})</p>
                            <p>-{currency}{discount}.00</p>
                        </div>
                    </>
                )}
                <hr />
                <div className='flex justify-between font-medium text-base'>
                    <p>Total</p>
                    <p>{currency}{total}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal