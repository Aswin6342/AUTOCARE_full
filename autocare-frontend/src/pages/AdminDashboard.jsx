import { useEffect, useState } from "react";
import { getAdminStats, getVehicleStats } from "../../API/api";
import toast from "react-hot-toast";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [vehicleStats, setVehicleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await getAdminStats();
        const vehicleRes = await getVehicleStats();

        setStats(userRes);
        setVehicleStats(vehicleRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pieData =
    vehicleStats && vehicleStats.totalVehicles > 0
      ? {
          labels: ["Cars", "Bikes", "Scooters"],
          datasets: [
            {
              data: [
                vehicleStats.cars || 0,
                vehicleStats.bikes || 0,
                vehicleStats.scooters || 0
              ],
              backgroundColor: ["#ef4444", "#3b82f6", "#22c55e"],
              borderColor: "#000",
              borderWidth: 2
            }
          ]
        }
      : null;

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      <h1 className="text-4xl font-extrabold text-red-500">
        Admin Control Panel
      </h1>

      <p className="text-gray-400 mb-8">
        System overview and management console
      </p>

      {loading ? (
        <div className="text-center text-lg mt-10 animate-pulse">
          Loading dashboard…
        </div>
      ) : (
        <>
          {/* USER STATS */}
          <div className="grid md:grid-cols-2 gap-6">

            <StatCard title="Total Users" value={stats?.totalUsers} />
            <StatCard title="Verified Users" value={stats?.verifiedUsers} />

          </div>

          {/* VEHICLE STATS */}
          <h2 className="mt-10 mb-4 text-2xl font-bold text-red-400">
            Vehicle Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <StatCard title="Total Vehicles" value={vehicleStats?.totalVehicles} />
            <StatCard title="Cars" value={vehicleStats?.cars} />
            <StatCard title="Bikes" value={vehicleStats?.bikes} />

          </div>

          {/* PIE CHART */}
          <div className="max-w-md mx-auto mt-10 bg-zinc-900 border border-red-600 p-5 rounded-2xl">

            <h3 className="text-center mb-3 font-semibold text-gray-200">
              Vehicle Type Distribution
            </h3>

            {pieData ? (
              <Pie data={pieData} />
            ) : (
              <p className="text-center text-gray-400 py-8">
                No vehicle data available
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-red-600 rounded-2xl p-6 hover:scale-[1.02] transition">
      <p className="text-gray-400">{title}</p>
      <h2 className="text-4xl font-bold mt-2">
        {value ?? "--"}
      </h2>
    </div>
  );
}
