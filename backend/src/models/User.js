import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email Address is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ""
    },
    passwordHash: {
      type: String,
      select: false,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local"
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    passwordResetTokenHash: {
      type: String,
      select: false,
      default: null
    },
    passwordResetExpires: {
      type: Date,
      select: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
