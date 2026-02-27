import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    company: { type: String, required: true, default: 'Independent', trim: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    artisanRegion: { type: String, trim: true },
    sold: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    date: { type: Number, required: true },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    }
}, { timestamps: true });

// Indexes for fast queries
productSchema.index({ name: 'text', description: 'text' }); // full-text search
productSchema.index({ category: 1, price: 1 });
productSchema.index({ artisanRegion: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ company: 1 });
productSchema.index({ adminId: 1 });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
