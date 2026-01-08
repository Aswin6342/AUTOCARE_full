import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { loading, isAuth, isAdmin } = useAuth();

  // Wait for token restore
  if (loading) return <div className="pt-28 text-center">Checking auth…</div>;

  // Not logged in → Login
  if (!isAuth) return <Navigate to="/login" replace />;

  // Logged in but not admin → User dashboard
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  // Admin OK
  return children;
}
