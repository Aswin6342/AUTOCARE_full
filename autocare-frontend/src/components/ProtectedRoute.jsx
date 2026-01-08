import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuth, loading } = useAuth();

  // ⏳ Wait until auth state is restored
  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
