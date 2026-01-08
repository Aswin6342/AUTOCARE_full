import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import BackgroundWrapper from "./BackgroundWrapper";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, setAuthToken } from "../API/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email) return "Enter your email";
    if (!formData.password) return "Enter your password";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(""), 3500);
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      // Save token to axios + localStorage
      setAuthToken(res.token);

      // Save auth + role in context
      login(res.token, res.user.role);

      toast.success("Login successful ✅");

      // ROLE BASED REDIRECT
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Invalid email or password ❌";

      setError(message);
      setTimeout(() => setError(""), 3500);
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
          Welcome Back
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Login to continue
        </p>

        {error && (
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-red-600/90 text-white text-sm font-semibold shadow"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="input-red mb-4"
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            className="input-red mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-red-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-lg font-semibold transition flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            `}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 font-medium">
            Register
          </Link>
        </p>
      </motion.div>
    </BackgroundWrapper>
  );
}
