import { Notification } from "../models/notification.js";

/* GET USER NOTIFICATIONS */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

/* MARK SINGLE AS READ */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

/* MARK ALL AS READ */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.userId, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};


/* CLEAR ALL NOTIFICATIONS */
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user.userId,
    });

    res.json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
    });
  }
};
