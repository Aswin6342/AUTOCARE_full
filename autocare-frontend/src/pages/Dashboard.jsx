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

// ✅ ICONS
import {
  Car,
  Bike,
  Plus,
  Eye,
  Wrench,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const car = vehicles.filter((v) => v.vehicleType === "Car").length;
  const bike = vehicles.filter((v) => v.vehicleType === "Bike").length;
  const scooter = vehicles.filter((v) => v.vehicleType === "Scooter").length;

  const total = car + bike + scooter;

  const chartData = [
    { name: "Car", value: car, color: "#ef4444" },
    { name: "Bike", value: bike, color: "#2563eb" },
    { name: "Scooter", value: scooter, color: "#16a34a" },
  ];

  const isZero = total === 0;

  const getDaysLeft = (next) => {
    if (!next) return null;
    const t = new Date();
    const n = new Date(next);
    return Math.ceil((n - t) / (1000 * 60 * 60 * 24));
  };

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
        fontSize={11}
      >
        {item.name}
        <tspan x={x} dy="1.1em" fontSize={9}>
          {(percent * 100).toFixed(0)}%
        </tspan>
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10 mt-11">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-10">
        <Wrench className="text-red-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold">AutoCare</h1>
          <p className="text-gray-400 text-sm">
            Track and manage your vehicle services
          </p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">

        <button
          onClick={() => navigate("/add-vehicle")}
          className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-red-600 p-5 rounded-xl hover:scale-[1.02] transition"
        >
          <div>
            <p className="text-lg font-semibold">Add Vehicle</p>
            <p className="text-sm opacity-80">Register new vehicle</p>
          </div>
          <Plus />
        </button>

        <button
          onClick={() => navigate("/my-vehicles")}
          className="flex items-center justify-between bg-gradient-to-r from-slate-600 to-blue-600 p-5 rounded-xl hover:scale-[1.02] transition"
        >
          <div>
            <p className="text-lg font-semibold">View Vehicles</p>
            <p className="text-sm opacity-80">Check all vehicles</p>
          </div>
          <Eye />
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CHART */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Car size={18} /> Vehicle Distribution
          </h3>

          <div className="h-[300px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
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
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    label={renderLabel}
                    labelLine={false}
                  >
                    {isZero
                      ? chartData.map((_, i) => (
                          <Cell key={i} fill="#222" />
                        ))
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
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bike size={18} /> Your Vehicles
          </h3>

          {!loading && vehicles.length === 0 && (
            <p className="text-gray-500">No vehicles added yet</p>
          )}

          <div className="space-y-4">
            {vehicles.map((v) => {
              const days = getDaysLeft(v.nextServiceDate);

              return (
                <motion.div
                  key={v._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate("/my-vehicles")}
                  className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-[#222]"
                >
                  <div className="flex items-center gap-3">

                    {/* icon based on type */}
                    {v.vehicleType === "Car" && <Car size={20} />}
                    {v.vehicleType === "Bike" && <Bike size={20} />}
                    {v.vehicleType === "Scooter" && <Bike size={20} />}

                    <div>
                      <p className="font-semibold">
                        {v.vehicleType} •{" "}
                        {v.regNo ||
                          v.registrationNumber ||
                          "No Reg No"}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {v.nextServiceDate
                          ? new Date(
                              v.nextServiceDate
                            ).toDateString()
                          : "Service not scheduled"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${
                      days === null
                        ? "bg-gray-400 text-black"
                        : days < 0
                        ? "bg-red-500"
                        : days === 0
                        ? "bg-yellow-400 text-black"
                        : "bg-green-500"
                    }`}
                  >
                    {days === null
                      ? "N/A"
                      : days < 0
                      ? "Overdue"
                      : days === 0
                      ? "Today"
                      : `${days} days`}
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
