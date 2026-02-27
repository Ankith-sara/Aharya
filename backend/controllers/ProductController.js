import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/ProductModal.js';
import { searchProducts, optimizeImage } from '../services/ProductService.js';
import { getSellerAnalytics } from '../services/OrderService.js';

// Add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, sizes, company, artisanRegion } = req.body;
        const adminId = req.user.id;

        const images = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0],
            req.files?.image5?.[0],
            req.files?.image6?.[0]
        ].filter(Boolean);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const parsedSizes = sizes ? JSON.parse(sizes) : [];
        const isBestseller = bestseller === "true" || bestseller === true;

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: isBestseller,
            sizes: parsedSizes,
            images: imagesUrl,
            company: company || "Aharyas",
            artisanRegion: artisanRegion || null,
            adminId,
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added Successfully", product });
    } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { name, description, price, category, subCategory, bestseller, sizes, company, artisanRegion } = req.body;

        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (existingProduct.adminId.toString() !== adminId) {
            return res.status(403).json({ success: false, message: "Forbidden: You can only edit your own products." });
        }

        const imageFiles = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0],
            req.files?.image5?.[0],
            req.files?.image6?.[0]
        ].filter(Boolean);

        let newImageUrls = [];
        if (imageFiles.length > 0) {
            newImageUrls = await Promise.all(
                imageFiles.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        const updatedImages = newImageUrls.length > 0 ? newImageUrls : existingProduct.images;
        const parsedSizes = sizes ? JSON.parse(sizes) : [];
        const isBestseller = bestseller === "true" || bestseller === true;

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { name, description, price: Number(price), category, subCategory, bestseller: isBestseller, sizes: parsedSizes, images: updatedImages, company: company || existingProduct.company, artisanRegion: artisanRegion || existingProduct.artisanRegion },
            { new: true }
        );

        res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error in editing product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List products per admin
const listProducts = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            productModel.find({ adminId }).skip(Number(skip)).limit(Number(limit)).lean(),
            productModel.countDocuments({ adminId })
        ]);
        res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public: list all products with search, filter, pagination
const listAllProductsPublic = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, artisanRegion, sort, page = 1, limit = 20 } = req.query;
        
        if (q || category || minPrice || maxPrice || artisanRegion || sort) {
            const result = await searchProducts({ q, category, minPrice, maxPrice, artisanRegion, sort, page, limit });
            return res.json({ success: true, ...result });
        }
        
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            productModel.find({}).skip(skip).limit(Number(limit)).lean(),
            productModel.countDocuments({})
        ]);
        res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get unique companies
const getCompanies = async (req, res) => {
    try {
        const companies = await productModel.distinct("company");
        const sorted = companies.sort((a, b) => {
            if (a === "Independent") return 1;
            if (b === "Independent") return -1;
            return a.localeCompare(b);
        });
        res.json({ success: true, companies: sorted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get products by company
const getProductsByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            productModel.find({ company }).sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
            productModel.countDocuments({ company })
        ]);
        res.json({ success: true, products, company, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const deletedProduct = await productModel.findOneAndDelete({ _id: id, adminId });
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found or not owned by you" });
        }
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }
        const product = await productModel.findById(productId).lean();
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Seller analytics dashboard
const sellerAnalytics = async (req, res) => {
    try {
        const adminId = req.user.id;
        const analytics = await getSellerAnalytics(adminId);
        res.json({ success: true, ...analytics });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get unique artisan regions
const getRegions = async (req, res) => {
    try {
        const regions = await productModel.distinct("artisanRegion", { artisanRegion: { $ne: null } });
        res.json({ success: true, regions: regions.sort() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, editProduct, listAllProductsPublic, removeProduct, singleProduct, getCompanies, getProductsByCompany, sellerAnalytics, getRegions };
