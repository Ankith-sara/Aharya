import couponModel from '../models/CouponModel.js';

// Create coupon (admin)
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, value, minOrderValue, expiresAt, usageLimit } = req.body;
        const createdBy = req.user.id;

        const existing = await couponModel.findOne({ code: code.toUpperCase() });
        if (existing) return res.status(400).json({ success: false, message: 'Coupon code already exists' });

        const coupon = new couponModel({ code, discountType, value, minOrderValue, expiresAt, usageLimit, createdBy });
        await coupon.save();

        res.status(201).json({ success: true, message: 'Coupon created', coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Validate coupon
const validateCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        if (!code || !amount) return res.status(400).json({ success: false, message: 'Code and amount required' });

        const coupon = await couponModel.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }
        if (amount < coupon.minOrderValue) {
            return res.status(400).json({ success: false, message: `Minimum order value is ₹${coupon.minOrderValue}` });
        }

        const discount = coupon.discountType === 'percent'
            ? Math.min(Math.floor((coupon.value / 100) * amount), amount)
            : Math.min(coupon.value, amount);

        res.json({
            success: true,
            discount,
            finalAmount: amount - discount,
            coupon: { code: coupon.code, discountType: coupon.discountType, value: coupon.value }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// List all coupons (admin)
const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 }).lean();
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle coupon active state
const toggleCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await couponModel.findById(couponId);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ success: true, message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        await couponModel.findByIdAndDelete(couponId);
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createCoupon, validateCoupon, listCoupons, toggleCoupon, deleteCoupon };