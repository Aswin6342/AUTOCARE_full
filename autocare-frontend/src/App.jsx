import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

/* Public pages */
import Welcome from "./pages/Welcome";
import Features from "./pages/Features";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* User pages */
import Dashboard from "./pages/Dashboard";
import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";
import Notifications from "./pages/Notifications";

/* Admin pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserVehicles from "./pages/admin/UserVehicles";
import ManageVehicles from "./pages/admin/ManageVehicles";


function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Welcome />} />
        <Route path="/features" element={<Features />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* USER PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-vehicles"
          element={
            <ProtectedRoute>
              <MyVehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-vehicle"
          element={
            <ProtectedRoute>
              <AddVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PROTECTED */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />

        {/* ✅ FIXED PARAM CONSISTENCY */}
        <Route
          path="/admin/manage-users/:userId"
          element={
            <AdminProtectedRoute>
              <UserVehicles />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-vehicles"
          element={
            <AdminProtectedRoute>
              <ManageVehicles />
            </AdminProtectedRoute>
          }
        />


      </Routes>
    </>
  );
}

export default App;
