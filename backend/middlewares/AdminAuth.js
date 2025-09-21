import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';

const adminAuth = async (req, res, next) => {
  try {
    // Look for Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. Malformed token." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user in DB
    const user = await userModel.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Forbidden. Admin access only." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default adminAuth;
