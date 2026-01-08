import { useEffect, useState } from "react";
import {
  adminGetAllVehicles,
  adminDeleteVehicle
} from "../../API/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ManageVehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, typeFilter, vehicles]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const res = await adminGetAllVehicles();
      setVehicles(res.vehicles || []);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...vehicles];

    if (typeFilter !== "ALL") {
      data = data.filter(v => v.vehicleType === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(v =>
        v.registrationNumber?.toLowerCase().includes(q) ||
        v.vehicleType?.toLowerCase().includes(q) ||
        v.user?.name?.toLowerCase().includes(q) ||
        v.user?.email?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle permanently?")) return;

    try {
      await adminDeleteVehicle(id);
      toast.success("Vehicle deleted");
      loadVehicles();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-extrabold text-red-500">
          Manage All Vehicles
        </h1>

        <p className="text-gray-400 text-sm">
          Total Vehicles:{" "}
          <span className="text-green-400 font-semibold">
            {vehicles.length}
          </span>
        </p>
      </motion.div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search by registration / owner / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-red-600 focus:outline-none"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-red-600"
        >
          <option value="ALL">All Types</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Scooter">Scooter</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400">
          Loading vehicles…
        </p>
      )}

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-400">
          No vehicles match your search
        </p>
      )}

      {/* VEHICLE GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {filtered.map(v => (
          <motion.div
            key={v._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-red-600 bg-zinc-950 p-4"
          >

            {/* IMAGE */}
            <img
              src={v.photo || "/no-image.jpg"}
              alt="vehicle"
              className="h-32 w-full object-cover rounded-xl"
            />

            {/* VEHICLE INFO */}
            <p className="mt-3 font-bold text-lg">
              {v.vehicleType}
            </p>

            <p className="text-gray-400 text-sm">
              {v.registrationNumber}
            </p>

            {/* OWNER */}
            <p className="text-xs mt-2 text-blue-400">
              Owner: {v.user?.name}
            </p>

            <p className="text-xs text-gray-400">
              {v.user?.email}
            </p>

            {/* DETAILS */}
            <p className="text-xs mt-1">
              Year:{" "}
              <span className="text-green-400">
                {v.manufacturingYear}
              </span>
            </p>

            <p className="text-xs mt-1">
              KM Driven:{" "}
              <span className="text-orange-400">
                {v.kmDriven}
              </span>
            </p>

            {/* DELETE */}
            <button
              onClick={() => deleteVehicle(v._id)}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 rounded-xl py-2 font-semibold"
            >
              Delete Vehicle
            </button>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
