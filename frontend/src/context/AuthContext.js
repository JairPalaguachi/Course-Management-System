import React, { createContext, useContext, useState, useEffect } from 'react';

function decodeJWT(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return null; }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) setUser(decoded);
      else localStorage.clear();
    }
  }, []);

  const login = (access, refresh) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    setUser(decodeJWT(access));
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
