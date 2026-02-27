import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { Tag, X, Check, Sparkles } from 'lucide-react';

const COUPONS = [
    { code: 'FLAT500',  discount: 500,  minAmount: 3000, type: 'flat' },
    { code: 'FLAT1000', discount: 1000, minAmount: 6000, type: 'flat' },
];

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount, getAppliedCoupon, applyCoupon, clearCoupon } = useContext(ShopContext);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput]     = useState('');
    const [couponError, setCouponError]     = useState('');

    useEffect(() => {
        const saved = getAppliedCoupon ? getAppliedCoupon() : null;
        if (saved) setAppliedCoupon(saved);
    }, [getAppliedCoupon]);

    const subtotal = getCartAmount ? getCartAmount() : 0;

    // Find the best coupon user qualifies for (but don't reveal the code)
    const bestEligible = COUPONS
        .filter(c => subtotal >= c.minAmount)
        .sort((a, b) => b.discount - a.discount)[0] || null;

    // Find if they're close to unlocking the next tier
    const nextUnlock = COUPONS
        .filter(c => subtotal < c.minAmount)
        .sort((a, b) => a.minAmount - b.minAmount)[0] || null;

    const handleApplyCoupon = () => {
        setCouponError('');
        const inputCode = couponInput.trim().toUpperCase();

        if (!inputCode) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const matched = COUPONS.find(c => c.code === inputCode);

        if (!matched) {
            setCouponError('Invalid coupon code. Please check and try again.');
            return;
        }

        if (subtotal < matched.minAmount) {
            setCouponError(`Add ${currency}${matched.minAmount - subtotal} more to use this coupon`);
            return;
        }

        setAppliedCoupon(matched);
        if (applyCoupon) applyCoupon(matched);
        setCouponInput('');
        setCouponError('');
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        if (clearCoupon) clearCoupon();
        setCouponInput('');
        setCouponError('');
    };

    const discount    = appliedCoupon ? appliedCoupon.discount : 0;
    const shippingFee = subtotal === 0 ? 0 : delivery_fee;
    const total       = subtotal === 0 ? 0 : subtotal + shippingFee - discount;

    return (
        <div className='w-full'>
            <div className='text-2xl mb-4'>
                <Title text1={'CART'} text2={'TOTAL'} />
            </div>

            {/* Coupon eligibility hint — no codes exposed */}
            {!appliedCoupon && (bestEligible || nextUnlock) && (
                <div className={`mb-4 px-4 py-3 flex items-start gap-2.5 border ${bestEligible ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'}`}>
                    <Sparkles size={14} className={`flex-shrink-0 mt-0.5 ${bestEligible ? 'text-black' : 'text-gray-400'}`} />
                    <p className='text-xs font-light text-gray-700 leading-relaxed'>
                        {bestEligible
                            ? <>You're eligible for a <span className='font-medium text-black'>coupon discount</span> on this order. Apply your coupon below.</>
                            : <>Add <span className='font-medium text-black'>{currency}{nextUnlock.minAmount - subtotal}</span> more to unlock a coupon discount.</>
                        }
                    </p>
                </div>
            )}

            {/* Coupon Input / Applied State */}
            <div className='mb-6 border border-gray-200'>
                <div className='p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2'>
                    <Tag size={13} className='text-gray-600' />
                    <span className='text-xs font-medium uppercase tracking-wider text-gray-700'>Coupon Code</span>
                </div>

                <div className='p-4'>
                    {appliedCoupon ? (
                        <div className='flex items-center justify-between gap-3 p-3 border border-green-300 bg-green-50'>
                            <div className='flex items-center gap-2.5'>
                                <div className='w-7 h-7 bg-green-600 flex items-center justify-center flex-shrink-0'>
                                    <Check size={13} className='text-white' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-medium text-xs text-green-800 uppercase tracking-wide'>{appliedCoupon.code}</span>
                                        <span className='text-xs px-2 py-0.5 bg-green-600 text-white uppercase tracking-wider font-light'>Applied</span>
                                    </div>
                                    <p className='text-xs text-green-700 font-light mt-0.5'>
                                        You saved {currency}{appliedCoupon.discount}!
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleRemoveCoupon}
                                className='p-1 text-green-600 hover:text-red-600 transition-colors flex-shrink-0'
                                aria-label='Remove coupon'>
                                <X size={15} />
                            </button>
                        </div>
                    ) : (
                        <div className='space-y-2'>
                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    value={couponInput}
                                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    placeholder='Enter coupon code'
                                    className='flex-1 px-3 py-2.5 border border-gray-300 bg-white focus:outline-none focus:border-black transition-colors text-sm uppercase tracking-wide font-medium'
                                />
                                <button onClick={handleApplyCoupon}
                                    className='px-5 py-2.5 bg-black text-white text-xs font-light uppercase tracking-wider hover:bg-gray-800 transition-all duration-300 whitespace-nowrap'>
                                    Apply
                                </button>
                            </div>
                            {couponError && (
                                <p className='text-xs text-red-600 font-light flex items-center gap-1'>
                                    <X size={11} /> {couponError}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Price Breakdown */}
            <div className='flex flex-col gap-2 text-sm'>
                <div className='flex justify-between text-gray-700'>
                    <p className='font-light'>Subtotal</p>
                    <p>{currency}{subtotal}.00</p>
                </div>
                <hr />
                <div className='flex justify-between text-gray-700'>
                    <p className='font-light'>Shipping Fee</p>
                    <p>{currency}{shippingFee}.00</p>
                </div>
                {appliedCoupon && (
                    <>
                        <hr />
                        <div className='flex justify-between text-green-600'>
                            <p className='font-light'>Discount ({appliedCoupon.code})</p>
                            <p>-{currency}{discount}.00</p>
                        </div>
                    </>
                )}
                <hr />
                <div className='flex justify-between font-medium text-base'>
                    <p>Total</p>
                    <p>{currency}{total}.00</p>
                </div>
                {appliedCoupon && (
                    <p className='text-xs text-green-600 font-light text-right'>
                        You're saving {currency}{discount} on this order!
                    </p>
                )}
            </div>
        </div>
    );
}

export default CartTotal;