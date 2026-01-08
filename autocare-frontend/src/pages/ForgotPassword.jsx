import { motion } from "framer-motion";
import { useState } from "react";
import BackgroundWrapper from "./BackgroundWrapper";
import toast from "react-hot-toast";
import { forgotPassword, resetPassword } from "../API/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  /* STEP 1: SEND OTP */
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPassword(email);
      toast.success(res.message || "OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* STEP 2: VERIFY OTP + RESET PASSWORD */
  const reset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await resetPassword({
        email,
        otp,
        newPassword,
      });
      toast.success(res.message || "Password updated");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
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
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {step === 1
            ? "Enter your registered email"
            : "Enter OTP and new password"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOtp}>
            <input
              type="email"
              placeholder="Email"
              className="input-red mb-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={reset}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input-red mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              className="input-red mb-6"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </BackgroundWrapper>
  );
}
