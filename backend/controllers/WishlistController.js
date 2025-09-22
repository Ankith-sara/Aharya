import userModel from "../models/UserModel.js";

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            return res.json({ success: false, message: "Product already in wishlist" });
        }

        // Add product to wishlist
        user.wishlist.push(productId);
        await user.save();

        res.json({ success: true, message: "Product added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.json({ success: true, message: "Product removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's wishlist
const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const wishlist = user.wishlist || [];
        res.json({ success: true, wishlist });
    } catch (error) {
        console.error("Error getting wishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.wishlist = [];
        await user.save();

        res.json({ success: true, message: "Wishlist cleared" });
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Sync wishlist (merge local wishlist with backend)
const syncWishlist = async (req, res) => {
    try {
        const { wishlist: localWishlist } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Merge local wishlist with backend wishlist (remove duplicates)
        const mergedWishlist = [...new Set([...user.wishlist, ...(localWishlist || [])])];
        user.wishlist = mergedWishlist;
        await user.save();

        res.json({ success: true, message: "Wishlist synced", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error syncing wishlist:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToWishlist, removeFromWishlist, getUserWishlist, clearWishlist, syncWishlist };