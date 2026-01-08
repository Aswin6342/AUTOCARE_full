import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import BackgroundWrapper from "./BackgroundWrapper";
import { registerUser, verifyOtp, resendOtp } from "../API/api";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = register form, 2 = OTP form

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= REGISTER & SEND OTP ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await registerUser(formData);

      toast.success(res.message || "OTP sent to your email");

      // move to OTP step
      setStep(2);

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await verifyOtp({
        email: formData.email,
        otp,
      });

      toast.success(res.message || "Email verified successfully");

      navigate("/login");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResendOtp = async () => {
    try {
      const res = await resendOtp({ email: formData.email });
      toast.success(res.message || "OTP resent to your email");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not resend OTP"
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
          Create Your Account
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Join AutoCare to manage your vehicle services
        </p>

        {/* ================= STEP 1: REGISTER FORM ================= */}
        {step === 1 && (
          <form onSubmit={handleRegister}>
            <input
              className="input-red mb-4"
              placeholder="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              className="input-red mb-4"
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="input-red mb-6"
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              {isLoading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        )}

        {/* ================= STEP 2: OTP INPUT ================= */}
        {step === 2 && (
          <>
            <p className="text-center font-medium mb-3">
              OTP has been sent to <span className="text-red-600">{formData.email}</span>
            </p>

            <form onSubmit={handleVerify}>
              <input
                className="input-red mb-4 tracking-widest text-center text-xl"
                placeholder="Enter 6-digit OTP"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <button
              onClick={handleResendOtp}
              className="w-full h-11 mt-3 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Resend OTP
            </button>
          </>
        )}

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </BackgroundWrapper>
  );
}
