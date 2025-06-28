import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    addresses: [
      {
        label: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      }
    ],
    cartData: { type: Object, default: {} },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;