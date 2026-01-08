import { useEffect, useState } from "react";
import { getMyVehicles } from "../API/api";
import { toast } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flip, setFlip] = useState(false);

  // fetch vehicles
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getMyVehicles();
        setVehicles(res?.vehicles || res || []);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // logo flip scroll effect
  useEffect(() => {
    const h = () => setFlip((p) => !p);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // vehicle counts for chart
  const car = vehicles.filter(v => v.vehicleType === "Car").length;
  const bike = vehicles.filter(v => v.vehicleType === "Bike").length;
  const scooter = vehicles.filter(v => v.vehicleType === "Scooter").length;

  const total = car + bike + scooter;

  const chartData = [
    { name: "Car", value: car, color: "#ef4444" },
    { name: "Bike", value: bike, color: "#2563eb" },
    { name: "Scooter", value: scooter, color: "#16a34a" },
  ];

  const isZero = total === 0;

  // service due helper
  const getDaysLeft = (next) => {
    if (!next) return null;
    const t = new Date();
    const n = new Date(next);
    return Math.ceil((n - t) / (1000 * 60 * 60 * 24));
  };

  // ⭐ label renderer for chart
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    if (isZero) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = chartData[index];
    if (!item || item.value === 0) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight={700}
        fontSize={12}
      >
        {item.name} ({item.value})
        <tspan x={x} dy="1.1em" fontSize={10}>
          {(percent * 100).toFixed(0)}%
        </tspan>
      </text>
    );
  };

  return (
    <div className="relative min-h-screen px-6 pt-24 pb-16 overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0c0c0c]">

      {/* glowing blur background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-20 w-[420px] h-[420px] bg-red-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-blue-600/25 rounded-full blur-[120px]" />
      </div>

      {/* split color animated logo */}
      <motion.h1
        animate={{ backgroundPosition: flip ? "100% 0%" : "0% 0%" }}
        transition={{ duration: 0.6 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[200px] font-extrabold tracking-wider opacity-[0.2] blur-[1.5px] bg-clip-text text-transparent"
        style={{
          backgroundImage: flip
            ? "linear-gradient(to right, #2563eb 50%, #ef4444 50%)"
            : "linear-gradient(to right, #ef4444 50%, #2563eb 50%)",
        }}
      >
        AUTOCARE
      </motion.h1>

      {/* HEADER */}
      <h2 className="text-4xl font-extrabold text-white">AutoCare Hub</h2>
      <p className="text-gray-300 mb-8">Do not risk your vehicle's life</p>

      {/* QUICK ACTIONS */}
      <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-6 mb-10">
        <h3 className="text-xl text-white font-semibold mb-4">Quick Actions</h3>

        <div className="flex gap-4 flex-wrap">

          {/* ➕ add vehicle page */}
          <button
            onClick={() => navigate("/add-vehicle")}
            className="px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-700 text-white font-semibold"
          >
            Add Vehicle
          </button>

          {/* 👀 all vehicles page */}
          <button
            onClick={() => navigate("/my-vehicles")}
            className="px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-700 text-white font-semibold"
          >
            View All Vehicles
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CHART PANEL */}
        <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Vehicle Type Distribution
          </h3>

          <div className="w-full h-[330px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-white">
                Loading...
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    label={renderLabel}
                    labelLine={false}
                  >
                    {isZero
                      ? chartData.map((_, i) => <Cell key={i} fill="#000000" />)
                      : chartData.map((x, i) => (
                        <Cell key={i} fill={x.color} />
                      ))}
                  </Pie>

                  {!isZero && <Tooltip />}
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* VEHICLE LIST */}
        <div className="rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Your Vehicles
          </h3>

          {!loading && vehicles.length === 0 && (
            <p className="text-gray-400">No vehicles yet 🚗</p>
          )}

          <div className="space-y-3">
            {vehicles.map(v => {
              const days = getDaysLeft(v.nextServiceDate);

              return (
                <motion.div
                  key={v._id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate("/myvehicles")}
                  className="cursor-pointer rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 p-4 flex justify-between"
                >
                  <div>
                    <p className="text-white font-bold">
                      {v.vehicleType} —
                      {v.regNo || v.registrationNumber || v.registration_number || "No Reg No"}
                    </p>

                    <p className="text-sm text-gray-300">
                      Next Service:{" "}
                      {v.nextServiceDate
                        ? new Date(v.nextServiceDate).toDateString()
                        : "Not set"}
                    </p>
                  </div>

                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm font-semibold
                      ${days === null
                        ? "bg-gray-300 text-black"
                        : days < 0
                          ? "bg-red-400 text-black"
                          : days === 0
                            ? "bg-yellow-300 text-black"
                            : "bg-green-300 text-black"
                      }
                    `}
                  >
                    {days === null
                      ? "N/A"
                      : days < 0
                        ? "Overdue"
                        : days === 0
                          ? "Due Today"
                          : `${days} days left`}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
