import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code:          { type: String, unique: true, uppercase: true, trim: true, required: true },
    discountType:  { type: String, enum: ['percent', 'flat'], required: true },
    value:         { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    expiresAt:     { type: Date, required: true },
    usageLimit:    { type: Number, default: null },
    usedCount:     { type: Number, default: 0 },
    isActive:      { type: Boolean, default: true },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });

CouponSchema.index({ code: 1 });
CouponSchema.index({ expiresAt: 1 });

const couponModel = mongoose.models.coupon || mongoose.model('coupon', CouponSchema);
export default couponModel;
