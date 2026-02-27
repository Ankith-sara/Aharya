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
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });

const createRefreshToken = (id, role = 'user') =>
    jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });

// ============ USER REGISTRATION (OTP-BASED) ============
const sendOtp = async (req, res) => {
    const { email, name, password } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    try {
        let user = await userModel.findOne({ email });
        if (user && user.isVerified) return res.status(400).json({ success: false, message: 'User already exists. Please login instead.' });
        if (user && user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({ success: false, message: `OTP already sent. Please wait ${timeLeft} seconds.` });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.name = name; user.password = hashedPassword; user.role = 'user';
            user.isAdmin = false; user.otp = otp; user.otpExpiry = otpExpiry; user.isVerified = false;
        } else {
            user = new userModel({ email, name, password: hashedPassword, role: 'user', isAdmin: false, isVerified: false, otp, otpExpiry });
        }

        await user.save();
        await sendOtpMail(email, otp);
        res.json({ success: true, message: 'OTP sent to your email.' });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ USER LOGIN with lockout ============
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.role === 'admin') return res.status(403).json({ success: false, message: "Please use admin login portal for admin accounts" });
        if (!user.isVerified) return res.status(401).json({ success: false, message: "Please verify your email first." });

        // Check account lock
        if (user.isLocked) {
            const lockMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({ success: false, message: `Account locked. Try again in ${lockMinutes} minutes.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await user.incrementLoginAttempts();
            const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));
            return res.status(401).json({ 
                success: false, 
                message: attemptsLeft > 0 ? `Invalid credentials. ${attemptsLeft} attempts remaining.` : 'Account locked for 30 minutes due to too many failed attempts.'
            });
        }

        await user.resetLoginAttempts();

        const token = createToken(user._id, user.role);
        const refreshToken = createRefreshToken(user._id, user.role);

        // Store hashed refresh token
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save();

        res.status(200).json({
            success: true, token, refreshToken,
            userId: user._id.toString(), name: user.name, role: user.role,
            message: `Welcome back, ${user.name}!`
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ REFRESH TOKEN ============
const refreshToken = async (req, res) => {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('+refreshToken');
        if (!user || !user.refreshToken) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

        const isValid = await bcrypt.compare(token, user.refreshToken);
        if (!isValid) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

        const newAccessToken = createToken(user._id, user.role);
        const newRefreshToken = createRefreshToken(user._id, user.role);
        user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
        await user.save();

        res.json({ success: true, token: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};

// ============ VERIFY OTP ============
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    try {
        const user = await userModel.findOne({ email }).select('+otp +otpExpiry');
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified.' });
        if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Please use admin verification portal' });
        if (!user.otp || !user.otpExpiry) return res.status(400).json({ success: false, message: 'OTP not requested.' });
        if (user.otp !== otp) return res.status(401).json({ success: false, message: 'Invalid OTP' });
        if (user.otpExpiry < new Date()) return res.status(401).json({ success: false, message: 'OTP expired.' });

        user.isVerified = true; user.role = 'user'; user.isAdmin = false;
        user.otp = undefined; user.otpExpiry = undefined;
        await user.save();
        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'user');
        res.json({ success: true, token, userId: user._id.toString(), name: user.name, role: 'user', message: `Welcome ${user.name}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ REGISTER WITHOUT OTP ============
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser && existingUser.isVerified) return res.status(400).json({ success: false, message: "User already exists." });
        if (existingUser && !existingUser.isVerified) return res.status(400).json({ success: false, message: "Registration in progress. Please verify your email." });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Invalid email format" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword, role: 'user', isAdmin: false, isVerified: true });
        const user = await newUser.save();
        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'user');
        res.status(201).json({ success: true, token, userId: user._id.toString(), name: user.name, role: 'user', message: `Welcome ${user.name}!` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADMIN LOGIN ============
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email, role: 'admin' });
        if (!user) return res.status(404).json({ success: false, message: 'Admin account not found' });
        if (!user.isVerified) return res.status(401).json({ success: false, message: "Please verify your email first." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = createToken(user._id, 'admin');
        res.status(200).json({ success: true, token, userId: user._id.toString(), name: user.name, role: 'admin', message: 'Admin login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADMIN REGISTRATION ============
const sendAdminOtp = async (req, res) => {
    const { email, name, password, adminSecret } = req.body;
    if (!adminSecret || adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
        return res.status(403).json({ success: false, message: 'Unauthorized admin registration attempt' });
    }
    if (!email || !name || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    try {
        let user = await userModel.findOne({ email });
        if (user && user.isVerified) return res.status(400).json({ success: false, message: 'Account already exists.' });
        if (user && user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({ success: false, message: `OTP already sent. Please wait ${timeLeft} seconds.` });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.name = name; user.password = hashedPassword; user.role = 'admin';
            user.isAdmin = true; user.otp = otp; user.otpExpiry = otpExpiry; user.isVerified = false;
        } else {
            user = new userModel({ email, name, password: hashedPassword, role: 'admin', isAdmin: true, isVerified: false, otp, otpExpiry });
        }

        await user.save();
        await sendOtpMail(email, otp);
        res.json({ success: true, message: 'OTP sent.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ VERIFY ADMIN OTP ============
const verifyAdminOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    try {
        const user = await userModel.findOne({ email }).select('+otp +otpExpiry');
        if (!user) return res.status(404).json({ success: false, message: 'Admin not found.' });
        if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not an admin account.' });
        if (!user.otp || !user.otpExpiry) return res.status(400).json({ success: false, message: 'OTP not requested.' });
        if (user.otp !== otp) return res.status(401).json({ success: false, message: 'Invalid OTP' });
        if (user.otpExpiry < new Date()) return res.status(401).json({ success: false, message: 'OTP expired.' });

        user.isVerified = true; user.otp = undefined; user.otpExpiry = undefined;
        await user.save();
        await sendWelcomeMail(email, user.name);

        const token = createToken(user._id, 'admin');
        res.json({ success: true, token, userId: user._id.toString(), name: user.name, role: 'admin', message: `Welcome ${user.name}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ FORGOT PASSWORD ============
const sendForgotPasswordOtp = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Email and new password are required' });
    if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
    if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'No account found with this email' });
        if (!user.isVerified) return res.status(400).json({ success: false, message: 'Please complete your registration first.' });
        if (user.otpExpiry && user.otpExpiry > new Date()) {
            const timeLeft = Math.ceil((user.otpExpiry - new Date()) / 1000);
            return res.status(400).json({ success: false, message: `OTP already sent. Please wait ${timeLeft} seconds.` });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.tempPassword = hashedPassword; user.otp = otp; user.otpExpiry = otpExpiry;
        await user.save();
        await sendOtpMail(email, otp);
        res.json({ success: true, message: 'Password reset OTP sent.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ RESET PASSWORD ============
const resetPassword = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    try {
        const user = await userModel.findOne({ email }).select('+otp +otpExpiry +tempPassword');
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (!user.isVerified) return res.status(400).json({ success: false, message: 'Please complete your registration first.' });
        if (!user.otp || !user.otpExpiry) return res.status(400).json({ success: false, message: 'OTP not requested.' });
        if (user.otp !== otp) return res.status(401).json({ success: false, message: 'Invalid OTP' });
        if (user.otpExpiry < new Date()) return res.status(401).json({ success: false, message: 'OTP expired.' });
        if (!user.tempPassword) return res.status(400).json({ success: false, message: 'No password reset in progress.' });

        user.password = user.tempPassword; user.tempPassword = undefined;
        user.otp = undefined; user.otpExpiry = undefined;
        await user.save();
        res.json({ success: true, message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ============ PROFILE ============
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        const user = await userModel.findById(userId).select('-password -otp -otpExpiry -tempPassword -refreshToken');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image', folder: 'user_profiles' });
            imageUrl = result.secure_url;
        }
        const updatedFields = { name, email, phone };
        if (imageUrl) updatedFields.image = imageUrl;
        const user = await userModel.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true }).select('-password -refreshToken');
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addOrUpdateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { addressObj, index } = req.body;
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (typeof index === "number" && index >= 0) user.addresses[index] = addressObj;
        else user.addresses.push(addressObj);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
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
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!password || password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });
        await sendNewsletterMail(email);
        res.json({ success: true, message: "Email sent! Check your inbox for the WhatsApp join link." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    sendOtp, verifyOtp, registerUser, loginUser, refreshToken,
    sendAdminOtp, verifyAdminOtp, adminLogin,
    sendForgotPasswordOtp, resetPassword,
    getUserDetails, getUserProfile, updateUserProfile,
    addOrUpdateAddress, deleteAddress, changePassword, subscribeNewsletter
};
