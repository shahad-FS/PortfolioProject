import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem("tokens");
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("user_role") || null;
  });
  const fetchAndSaveRole = async (accessToken) => {
    try {
      const res = await api.get("accounts/profile/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const roleFromBackend = res.data.role;

      if (roleFromBackend) {
        localStorage.setItem("user_role", roleFromBackend);
        setUserRole(roleFromBackend);
      }
    } catch (error) {
      console.error("فشل جلب دور المستخدم من الباكيند:", error);
    }
  };
  const login = async (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setTokens(data);

    if (data?.access) {
      await fetchAndSaveRole(data.access);
    }
  };

  const logout = () => {
    localStorage.removeItem("tokens");
    localStorage.removeItem("user_role");
    setTokens(null);
    setUserRole(null);
  };
  useEffect(() => {
    if (tokens?.access && !userRole) {
      fetchAndSaveRole(tokens.access);
    }
  }, [tokens, userRole]);
  return (
    <AuthContext.Provider
      value={{ tokens, login, logout, userRole, setUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
