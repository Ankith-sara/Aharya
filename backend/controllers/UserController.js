import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/UserModel.js';
import sendOtpMail from '../middlewares/sendOtpMail.js';
import sendWelcomeMail from '../middlewares/sendWelcomeMail.js';
import sendNewsletterMail from '../middlewares/sendNewsletterMail.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createToken = (id, role = 'user') =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ============ USER REGISTRATION (OTP-BASED) ============
const sendOtp = async (req, res) => {
    const { email, name, password } = req.body;

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
        let user = await userModel.findOne({ email });

        // Check if user exists and is already verified
        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please login instead.'
            });
        }

        // Check if OTP was recently sent
        if (user && user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({
                success: false,
                message: `OTP already sent. Please wait ${timeLeft} seconds before requesting again.`
            });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            // Update existing unverified user
            user.name = name;
            user.password = hashedPassword;
            user.role = 'user'; 
            user.isAdmin = false; 
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.isVerified = false;
        } else {
            // Create new user
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
        console.error('Send OTP error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ USER LOGIN ============
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user is trying to login as admin through user login
        if (user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Please use admin login portal for admin accounts" 
            });
        }

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
            userId: user._id.toString(),
            name: user.name,
            role: user.role,
            message: `Welcome back, ${user.name}!`
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ VERIFY OTP (USER REGISTRATION) ============
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        // IMPORTANT: Select OTP and otpExpiry fields explicitly since they're set to select: false
        const user = await userModel.findOne({ email }).select('+otp +otpExpiry');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ 
                success: false, 
                message: 'Account already verified. Please login instead.' 
            });
        }

        // Ensure this is not an admin account trying to verify through user flow
        if (user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Please use admin verification portal' 
            });
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ 
                success: false, 
                message: 'OTP not requested. Please request OTP first.' 
            });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(401).json({ 
                success: false, 
                message: 'OTP expired. Please request a new one.' 
            });
        }

        // Verify user and ENSURE role is 'user'
        user.isVerified = true;
        user.role = 'user';
        user.isAdmin = false;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'user');

        res.json({
            success: true,
            token,
            userId: user._id.toString(),
            name: user.name,
            role: 'user',
            message: `Welcome ${user.name}! Registration completed successfully.`
        });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ REGISTER USER (WITHOUT OTP) ============
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
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

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user - ALWAYS with 'user' role
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'user', 
            isAdmin: false,
            isVerified: true
        });

        const user = await newUser.save();

        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'user');

        res.status(201).json({
            success: true,
            token,
            userId: user._id.toString(),
            name: user.name,
            role: 'user',
            message: `Welcome ${user.name}! Registration successful.`
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADMIN LOGIN ============
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user with admin role only
        const user = await userModel.findOne({ email, role: 'admin' });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Admin account not found' 
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please complete admin registration by verifying your email first."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = createToken(user._id, 'admin');
        
        res.status(200).json({ 
            success: true, 
            token,
            userId: user._id.toString(),
            name: user.name,
            role: 'admin',
            message: 'Admin login successful' 
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADMIN REGISTRATION (OTP-BASED) ============
const sendAdminOtp = async (req, res) => {
    const { email, name, password, adminSecret } = req.body;

    // SECURITY: Require admin secret key for admin registration
    if (!adminSecret || adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
        return res.status(403).json({ 
            success: false, 
            message: 'Unauthorized admin registration attempt' 
        });
    }

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
        let user = await userModel.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists.'
            });
        }

        if (user && user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({
                success: false,
                message: `OTP already sent. Please wait ${timeLeft} seconds before requesting again.`
            });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            // Update existing user to admin
            user.name = name;
            user.password = hashedPassword;
            user.role = 'admin';
            user.isAdmin = true;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.isVerified = false;
        } else {
            // Create new admin user
            user = new userModel({
                email,
                name,
                password: hashedPassword,
                role: 'admin',
                isAdmin: true,
                isVerified: false,
                otp,
                otpExpiry
            });
        }

        await user.save();
        await sendOtpMail(email, otp);

        res.json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete admin registration.'
        });
    } catch (err) {
        console.error('Send admin OTP error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ VERIFY ADMIN OTP ============
const verifyAdminOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        // IMPORTANT: Select OTP and otpExpiry fields explicitly since they're set to select: false
        const user = await userModel.findOne({ email }).select('+otp +otpExpiry');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Admin not found. Please register first.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'This account is not an admin account.' });
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

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'admin');

        res.json({
            success: true,
            token,
            userId: user._id.toString(),
            name: user.name,
            role: 'admin',
            message: `Welcome ${user.name}! Admin registration completed successfully.`
        });
    } catch (err) {
        console.error('Verify admin OTP error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ OTHER FUNCTIONS ============
const getUserProfile = async (req, res) => {
    try {
        // userId is set by authUser middleware from token
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No user ID found"
            });
        }

        const user = await userModel.findById(userId).select('-password -otp -otpExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                addresses: user.addresses,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

        const user = await userModel.findById(id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateUserProfile = async (req, res) => {
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
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addOrUpdateAddress = async (req, res) => {
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
        console.error('Add/Update address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { index } = req.body;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.addresses.splice(index, 1);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
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

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        await sendNewsletterMail(email);

        res.json({
            success: true,
            message: "Email sent! Check your inbox for the WhatsApp join link."
        });

    } catch (error) {
        console.error("Newsletter error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export {  sendOtp,  verifyOtp,  registerUser,  loginUser,  sendAdminOtp,  verifyAdminOtp,  adminLogin,  getUserDetails,  getUserProfile,  updateUserProfile,  addOrUpdateAddress,  deleteAddress,  changePassword,  subscribeNewsletter };