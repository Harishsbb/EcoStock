import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("smartstock_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smartstock_token"));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem("smartstock_user", JSON.stringify(profile));
        } catch (error) {
          console.warn("Session expired or server unavailable.");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await authService.login(credentials);
    setToken(res.token);
    setUser(res);
    localStorage.setItem("smartstock_token", res.token);
    localStorage.setItem("smartstock_user", JSON.stringify(res));
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    setToken(res.token);
    setUser(res);
    localStorage.setItem("smartstock_token", res.token);
    localStorage.setItem("smartstock_user", JSON.stringify(res));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("smartstock_token");
    localStorage.removeItem("smartstock_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
