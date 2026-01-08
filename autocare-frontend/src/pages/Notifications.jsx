import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
} from "../API/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.notifications);
    } catch {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch {
      toast.error("Update failed");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch {
      toast.error("Update failed");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    try {
      await clearAllNotifications();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER ACTIONS */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Notifications
          </h2>

          <div className="flex gap-4">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">
            No notifications available
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`bg-white p-4 rounded-xl border shadow
                  ${n.read ? "border-gray-200" : "border-red-400"}
                `}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {n.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {n.message}
                </p>

                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="mt-2 text-xs text-red-600 font-semibold"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
