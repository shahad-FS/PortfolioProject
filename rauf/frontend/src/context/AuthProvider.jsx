import { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem("tokens");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setTokens(data);
  };

  const logout = () => {
    localStorage.removeItem("tokens");
    setTokens(null);
  };

  return (
    <AuthContext.Provider value={{ tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
