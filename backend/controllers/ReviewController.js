import reviewModel from '../models/ReviewModel.js';
import productModel from '../models/ProductModal.js';
import orderModel from '../models/OrderModel.js';

// Add a review
const addReview = async (req, res) => {
    try {
        const userId = req.body.userId;
        const { productId, rating, comment } = req.body;

        if (!productId || !rating) return res.status(400).json({ success: false, message: 'Product ID and rating are required' });

        const product = await productModel.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        // Check if already reviewed
        const existing = await reviewModel.findOne({ product: productId, user: userId });
        if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

        // Check if verified purchase
        const purchaseOrder = await orderModel.findOne({
            userId, 'items.productId': productId, payment: true, status: 'Delivered'
        });

        const review = new reviewModel({
            product: productId,
            user: userId,
            rating: Number(rating),
            comment,
            verified: !!purchaseOrder
        });

        await review.save();

        // Update product average rating
        const reviews = await reviewModel.find({ product: productId });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await productModel.findByIdAndUpdate(productId, {
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length
        });

        res.status(201).json({ success: true, message: 'Review added successfully', review });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        console.error('Add review error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const [reviews, total] = await Promise.all([
            reviewModel.find({ product: productId })
                .populate('user', 'name image')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            reviewModel.countDocuments({ product: productId })
        ]);

        const ratingDistribution = await reviewModel.aggregate([
            { $match: { product: require('mongoose').Types.ObjectId(productId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } }
        ]).catch(() => []);

        res.json({ success: true, reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)), ratingDistribution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a review (own review or admin)
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.body.userId;
        const userRole = req.user?.role;

        const review = await reviewModel.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }

        const productId = review.product;
        await review.deleteOne();

        // Update product rating
        const reviews = await reviewModel.find({ product: productId });
        const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
        await productModel.findByIdAndUpdate(productId, {
            averageRating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length
        });

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addReview, getProductReviews, deleteReview };
