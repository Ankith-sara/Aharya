import userModel from "../models/UserModel.js"

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity = 1 } = req.body

        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "userId, itemId, and size are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Use toObject to get a plain JavaScript object
        let cartData = userData.cartData ? JSON.parse(JSON.stringify(userData.cartData)) : {}

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity
        } else {
            cartData[itemId] = { [size]: quantity }
        }

        // Use markModified to ensure Mongoose tracks the change
        userData.cartData = cartData
        userData.markModified('cartData')
        await userData.save()

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

        if (!userId || !itemId || !size || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "userId, itemId, size and quantity are required" 
            })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Convert to plain object
        let cartData = userData.cartData ? JSON.parse(JSON.stringify(userData.cartData)) : {}

        // If quantity is 0, remove the item
        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][size]
                
                // If no sizes left for this item, remove the item entirely
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]
                }
            }
        } else {
            // Update the quantity
            if (!cartData[itemId]) {
                cartData[itemId] = {}
            }
            cartData[itemId][size] = quantity
        }

        // Use markModified to ensure Mongoose tracks the change
        userData.cartData = cartData
        userData.markModified('cartData')
        await userData.save()

        res.json({ success: true, message: "Cart updated successfully", cartData })
    } catch (error) {
        console.error("Error in updateCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Remove product from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        if (!userId || !itemId || !size) {
            return res.status(400).json({ 
                success: false, 
                message: "userId, itemId, and size are required" 
            })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Convert to plain object
        let cartData = userData.cartData ? JSON.parse(JSON.stringify(userData.cartData)) : {}

        if (cartData[itemId]) {
            delete cartData[itemId][size]
            
            // If no sizes left for this item, remove the item entirely
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        }

        // Use markModified to ensure Mongoose tracks the change
        userData.cartData = cartData
        userData.markModified('cartData')
        await userData.save()

        res.json({ success: true, message: "Product removed from cart", cartData })
    } catch (error) {
        console.error("Error in removeFromCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        userData.cartData = {}
        userData.markModified('cartData')
        await userData.save()

        res.json({ success: true, message: "Cart cleared successfully", cartData: {} })
    } catch (error) {
        console.error("Error in clearCart:", error)
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

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart }