import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/ProductModal.js';

// Function for adding a product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestseller, sizes, company } = req.body;
        const adminId = req.user.id;

        // Handle images
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

        // Prepare the product data
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

// Function for editing a product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        const { name, description, price, category, subCategory, bestseller, sizes, company } = req.body;

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
            {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                bestseller: isBestseller,
                sizes: parsedSizes,
                images: updatedImages,
                company: company || existingProduct.company || "Aharyas"
            },
            { new: true }
        );

        res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error in editing product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for listing products (per admin)
const listProducts = async (req, res) => {
    try {
        const adminId = req.user.id;
        const products = await productModel.find({ adminId });
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public list all products
const listAllProductsPublic = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all unique companies
const getCompanies = async (req, res) => {
    try {
        const companies = await productModel.distinct("company");
        const sortedCompanies = companies.sort((a, b) => {
            if (a === "Independent") return 1;
            if (b === "Independent") return -1;
            return a.localeCompare(b);
        });
        res.json({ success: true, companies: sortedCompanies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get products by company
const getProductsByCompany = async (req, res) => {
    try {
        const { company } = req.params;
        const products = await productModel.find({ company }).sort({ date: -1 });
        res.json({ success: true, products, company });
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
        console.error("Error in removeProduct:", error);
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
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error("Error in Loading Product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Seller analytics dashboard
const sellerAnalytics = async (req, res) => {
    try {
        const { getSellerAnalytics } = await import('../services/OrderService.js');
        const adminId = req.user.id;
        const result = await getSellerAnalytics(adminId);
        res.json({ success: true, analytics: result.analytics });
    } catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, editProduct, listAllProductsPublic, removeProduct, singleProduct, getCompanies, getProductsByCompany, sellerAnalytics };