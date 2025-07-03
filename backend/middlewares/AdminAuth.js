import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    // Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user role from DB
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Forbidden. Admin access only." });
    }

    // Attach user info to request object if needed
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default adminAuth;