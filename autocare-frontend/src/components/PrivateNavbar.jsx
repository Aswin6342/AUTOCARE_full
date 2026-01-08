import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function PrivateNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black border-b border-red-600 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-red-500">AutoCare</h1>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/add-vehicle">Add Vehicle</NavLink>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-red-500"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-red-600 px-6 py-4 space-y-3 text-gray-300">
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/add-vehicle" onClick={() => setOpen(false)}>
            Add Vehicle
          </NavLink>
          <button
            onClick={handleLogout}
            className="block text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
