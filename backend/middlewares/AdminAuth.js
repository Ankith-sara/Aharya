import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied, try again" })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Access denied, try again" })
        }
        next()
    } catch (error) {
        console.error("Error in adminAuth:", error);
        res.status(500).json({ success: false, message: error.message })
    }
}

export default adminAuth;