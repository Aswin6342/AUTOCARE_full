import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user1 } from "../models/user.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ========== SEND OTP (COMMON) ========== */
const sendOTP = async (user, purpose = "verify") => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail({
    to: user.email,
    subject:
      purpose === "reset"
        ? "Reset your AutoCare password"
        : "Verify your AutoCare account",
    html: `
      <h3>${purpose === "reset" ? "Password Reset" : "Email Verification"}</h3>
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};

/* ========== REGISTER USER ========== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existingUser = await user1.findOne({ email });

    if (existingUser && existingUser.isVerified)
      return res.status(400).json({ success: false, message: "User already exists" });

    if (existingUser && !existingUser.isVerified) {
      await sendOTP(existingUser);
      return res.json({ success: true, message: "OTP resent" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user1.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    await sendOTP(newUser);

    res.status(201).json({
      success: true,
      message: "Registered successfully. OTP sent.",
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ========== VERIFY ACCOUNT OTP ========== */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await user1.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ success: false, message: "Already verified" });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("❌ VERIFY OTP ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ========== LOGIN ========== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await user1.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: "Verify email first" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ========== RESEND OTP ========== */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await user1.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ success: false, message: "Already verified" });

    await sendOTP(user);

    res.json({ success: true, message: "OTP resent" });
  } catch (error) {
    console.error("❌ RESEND OTP ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ========== FORGOT PASSWORD ========== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await user1.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    await sendOTP(user, "reset");

    res.json({ success: true, message: "OTP sent for password reset" });
  } catch (error) {
    console.error("❌ FORGOT PASSWORD ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ========== RESET PASSWORD ========== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await user1.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ RESET PASSWORD ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};














/* ========== ADMIN STATS ========== */
export const adminStats = async (req, res) => {
  try {
    const totalUsers = await user1.countDocuments();
    const verifiedUsers = await user1.countDocuments({ isVerified: true });

    res.json({
      success: true,
      totalUsers,
      verifiedUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ========== GET ALL USERS ========== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await user1.find().sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* ========== DELETE USER ========== */
export const deleteUser = async (req, res) => {
  try {
    const user = await user1.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch {
    res.status(500).json({ success: false });
  }
};
