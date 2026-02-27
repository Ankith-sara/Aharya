import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    tempPassword: {
      type: String,
      select: false
    },
    image: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    },
    addresses: [
      {
        label: { type: String, trim: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zip: { type: String, trim: true },
        country: { type: String, trim: true },
        phone: { type: String, trim: true },
        isDefault: { type: Boolean, default: false }
      }
    ],
    wishlist: {
      type: [String],
      default: []
    },
    cartData: {
      type: Map,
      of: Map,
      default: new Map()
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin'
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      select: false
    },
    otpExpiry: {
      type: Date,
      select: false
    },
    // Account lockout fields
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    // Refresh token for JWT rotation
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiry;
        delete ret.refreshToken;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// Virtual for cart item count
userSchema.virtual('cartItemCount').get(function () {
  if (!this.cartData) return 0;
  let count = 0;
  for (const [itemId, sizes] of this.cartData.entries()) {
    for (const [size, quantity] of sizes.entries()) {
      count += quantity;
    }
  }
  return count;
});

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.hasAdminAccess = function () {
  return this.isAdmin || this.role === 'admin';
};

userSchema.methods.addToCart = function (itemId, size, quantity = 1) {
  const itemIdStr = String(itemId);
  const sizeStr = String(size);
  if (!this.cartData) this.cartData = new Map();
  if (!this.cartData.has(itemIdStr)) this.cartData.set(itemIdStr, new Map());
  const currentQty = this.cartData.get(itemIdStr).get(sizeStr) || 0;
  this.cartData.get(itemIdStr).set(sizeStr, currentQty + quantity);
  this.markModified('cartData');
  return this.cartData;
};

userSchema.methods.updateCartItem = function (itemId, size, quantity) {
  const itemIdStr = String(itemId);
  const sizeStr = String(size);
  if (!this.cartData) this.cartData = new Map();
  if (quantity === 0) {
    if (this.cartData.has(itemIdStr)) {
      this.cartData.get(itemIdStr).delete(sizeStr);
      if (this.cartData.get(itemIdStr).size === 0) this.cartData.delete(itemIdStr);
    }
  } else {
    if (!this.cartData.has(itemIdStr)) this.cartData.set(itemIdStr, new Map());
    this.cartData.get(itemIdStr).set(sizeStr, quantity);
  }
  this.markModified('cartData');
  return this.cartData;
};

userSchema.methods.clearCart = function () {
  this.cartData = new Map();
  this.markModified('cartData');
  return this.cartData;
};

// Increment login attempts and lock if needed
userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
  }
  return await this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $unset: { lockUntil: 1 },
    $set: { loginAttempts: 0 }
  });
};

userSchema.pre('save', function (next) {
  if (this.role === 'admin') this.isAdmin = true;
  next();
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
