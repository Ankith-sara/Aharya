import orderModel from '../models/OrderModel.js';
import productModel from '../models/ProductModal.js';

export const getSellerAnalytics = async (adminId) => {
    // Count all products for this admin (for display only)
    const totalProducts = await productModel.countDocuments({ adminId });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartMs = todayStart.getTime();

    const [
        revenueResult,
        pendingResult,
        completedResult,
        todayResult,
        monthlySales,
        topProducts,
        categoryBreakdown
    ] = await Promise.all([
        // Total revenue + order count — ALL orders (COD counts even before payment)
        orderModel.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]),

        // Pending = unpaid
        orderModel.countDocuments({ payment: false }),

        // Completed = paid
        orderModel.countDocuments({ payment: true }),

        // Today's orders (all, not just paid)
        orderModel.aggregate([
            { $match: { date: { $gte: todayStartMs } } },
            { $group: { _id: null, revenue: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]),

        // Monthly sales — last 12 months, all orders
        orderModel.aggregate([
            {
                $group: {
                    _id: {
                        year:  { $year:  { $toDate: '$date' } },
                        month: { $month: { $toDate: '$date' } }
                    },
                    revenue: { $sum: '$amount' },
                    orders:  { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]),

        // Top 5 products by sold count
        productModel.find({ adminId }).sort({ sold: -1 }).limit(5)
            .select('name sold price images category'),

        // Category breakdown for doughnut chart
        productModel.aggregate([
            { $match: { adminId } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
    ]);

    const totalRevenue  = revenueResult[0]?.total || 0;
    const totalOrders   = revenueResult[0]?.count || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        analytics: {
            totalRevenue,
            totalOrders,
            pendingOrders:   pendingResult,
            completedOrders: completedResult,
            avgOrderValue:   Math.round(avgOrderValue * 100) / 100,
            todayRevenue:    todayResult[0]?.revenue || 0,
            todayOrders:     todayResult[0]?.count   || 0,
            totalProducts,
            monthlySales,
            topProducts,
            categoryBreakdown
        }
    };
};