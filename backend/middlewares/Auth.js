import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: 'Not Authorized, login again' });
    }

    const token = authHeader.split(" ")[1]; // Get token after 'Bearer '
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message })
    }
}

export default authUser;