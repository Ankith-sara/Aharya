import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String },
        image: { type: String }
    }],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { 
        type: String, 
        required: true, 
        default: 'Order placed',
        enum: ['Order placed', 'Packing', 'Shipping', 'Out for delivery', 'Delivered', 'Cancelled']
    },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    couponCode: { type: String },
    discount: { type: Number, default: 0 },
    date: { type: Number, required: true }
}, { timestamps: true });

// Indexes for fast queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.productId': 1 });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
