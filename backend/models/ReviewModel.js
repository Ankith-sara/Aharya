import mongoose from 'mongoose';
const { Schema, Types: { ObjectId } } = mongoose;

const ReviewSchema = new Schema({
    product: { type: ObjectId, ref: 'product', required: true },
    user:    { type: ObjectId, ref: 'user', required: true },
    rating:  { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 1000 },
    images:  [{ type: String }],
    verified: { type: Boolean, default: false } // verified purchase
}, { timestamps: true });

ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per product per user

const reviewModel = mongoose.models.review || mongoose.model('review', ReviewSchema);
export default reviewModel;
