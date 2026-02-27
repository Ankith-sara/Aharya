import orderModel from '../models/OrderModel.js';
import productModel from '../models/ProductModal.js';

export const getSellerAnalytics = async (adminId) => {
    const adminProducts = await productModel.find({ adminId }).select('_id name sold price');
    const adminProductIds = adminProducts.map(p => p._id);

    const [revenueResult, ordersByStatus, monthlySales, topProducts] = await Promise.all([
        orderModel.aggregate([
            { $match: { 'items.productId': { $in: adminProductIds }, payment: true } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]),
        orderModel.aggregate([
            { $match: { 'items.productId': { $in: adminProductIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        orderModel.aggregate([
            { $match: { 'items.productId': { $in: adminProductIds }, payment: true } },
            {
                $group: {
                    _id: {
                        year: { $year: { $toDate: '$date' } },
                        month: { $month: { $toDate: '$date' } }
                    },
                    revenue: { $sum: '$amount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
        ]),
        productModel.find({ adminId }).sort({ sold: -1 }).limit(5).select('name sold price images')
    ]);

    return {
        totalRevenue: revenueResult[0]?.total || 0,
        totalOrders: revenueResult[0]?.count || 0,
        ordersByStatus,
        monthlySales,
        topProducts
    };
};
