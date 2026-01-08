import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetUsers,
  adminDeleteUser,
  adminGetUserVehicles
} from "../../API/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vehicleCount, setVehicleCount] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await adminGetUsers();

      // ✅ FILTER OUT ADMIN USERS
      const normalUsers = (res.users || []).filter(
        (u) => u.role !== "admin"
      );

      setUsers(normalUsers);

      // ✅ load vehicle count safely
      normalUsers.forEach(async (u) => {
        try {
          const v = await adminGetUserVehicles(u._id);
          setVehicleCount((prev) => ({
            ...prev,
            [u._id]: v.vehicles.length,
          }));
        } catch {
          setVehicleCount((prev) => ({
            ...prev,
            [u._id]: 0,
          }));
        }
      });

    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminDeleteUser(id);
      toast.success("User deleted");
      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold text-red-500 mb-6"
      >
        Manage Users
      </motion.h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400">Loading users…</p>
      )}

      {/* EMPTY */}
      {!loading && users.length === 0 && (
        <p className="text-center text-gray-400">No users found</p>
      )}

      {/* USER LIST */}
      <div className="space-y-4">
        {users.map((u) => (
          <motion.div
            key={u._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="p-4 rounded-2xl border border-red-600 bg-zinc-950 flex justify-between items-center"
          >
            {/* USER INFO */}
            <div>
              <p className="font-bold text-lg">{u.name}</p>
              <p className="text-gray-400 text-sm">{u.email}</p>

              <p className="text-xs mt-1">
                Vehicles:
                <span className="text-green-400 font-semibold">
                  {" "}
                  {vehicleCount[u._id] ?? "--"}
                </span>
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  navigate(`/admin/manage-users/${u._id}`)
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold"
              >
                View Vehicles
              </button>

              <button
                onClick={() => deleteUser(u._id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold"
              >
                Delete
              </button>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
