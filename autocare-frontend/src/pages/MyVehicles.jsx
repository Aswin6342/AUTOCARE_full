import { useEffect, useState } from "react";
import {
  getMyVehicles,
  deleteVehicle,
  updateVehicle,
} from "../API/api";
import toast from "react-hot-toast";
import fallbackImage from "../assets/image.png";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [nextServiceDate, setNextServiceDate] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  /* ================= SERVICE STATUS ================= */
  const getServiceStatus = (nextServiceDate) => {
  const today = new Date();
  const serviceDate = new Date(nextServiceDate);

  // Remove time part to avoid wrong day calculation
  today.setHours(0, 0, 0, 0);
  serviceDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (serviceDate - today) / (1000 * 60 * 60 * 24)
  );

  // 🚨 Overdue
  if (diffDays < 0) {
    return {
      label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`,
      color: "bg-red-600",
    };
  }

  // 🔥 Today
  if (diffDays === 0) {
    return {
      label: "Service Today",
      color: "bg-red-600",
    };
  }

  // ⏳ Within 3 days
  if (diffDays <= 3) {
    return {
      label: `Service in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
      color: "bg-orange-600",
    };
  }

  // ⚠️ Within 7 days
  if (diffDays <= 7) {
    return {
      label: `Service in ${diffDays} days`,
      color: "bg-yellow-500",
    };
  }

  // ✅ More than 7 days
  return {
    label: `Upcoming`,
    color: "bg-green-600",
  };
};


  /* ================= FETCH ================= */
  const fetchVehicles = async () => {
    try {
      const res = await getMyVehicles();
      setVehicles(res.vehicles);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await deleteVehicle(id);
      toast.success("Vehicle deleted");
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);

    setFormData({
      vehicleType: vehicle.vehicleType,
      registrationNumber: vehicle.registrationNumber,
      kmDriven: vehicle.kmDriven,
      reminderMonths: vehicle.reminderMonths,
      lastServiceDate: vehicle.lastServiceDate?.split("T")[0],
      photo: null,
    });

    setPreview(vehicle.photo || null);

    const next = new Date(vehicle.lastServiceDate);
    next.setMonth(next.getMonth() + Number(vehicle.reminderMonths || 6));
    setNextServiceDate(next);

    setShowModal(true);
  };

  const calculateNextService = (date, months) => {
    if (!date || !months) return null;
    const d = new Date(date);
    d.setMonth(d.getMonth() + Number(months));
    return d;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setFormData((p) => ({ ...p, photo: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "lastServiceDate" || name === "reminderMonths") {
        setNextServiceDate(
          calculateNextService(
            updated.lastServiceDate,
            updated.reminderMonths
          )
        );
      }

      return updated;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== "") fd.append(k, v);
      });

      const res = await updateVehicle(editingVehicle._id, fd);

      toast.success("Vehicle updated");

      setVehicles((prev) =>
        prev.map((v) =>
          v._id === editingVehicle._id ? res.vehicle : v
        )
      );

      setShowModal(false);
      setEditingVehicle(null);
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="text-center pt-28 text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const status = getServiceStatus(vehicle.nextServiceDate);

          return (
            <div
              key={vehicle._id}
              className="bg-white border border-red-200 rounded-xl p-4 shadow relative"
            >
              {/* STATUS */}
              <span
                className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white ${status.color}`}
              >
                {status.label}
              </span>

              <img
                src={vehicle.photo || fallbackImage}
                onError={(e) => (e.target.src = fallbackImage)}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />

              <h3 className="font-semibold text-lg">
                {vehicle.vehicleType}
              </h3>

              <p className="text-sm text-gray-600">
                <b>Reg No:</b> {vehicle.registrationNumber}
              </p>

              <p className="text-sm text-gray-600">
                <b>Last Service:</b>{" "}
                {new Date(vehicle.lastServiceDate).toLocaleDateString("en-GB")}
              </p>

              <p className="text-sm text-gray-600">
                <b>Next Service:</b>{" "}
                {new Date(vehicle.nextServiceDate).toLocaleDateString("en-GB")}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => openEditModal(vehicle)}
                  className="flex-1 py-2 bg-black text-white rounded text-sm"
                >
                  Update
                </button>

                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="flex-1 py-2 bg-red-700 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-4">
            <h3 className="text-lg font-bold text-center text-red-600 mb-3">
              Edit Vehicle
            </h3>

            {preview && (
              <img
                src={preview}
                className="w-14 h-14 mx-auto object-cover rounded mb-3"
              />
            )}

            <form onSubmit={handleUpdate} className="space-y-2">

              {/* 🔒 VEHICLE TYPE LOCKED */}
              <input
                value={formData.vehicleType}
                disabled
                className="w-full h-10 border rounded px-3 bg-gray-100 cursor-not-allowed"
              />

              {/* 🔒 REG NUMBER LOCKED */}
              <input
                value={formData.registrationNumber}
                disabled
                className="w-full h-10 border rounded px-3 bg-gray-100 cursor-not-allowed"
              />

              <input
                type="number"
                name="kmDriven"
                value={formData.kmDriven}
                onChange={handleChange}
                placeholder="KM Driven"
                className="w-full h-10 border rounded px-3"
              />

              <input
                type="date"
                name="lastServiceDate"
                value={formData.lastServiceDate}
                onChange={handleChange}
                className="w-full h-10 border rounded px-3"
              />

              <input
                type="number"
                name="reminderMonths"
                value={formData.reminderMonths}
                onChange={handleChange}
                placeholder="Reminder months"
                className="w-full h-10 border rounded px-3"
              />

              {/* 🔔 REMINDER PREVIEW */}
              {nextServiceDate && (
                <p className="text-xs text-center text-gray-600">
                  🔔 Reminders at <b>7 days</b> & <b>3 days</b> before{" "}
                  <b>{nextServiceDate.toLocaleDateString("en-GB")}</b>
                </p>
              )}

              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm"
              />

              <div className="flex gap-3 pt-2">
                <button className="flex-1 h-10 bg-red-600 text-white rounded font-semibold">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-10 bg-gray-200 rounded font-semibold"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
