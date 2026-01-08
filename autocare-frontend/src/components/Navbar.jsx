import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block py-2 px-3 rounded 
    ${isActive ? "text-orange-50 font-bold" : "text-gray-300 hover:text-red-500"}`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-black border-b border-red-600 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to={isAdmin ? "/admin/dashboard" : isAuth ? "/dashboard" : "/"}
          className="text-xl font-bold text-red-500"
          onClick={() => setOpen(false)}
        >
          AutoCare
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm">

          {/* ---------- PUBLIC NAV ---------- */}
          {!isAuth && (
            <>
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/features" className={linkClass}>Features</NavLink>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}

          {/* ---------- USER NAV ---------- */}
          {isAuth && !isAdmin && (
            <>
              <NavLink to="/dashboard" className={linkClass}>Hub</NavLink>
              <NavLink to="/my-vehicles" className={linkClass}>My Vehicles</NavLink>
              <NavLink to="/add-vehicle" className={linkClass}>Add Vehicle</NavLink>
              <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          )}

          {/* ---------- ADMIN NAV ---------- */}
          {isAuth && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={linkClass}>
                Admin Dashboard
              </NavLink>

              <NavLink to="/admin/manage-users" className={linkClass}>
                Manage Users
              </NavLink>

              <NavLink to="/admin/manage-vehicles" className={linkClass}>
                Manage Vehicles
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300 text-2xl focus:outline-none"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      {open && (
        <div className="md:hidden bg-black border-t border-red-600 px-6 py-4 space-y-2">

          {!isAuth && (
            <>
              <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>Home</NavLink>
              <NavLink to="/features" onClick={() => setOpen(false)} className={linkClass}>Features</NavLink>
              <NavLink to="/login" onClick={() => setOpen(false)} className={linkClass}>Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)} className={linkClass}>Register</NavLink>
            </>
          )}

          {isAuth && !isAdmin && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)} className={linkClass}>Hub</NavLink>
              <NavLink to="/my-vehicles" onClick={() => setOpen(false)} className={linkClass}>My Vehicles</NavLink>
              <NavLink to="/add-vehicle" onClick={() => setOpen(false)} className={linkClass}>Add Vehicle</NavLink>
              <NavLink to="/notifications" onClick={() => setOpen(false)} className={linkClass}>Notifications</NavLink>

              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-3 text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          )}

          {isAuth && isAdmin && (
            <>
              <NavLink to="/admin/dashboard" onClick={() => setOpen(false)} className={linkClass}>
                Admin Dashboard
              </NavLink>

              <NavLink to="/admin/manage-users" onClick={() => setOpen(false)} className={linkClass}>
                Manage Users
              </NavLink>

              <NavLink to="/admin/manage-vehicles" onClick={() => setOpen(false)} className={linkClass}>
                Manage Vehicles
              </NavLink>

              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-3 text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
