import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

 email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
}
,

    password: {
      type: String,
      required: true,
    },

    // ⭐ user or admin
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ Email verification (OTP)
    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },

    // 🔐 Forgot password fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export const user1 = mongoose.model("user1", userschema);
