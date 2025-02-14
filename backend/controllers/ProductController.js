import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/ProductModal.js';

// Function for adding a product
const addProduct = async (req, res) => {
    try {
        // Destructure the request body
        const { name, description, price, category, subCategory, bestseller, sizes } = req.body;
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const image5 = req.files?.image5?.[0];
        const image6 = req.files?.image6?.[0];

        // Handle images upload to cloudinary
        const images = [image1, image2, image3, image4, image5, image6].filter((item) => item !== undefined);
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Parse the sizes and bestseller values
        const parsedSizes = JSON.parse(sizes);
        const isBestseller = bestseller === "true"; 

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
            date: Date.now(),
        };

        // Save the new product to the database
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added Successfully" });
    } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for editing a product
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, subCategory, bestseller, sizes } = req.body;
        
        // Get the existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Handle image uploads
        const imageFiles = [
            req.files?.image1?.[0],
            req.files?.image2?.[0],
            req.files?.image3?.[0],
            req.files?.image4?.[0],
            req.files?.image5?.[0],
            req.files?.image6?.[0]
        ].filter(item => item !== undefined);

        // Upload new images to cloudinary if provided
        let newImageUrls = [];
        if (imageFiles.length > 0) {
            newImageUrls = await Promise.all(
                imageFiles.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
        }

        // Combine existing and new images
        const updatedImages = newImageUrls.length > 0 ? newImageUrls : existingProduct.images;

        // Parse the sizes and bestseller values
        const parsedSizes = JSON.parse(sizes);
        const isBestseller = bestseller === "true" || bestseller === true;

        // Update the product data
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
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error in editing product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for listing products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        if (products.length === 0) {
            return res.json({ success: true, message: "No products found" });
        }
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function for removing a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error in removeProduct:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Single product functionality
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
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { listProducts, addProduct, editProduct, removeProduct, singleProduct };