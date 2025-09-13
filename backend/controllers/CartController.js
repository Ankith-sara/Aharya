import userModel from "../models/UserModel.js"

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "userId, itemId, and size are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {}

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
        } else {
            cartData[itemId] = { [size]: 1 }
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Product added to cart", cartData })
    } catch (error) {
        console.error("Error in addToCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Update product quantity in cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "userId, itemId, size and quantity are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {}

        if (!cartData[itemId]) cartData[itemId] = {}
        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Product updated in cart", cartData })
    } catch (error) {
        console.error("Error in updateCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = userData.cartData || {}
        res.json({ success: true, cartData })
    } catch (error) {
        console.error("Error in getUserCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart }