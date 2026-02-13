import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import { Tag, X } from 'lucide-react';

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

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
        setAppliedCoupon(coupon);
        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
    };

    const subtotal = getCartAmount();
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee - discount;
    const isEligible = subtotal >= coupon.minAmount;

    return (
        <div className='w-full'>
            <div className='text-2xl mb-4'>
                <Title text1={'CART'} text2={'TOTAL'} />
            </div>

            {isEligible && (
                <div className='mb-6'>
                    {!appliedCoupon ? (
                        <div className='p-4 border-2 border-dashed border-green-500 bg-green-50 rounded-sm'>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex items-start gap-3 flex-1'>
                                    <Tag size={18} className='text-green-600 mt-0.5 flex-shrink-0' />
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <span className='font-medium text-sm text-green-800 tracking-wide'>{coupon.code}</span>
                                        </div>
                                        <p className='text-xs text-green-700 font-light'>
                                            Get {currency}{coupon.discount} off on orders above {currency}{coupon.minAmount}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleApplyCoupon}
                                    className='px-5 py-2.5 bg-green-600 text-white font-light tracking-wider text-xs hover:bg-green-700 transition-all duration-300 whitespace-nowrap rounded-sm shadow-sm hover:shadow-md'
                                >
                                    APPLY
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='p-4 border-2 border-green-500 bg-green-50 rounded-sm'>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex items-center gap-3'>
                                    <Tag size={18} className='text-green-600' />
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
                                    className='p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors'
                                    aria-label='Remove coupon'
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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