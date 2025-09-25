import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    },
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
        phone: String,
      }
    ],
    wishlist: [{ 
        type: String,
        default: [] 
    }],
    cartData: { type: Object, default: {} },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;