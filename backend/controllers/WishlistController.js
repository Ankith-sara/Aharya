import userModel from "../models/UserModel.js"

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let wishlist = userData.wishlist || []

        // Check if item already exists in wishlist
        if (wishlist.includes(itemId)) {
            return res.status(400).json({ success: false, message: "Item already in wishlist" })
        }

        // Add item to wishlist
        wishlist.push(itemId)

        await userModel.findByIdAndUpdate(userId, { wishlist })
        res.json({ success: true, message: "Product added to wishlist", wishlist })
    } catch (error) {
        console.error("Error in addToWishlist:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let wishlist = userData.wishlist || []

        // Remove item from wishlist
        wishlist = wishlist.filter(id => id !== itemId)

        await userModel.findByIdAndUpdate(userId, { wishlist })
        res.json({ success: true, message: "Product removed from wishlist", wishlist })
    } catch (error) {
        console.error("Error in removeFromWishlist:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Toggle wishlist (add/remove)
const toggleWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let wishlist = userData.wishlist || []
        let message = ""
        let isAdded = false

        // Check if item exists in wishlist
        if (wishlist.includes(itemId)) {
            // Remove from wishlist
            wishlist = wishlist.filter(id => id !== itemId)
            message = "Product removed from wishlist"
            isAdded = false
        } else {
            // Add to wishlist
            wishlist.push(itemId)
            message = "Product added to wishlist"
            isAdded = true
        }

        await userModel.findByIdAndUpdate(userId, { wishlist })
        res.json({ success: true, message, wishlist, isAdded })
    } catch (error) {
        console.error("Error in toggleWishlist:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get user wishlist data
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let wishlist = userData.wishlist || []
        res.json({ success: true, wishlist })
    } catch (error) {
        console.error("Error in getUserWishlist:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get wishlist with product details
const getWishlistWithDetails = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Populate wishlist with product details
        const userWithWishlist = await userModel.findById(userId).populate({
            path: 'wishlist',
            model: 'product' // Assuming your product model is named 'product'
        })

        const wishlistWithDetails = userWithWishlist.wishlist || []
        res.json({ success: true, wishlist: wishlistWithDetails })
    } catch (error) {
        console.error("Error in getWishlistWithDetails:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addToWishlist, removeFromWishlist, toggleWishlist, getUserWishlist, getWishlistWithDetails }