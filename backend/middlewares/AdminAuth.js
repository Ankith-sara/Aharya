import jwt from 'jsonwebtoken';
import userModel from '../models/UserModel.js';

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. Malformed token." 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: Check if token role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden. Admin access only." 
      });
    }

    // Verify user exists and is admin in database
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found." 
      });
    }

    if (user.role !== 'admin' || !user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden. Admin access only." 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin account not verified." 
      });
    }

    // Attach user to request
    req.user = user;
    req.body.userId = user._id.toString();
    
    next();
  } catch (error) {
    console.error("Error in adminAuth middleware:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed." 
    });
  }
};

export default adminAuth;