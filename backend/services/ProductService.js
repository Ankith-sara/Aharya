import productModel from '../models/ProductModal.js';

// Pagination helper
export const paginate = async (Model, query, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Model.find(query).skip(skip).limit(limit).lean(),
        Model.countDocuments(query)
    ]);
    return { data, total, page: Number(page), pages: Math.ceil(total / limit), limit: Number(limit) };
};

// Image optimization helper
export const optimizeImage = (url, width = 600) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
};

export const searchProducts = async ({ q, category, minPrice, maxPrice, artisanRegion, sort, page, limit }) => {
    const query = {};
    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (artisanRegion) query.artisanRegion = artisanRegion;

    const sortMap = {
        'price-asc':  { price: 1 },
        'price-desc': { price: -1 },
        'newest':     { createdAt: -1 },
        'rating':     { averageRating: -1 },
        'bestseller': { sold: -1 }
    };

    const sortOption = sortMap[sort] || { createdAt: -1 };
    
    const p = Number(page) || 1;
    const l = Math.min(Number(limit) || 20, 100);
    const skip = (p - 1) * l;

    const [products, total] = await Promise.all([
        productModel.find(query).sort(sortOption).skip(skip).limit(l).lean(),
        productModel.countDocuments(query)
    ]);

    return { products, total, page: p, pages: Math.ceil(total / l) };
};

export const getAllProducts = async ({ page, limit } = {}) => {
    return paginate(productModel, {}, { page, limit });
};