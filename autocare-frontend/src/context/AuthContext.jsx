import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../API/api";
import {jwtDecode} from "jwt-decode";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Restore login on page refresh
  // ============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // expired token auto logout
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setAuthToken(token);
          setIsAuth(true);
          setRole(decoded.role);
          setUser(decoded);
        }

      } catch (err) {
        handleLogout();
      }
    }

    setLoading(false);
  }, []);

  // ============================
  // LOGIN
  // ============================
  const handleLogin = (token, roleFromApi) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", roleFromApi);

    setAuthToken(token);
    setIsAuth(true);
    setRole(roleFromApi);

    try {
      setUser(jwtDecode(token));
    } catch {
      setUser(null);
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setAuthToken(null);
    setIsAuth(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        role,
        user,
        isAdmin: role === "admin",
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
