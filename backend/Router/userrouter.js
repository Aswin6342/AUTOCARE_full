import express from "express";

import {
  register,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,

  // admin
  adminStats,
  getAllUsers,
  deleteUser,
} from "../controller/usercontroller.js";

import verifyToken from "../middlewear/auth.js";
import adminOnly from "../middlewear/adminOnly.js";

const userrouter = express.Router();

/* AUTH */
userrouter.post("/register", register);
userrouter.post("/login", login);

/* OTP */
userrouter.post("/verify-otp", verifyOTP);
userrouter.post("/resend-otp", resendOTP);

/* PASSWORD (OTP BASED) */
userrouter.post("/forgot-password", forgotPassword); // send OTP
userrouter.post("/reset-password", resetPassword);   // otp + new password

/* ADMIN */
userrouter.get("/admin/stats", verifyToken, adminOnly, adminStats);
userrouter.get("/admin/users", verifyToken, adminOnly, getAllUsers);
userrouter.delete("/admin/users/:id", verifyToken, adminOnly, deleteUser);

export default userrouter;