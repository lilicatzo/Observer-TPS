import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn === "true";
  });
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
  }, [isLoggedIn, userName, userId]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName, userId, setUserId }}>
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
