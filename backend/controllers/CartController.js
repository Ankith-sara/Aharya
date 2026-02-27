import userModel from "../models/UserModel.js"

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size = 'N/A', quantity = 1 } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "userId and itemId are required" })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = {}
        if (userData.cartData && userData.cartData.size > 0) {
            userData.cartData.forEach((sizes, itemId) => {
                cartData[itemId] = {}
                sizes.forEach((qty, size) => {
                    cartData[itemId][size] = qty
                })
            })
        }

        // Add/update item
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + quantity
        } else {
            cartData[itemId] = { [size]: quantity }
        }

        const cartMap = new Map()
        Object.keys(cartData).forEach(itemId => {
            const sizeMap = new Map()
            Object.keys(cartData[itemId]).forEach(size => {
                sizeMap.set(size, cartData[itemId][size])
            })
            cartMap.set(itemId, sizeMap)
        })

        userData.cartData = cartMap
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
        const { userId, itemId, size = 'N/A', quantity } = req.body

        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "userId, itemId, and quantity are required" 
            })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = {}
        if (userData.cartData && userData.cartData.size > 0) {
            userData.cartData.forEach((sizes, itemId) => {
                cartData[itemId] = {}
                sizes.forEach((qty, size) => {
                    cartData[itemId][size] = qty
                })
            })
        }

        // If quantity is 0, remove the item
        if (quantity === 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][size]
                
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId]
                }
            }
        } else {
            if (!cartData[itemId]) {
                cartData[itemId] = {}
            }
            cartData[itemId][size] = quantity
        }

        const cartMap = new Map()
        Object.keys(cartData).forEach(itemId => {
            const sizeMap = new Map()
            Object.keys(cartData[itemId]).forEach(size => {
                sizeMap.set(size, cartData[itemId][size])
            })
            cartMap.set(itemId, sizeMap)
        })

        userData.cartData = cartMap
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
        const { userId, itemId, size = 'N/A' } = req.body

        if (!userId || !itemId) {
            return res.status(400).json({ 
                success: false, 
                message: "userId and itemId are required" 
            })
        }

        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        let cartData = {}
        if (userData.cartData && userData.cartData.size > 0) {
            userData.cartData.forEach((sizes, itemId) => {
                cartData[itemId] = {}
                sizes.forEach((qty, size) => {
                    cartData[itemId][size] = qty
                })
            })
        }

        if (cartData[itemId]) {
            delete cartData[itemId][size]
            
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        }

        const cartMap = new Map()
        Object.keys(cartData).forEach(itemId => {
            const sizeMap = new Map()
            Object.keys(cartData[itemId]).forEach(size => {
                sizeMap.set(size, cartData[itemId][size])
            })
            cartMap.set(itemId, sizeMap)
        })

        userData.cartData = cartMap
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

        userData.cartData = new Map()
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

        let cartData = {}
        if (userData.cartData && userData.cartData.size > 0) {
            userData.cartData.forEach((sizes, itemId) => {
                cartData[itemId] = {}
                sizes.forEach((qty, size) => {
                    cartData[itemId][size] = qty
                })
            })
        }

        res.json({ success: true, cartData })
    } catch (error) {
        console.error("Error in getUserCart:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart }