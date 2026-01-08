import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackgroundWrapper from "./BackgroundWrapper";
import toast from "react-hot-toast";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/user/reset-password",
        { token, password }
      );

      toast.success(res.data.message || "Password updated successfully ✅");
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed ❌"
      );
    }
  };

  return (
    <BackgroundWrapper>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="input-red mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input-red mb-6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full h-11 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Reset Password
          </button>
        </form>
      </motion.div>
    </BackgroundWrapper>
  );
}
