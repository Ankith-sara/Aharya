import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/UserModel.js';
import { sendOtpMail } from '../middlewares/sendOtpMail.js';
import { sendWelcomeMail } from '../middlewares/sendWelcomeMail.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            // Optionally, auto-register user here if you want OTP login for new users
            user = new userModel({ email, name: 'User', password: 'dummy-password' });
            await user.save();
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendOtpMail(email, otp);

        res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp, name, password } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user || !user.otp || !user.otpExpiry) {
            return res.status(400).json({ success: false, message: 'OTP not requested or expired' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(401).json({ success: false, message: 'OTP expired' });
        }

        if (name) user.name = name;
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (req.body.role) {
            user.role = req.body.role;
            if (req.body.role === 'admin') {
                user.isAdmin = true;
            }
        }

        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();
        await sendWelcomeMail(email, user.name);

        if (!user.role) {
            user.role = 'user';
        }

        if (req.body.role && req.body.role === 'admin') {
            user.role = 'admin';
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const createToken = (id, role = 'user') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        const token = createToken(user._id);
        res.status(200).json({ success: true, token, name: user.name });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            message: `Welcome, ${user.name}! Registration successful.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin login using stored admin user
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email, role: 'admin' });
        if (!user) return res.status(404).json({ success: false, message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = createToken(user._id, 'admin');
        res.status(200).json({ success: true, token, message: 'Admin login successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAdmin = new userModel({ name, email, password: hashedPassword, role: 'admin', isAdmin: true });
        const user = await newAdmin.save();

        const token = createToken(user._id, 'admin');

        res.status(201).json({
            success: true,
            token,
            message: `Welcome Admin ${user.name}, registration successful.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await userModel.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Update profile
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
                folder: 'user_profiles'
            });
            imageUrl = result.secure_url;
        }

        const updatedFields = { name, email };
        if (imageUrl) updatedFields.image = imageUrl;

        const user = await userModel.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.error("Error updating profile:", error);
    }
};

// Add or update address
const addOrUpdateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { addressObj, index } = req.body; // index: if updating, else -1 for add
        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (typeof index === "number" && index >= 0) {
            // Update existing address
            user.addresses[index] = addressObj;
        } else {
            // Add new address
            user.addresses.push(addressObj);
        }
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete address
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

// Change password
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
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "Password updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, registerAdmin, getUserDetails, updateUserProfile, addOrUpdateAddress, deleteAddress, changePassword };