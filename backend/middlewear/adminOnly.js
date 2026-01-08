import { user1 } from "../models/user.js";

const adminOnly = async (req, res, next) => {
  try {
    // userId was already added by verifyToken middleware
    const user = await user1.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default adminOnly;
