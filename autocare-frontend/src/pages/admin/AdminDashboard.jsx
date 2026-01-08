import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminStats,
  getVehicleStats
} from "../../API/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";

import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalVehicles: 0
  });

  const [vehicleChart, setVehicleChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const user = await getAdminStats();
        const veh = await getVehicleStats();

        const totalVeh =
          (veh.cars || 0) + (veh.bikes || 0) + (veh.scooters || 0);

        setStats({
          totalUsers: user.totalUsers,
          verifiedUsers: user.verifiedUsers,
          totalVehicles: totalVeh
        });

        setVehicleChart([
          { name: "Cars", value: veh.cars || 0 },
          { name: "Bikes", value: veh.bikes || 0 },
          { name: "Scooters", value: veh.scooters || 0 }
        ]);

      } catch (err) {
        toast.error("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);


  const COLORS = ["#ff1a1a", "#0099ff", "#22c55e"];

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold text-red-500">
          Admin Control Panel
        </h1>

        <p className="text-gray-400">
          Monitor and manage AutoCare system
        </p>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-10 text-gray-400">
          Loading...
        </div>
      )}

      {!loading && (
        <>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-xl bg-zinc-950 border border-red-600 p-6 shadow-lg shadow-red-900/30"
            >
              <p className="text-gray-400">Total Users</p>
              <h2 className="text-4xl font-bold mt-1">{stats.totalUsers}</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-xl bg-zinc-950 border border-blue-600 p-6 shadow-lg shadow-blue-900/30"
            >
              <p className="text-gray-400">Verified Users</p>
              <h2 className="text-4xl font-bold mt-1">{stats.verifiedUsers}</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-xl bg-zinc-950 border border-green-600 p-6 shadow-lg shadow-green-900/30"
            >
              <p className="text-gray-400">Total Vehicles</p>
              <h2 className="text-4xl font-bold mt-1">{stats.totalVehicles}</h2>
            </motion.div>

          </div>

          {/* PIE CHART */}
          <div className="mt-10 rounded-2xl bg-zinc-950 border border-white/20 p-6">

            <h2 className="text-xl font-bold mb-3 text-gray-200">
              Vehicle Type Distribution
            </h2>

            <div className="w-full h-80">

              <ResponsiveContainer>
                <PieChart>

                  <Pie
                    data={vehicleChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                  >
                    {vehicleChart.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}

                    <Label
                      value="AutoCare"
                      position="center"
                      fill="#ffffff"
                      style={{ fontSize: 16, fontWeight: "bold" }}
                    />
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/admin/manage-users")}
              className="rounded-xl py-4 font-bold bg-red-600 hover:bg-red-700 shadow-lg"
            >
              Manage Users
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/admin/manage-vehicles")}
              className="rounded-xl py-4 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              Manage Vehicles
            </motion.button>

          </div>

        </>
      )}

    </div>
  );
}
