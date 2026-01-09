import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  adminGetUserVehicles,
  adminDeleteVehicle
} from "../../API/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function UserVehicles() {

  // route param :userId
  const { userId } = useParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadVehicles();
  }, [userId]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const res = await adminGetUserVehicles(userId);
      setVehicles(res.vehicles || []);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const removeVehicle = async (vehicleId) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await adminDeleteVehicle(vehicleId);
      toast.success("Vehicle deleted");
      loadVehicles();
    } catch {
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-black text-white">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-extrabold text-red-500">
          User Vehicles
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-red-600 hover:bg-red-700"
        >
          ⬅ Back
        </button>
      </motion.div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400">
          Loading vehicles…
        </p>
      )}

      {/* EMPTY */}
      {!loading && vehicles.length === 0 && (
        <p className="text-center text-gray-400">
          No vehicles registered by this user
        </p>
      )}

      {/* VEHICLE GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <motion.div
            key={v._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-red-600 bg-zinc-950 p-4"
          >
            {/* IMAGE */}
            <img
              src={
                v.photo
                  ? v.photo.startsWith("http")
                    ? v.photo
                    : `http://localhost:5000/${v.photo}`
                  : "/no-image.jpg"
              }
              alt="vehicle"
              className="h-32 w-full object-cover rounded-xl"
            />

            {/* DETAILS */}
            <p className="mt-3 font-bold text-lg text-white">
              {v.vehicleType}
            </p>

            <p className="text-gray-400 text-sm">
              Reg No: <span className="text-white">{v.registrationNumber}</span>
            </p>

            <p className="text-xs mt-2">
              Last Service:
              <span className="text-yellow-400">
                {" "}
                {new Date(v.lastServiceDate).toLocaleDateString("en-GB")}
              </span>
            </p>

            <p className="text-xs mt-1">
              Next Service:
              <span className="text-green-400">
                {" "}
                {new Date(v.nextServiceDate).toLocaleDateString("en-GB")}
              </span>
            </p>

            <p className="text-xs mt-1">
              KM Driven:
              <span className="text-blue-400">
                {" "}{v.kmDriven}
              </span>
            </p>

            {/* DELETE */}
            <button
              onClick={() => removeVehicle(v._id)}
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
