import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { addVehicle } from "../API/api";
import { useNavigate } from "react-router-dom";

export default function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: "",
    registrationNumber: "",
    manufacturingYear: "",
    kmDriven: "",
    reminderMonths: "",
    lastServiceDate: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [nextServiceDate, setNextServiceDate] = useState(null);

  // ⏳ save button state
  const [saving, setSaving] = useState(false);

  // 🔴 sliding error message
  const [error, setError] = useState("");

  const calculateNextService = (date, months) => {
    if (!date || !months) return null;
    const n = new Date(date);
    n.setMonth(n.getMonth() + Number(months));
    return n;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // file upload
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "lastServiceDate" || name === "reminderMonths") {
        setNextServiceDate(
          calculateNextService(updated.lastServiceDate, updated.reminderMonths)
        );
      }

      return updated;
    });
  };

  // ✅ validation function
  const validateForm = () => {
    if (!formData.vehicleType) return "Select vehicle type";
    if (!formData.registrationNumber) return "Enter registration number";
    if (!formData.manufacturingYear) return "Select manufacturing year";
    if (!formData.kmDriven) return "Enter KM driven";
    if (!formData.lastServiceDate) return "Select last service date";
    if (!formData.reminderMonths) return "Enter reminder months";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      // auto close alert
      setTimeout(() => setError(""), 3500);
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== "") fd.append(k, v);
      });

      await addVehicle(fd);

      toast.success("Vehicle added successfully 🚗");
      navigate("/my-vehicles");
    } catch (error) {
      toast.error(error?.message || "Failed to add vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center pt-28 px-4">
      <motion.div
        className="w-full max-w-md bg-black/90 border border-red-600/40 rounded-2xl shadow-2xl p-8 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
          Add Vehicle
        </h2>

        {/* 🔴 Sliding Error Alert */}
        {error && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-red-600/90 text-white text-sm font-semibold shadow-lg"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <select
            name="vehicleType"
            className="input-rb"
            onChange={handleChange}
          >
            <option value="">Select Vehicle Type</option>
            <option>Car</option>
            <option>Bike</option>
            <option>Scooter</option>
          </select>

          <input
            name="registrationNumber"
            className="input-rb"
            placeholder="KL-07-AB-1234"
            onChange={handleChange}
          />

          <select
            name="manufacturingYear"
            className="input-rb"
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 30 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>

          <input
            type="number"
            name="kmDriven"
            placeholder="KM Driven"
            className="input-rb"
            onChange={handleChange}
          />

          <input
            type="date"
            name="lastServiceDate"
            max={new Date().toISOString().split("T")[0]}
            className="input-rb"
            onChange={handleChange}
          />

          <input
            type="number"
            name="reminderMonths"
            placeholder="Reminder (months)"
            className="input-rb"
            onChange={handleChange}
          />

          {/* calculated next service */}
          {nextServiceDate && (
            <input
              disabled
              value={nextServiceDate.toLocaleDateString("en-GB")}
              className="input-rb opacity-70"
            />
          )}

          <input
            type="file"
            name="photo"
            accept="image/*"
            className="input-rb"
            onChange={handleChange}
          />

          {preview && (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded-lg border border-red-500"
              alt="preview"
            />
          )}

          {/* 🔴 SAVE BUTTON WITH SPINNER */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full h-12 rounded-lg font-semibold transition flex items-center justify-center gap-2
              ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              "Save Vehicle"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
