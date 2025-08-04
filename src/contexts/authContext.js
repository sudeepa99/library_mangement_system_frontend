import { createContext, useContext, useEffect, useState } from "react";
import { data } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = localStorage.getItem("token");
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            // const {data} = await getMe()
            setUser(data);
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const isAdmin = () => {
    return user?.role === "librarian";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {Children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
