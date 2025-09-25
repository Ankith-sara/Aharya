import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/UserModel.js';
import sendOtpMail from '../middlewares/sendOtpMail.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ---------------- UTILS ----------------
const createToken = (id, role = 'user') =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ---------------- UNIFIED REGISTRATION FLOW ----------------

// Step 1: Send OTP for Registration
export const sendOtp = async (req, res) => {
    const { email, name, password } = req.body;
    
    // Validate all fields
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
    
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        // Check if user already exists and is verified
        let user = await userModel.findOne({ email });
        
        if (user && user.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists. Please login instead.' 
            });
        }

        // Check if OTP was recently sent (prevent spam)
        if (user && user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({ 
                success: false, 
                message: `OTP already sent. Please wait ${timeLeft} seconds before requesting again.` 
            });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            // Update existing unverified user
            user.name = name;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.isVerified = false;
        } else {
            // Create new unverified user
            user = new userModel({ 
                email, 
                name, 
                password: hashedPassword,
                role: 'user',
                isAdmin: false,
                isVerified: false,
                otp,
                otpExpiry
            });
        }

        await user.save();
        await sendOtpMail(email, otp);

        res.json({ 
            success: true, 
            message: 'OTP sent to your email. Please verify to complete registration.' 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Step 2: Verify OTP and Complete Registration
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP not requested. Please request OTP first.' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(401).json({ success: false, message: 'OTP expired. Please request a new one.' });
        }

        // Verify user and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        
        // Send welcome email
        await sendWelcomeMail(email, user.name);

        // Generate token
        const token = createToken(user._id, user.role);

        res.json({ 
            success: true, 
            token, 
            name: user.name,
            message: `Welcome ${user.name}! Registration completed successfully.` 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ---------------- DIRECT REGISTRATION (Without OTP) ----------------
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if user exists (verified or unverified)
        const existingUser = await userModel.findOne({ email });
        
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists. Please login instead." 
            });
        }

        if (existingUser && !existingUser.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: "Registration in progress. Please verify your email or request a new OTP." 
            });
        }

        // Validate input
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Create new verified user (direct registration)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'user',
            isAdmin: false,
            isVerified: true // Direct registration = auto-verified
        });
        
        const user = await newUser.save();

        // Send welcome email
        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, user.role);

        res.status(201).json({ 
            success: true, 
            token, 
            name: user.name,
            message: `Welcome ${user.name}! Registration successful.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user completed registration
        if (!user.isVerified) {
            return res.status(401).json({ 
                success: false, 
                message: "Please complete your registration by verifying your email first." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id, user.role);
        res.status(200).json({ 
            success: true, 
            token, 
            name: user.name,
            message: `Welcome back, ${user.name}!`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------- ADMIN FUNCTIONS ----------------
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email, role: 'admin', isVerified: true });
        if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = createToken(user._id, 'admin');
        res.status(200).json({ success: true, token, message: 'Admin login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: 'Admin already exists' });

        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
        if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new userModel({ 
            name, 
            email, 
            password: hashedPassword, 
            role: 'admin', 
            isAdmin: true,
            isVerified: true 
        });
        const user = await newAdmin.save();

        const token = createToken(user._id, 'admin');

        res.status(201).json({ success: true, token, message: `Welcome Admin ${user.name}, registration successful.` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------- OTHER FUNCTIONS (unchanged) ----------------
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

        const user = await userModel.findById(id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'user_profiles'
            });
            imageUrl = result.secure_url;
        }

        const updatedFields = { name, email, phone };
        if (imageUrl) updatedFields.image = imageUrl;

        const user = await userModel.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addOrUpdateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { addressObj, index } = req.body;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (typeof index === "number" && index >= 0) {
            user.addresses[index] = addressObj;
        } else {
            user.addresses.push(addressObj);
        }
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { index } = req.body;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.addresses.splice(index, 1);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};