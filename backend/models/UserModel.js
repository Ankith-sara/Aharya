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
      unique: true,  // This automatically creates an index
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
      select: false  // Don't return OTP by default in queries
    },
    otpExpiry: {
      type: Date,
      select: false  // Don't return OTP expiry by default
    }
  },
  {
    timestamps: true,  // This already adds createdAt and updatedAt
    minimize: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;  // Never send password in JSON responses
        delete ret.otp;       // Never send OTP in JSON responses
        delete ret.otpExpiry;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

// Additional indexes for faster queries
// Note: email already has an index from unique: true
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// Virtual for full cart items count
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

// Instance method to check if user has admin privileges
userSchema.methods.hasAdminAccess = function () {
  return this.isAdmin || this.role === 'admin';
};

// Instance method to add item to cart
userSchema.methods.addToCart = function (itemId, size, quantity = 1) {
  const itemIdStr = String(itemId);
  const sizeStr = String(size);

  if (!this.cartData) {
    this.cartData = new Map();
  }

  if (!this.cartData.has(itemIdStr)) {
    this.cartData.set(itemIdStr, new Map());
  }

  const currentQty = this.cartData.get(itemIdStr).get(sizeStr) || 0;
  this.cartData.get(itemIdStr).set(sizeStr, currentQty + quantity);

  this.markModified('cartData');
  return this.cartData;
};

// Instance method to update cart item quantity
userSchema.methods.updateCartItem = function (itemId, size, quantity) {
  const itemIdStr = String(itemId);
  const sizeStr = String(size);

  if (!this.cartData) {
    this.cartData = new Map();
  }

  if (quantity === 0) {
    // Remove the item
    if (this.cartData.has(itemIdStr)) {
      this.cartData.get(itemIdStr).delete(sizeStr);

      // If no sizes left, remove the item entirely
      if (this.cartData.get(itemIdStr).size === 0) {
        this.cartData.delete(itemIdStr);
      }
    }
  } else {
    // Update quantity
    if (!this.cartData.has(itemIdStr)) {
      this.cartData.set(itemIdStr, new Map());
    }
    this.cartData.get(itemIdStr).set(sizeStr, quantity);
  }

  this.markModified('cartData');
  return this.cartData;
};

// Instance method to clear cart
userSchema.methods.clearCart = function () {
  this.cartData = new Map();
  this.markModified('cartData');
  return this.cartData;
};

// Pre-save middleware to sync isAdmin with role
userSchema.pre('save', function (next) {
  if (this.role === 'admin') {
    this.isAdmin = true;
  }
  next();
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;