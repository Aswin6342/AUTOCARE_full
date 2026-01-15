import axios from "axios";

//const API_URL = "http://localhost:5000";
const API_URL = "https://autocare-full.onrender.com"
// const API_URL = import.meta.env.VITE_API_URL;


/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: API_URL,
});

/* ================= AUTH TOKEN HANDLER ================= */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

/* ================= AUTH ================= */
export const registerUser = async (data) => {
  const res = await api.post("/user/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/user/login", data);
  return res.data;
};

/* ================= OTP & PASSWORD ================= */

// Send OTP to email (Forgot password)
export const forgotPassword = async (email) => {
  const res = await api.post("/user/forgot-password", { email });
  return res.data;
};

// Verify OTP (used for registration OTP)
export const verifyOtp = async (data) => {
  const res = await api.post("/user/verify-otp", data);
  return res.data;
};

// Resend OTP
export const resendOtp = async (data) => {
  const res = await api.post("/user/resend-otp", data);
  return res.data;
};

// ✅ Reset password using OTP (NO reset page)
export const resetPassword = async (data) => {
  const res = await api.post("/user/reset-password", data);
  return res.data;
};

/* ================= VEHICLES (USER) ================= */
export const getMyVehicles = async () => {
  const res = await api.get("/vehicle/my");
  return res.data;
};

export const addVehicle = async (formData) => {
  const res = await api.post("/vehicle/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateVehicle = async (id, formData) => {
  const res = await api.put(`/vehicle/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


export const deleteVehicle = async (id) => {
  const res = await api.delete(`/vehicle/delete/${id}`);
  return res.data;
};

/* ================= NOTIFICATIONS ================= */
export const getNotifications = async () => {
  const res = await api.get("/notification");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notification/read/${id}`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put("/notification/read-all");
  return res.data;
};

/* ================= ADMIN DASHBOARD ================= */
export const getAdminStats = async () => {
  const res = await api.get("/user/admin/stats");
  return res.data;
};

export const getVehicleStats = async () => {
  const res = await api.get("/vehicle/admin/stats");
  return res.data;
};

/* ================= ADMIN USERS ================= */
export const adminGetUsers = async () => {
  const res = await api.get("/user/admin/users");
  return res.data;
};

export const adminDeleteUser = async (userId) => {
  const res = await api.delete(`/user/admin/users/${userId}`);
  return res.data;
};

/* ================= ADMIN VEHICLES ================= */

// Vehicles of ONE user
export const adminGetUserVehicles = async (userId) => {
  const res = await api.get(`/vehicle/admin/user/${userId}/vehicles`);
  return res.data;
};

// ALL vehicles
export const adminGetAllVehicles = async () => {
  const res = await api.get("/vehicle/admin/all");
  return res.data;
};

// Delete ANY vehicle (admin)
export const adminDeleteVehicle = async (vehicleId) => {
  const res = await api.delete(`/vehicle/admin/delete/${vehicleId}`);
  return res.data;
};

export const clearAllNotifications = async () => {
  const res = await api.delete("/notification/clear-all");
  return res.data;
};

export default api;
