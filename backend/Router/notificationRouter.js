import express from "express";
import verifyToken from "../middlewear/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.put("/read/:id", verifyToken, markAsRead);
router.put("/read-all", verifyToken, markAllAsRead);
router.delete("/clear-all", verifyToken, clearAllNotifications);


export default router;
