import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session validity on initial load
    const verifySession = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        try {
          const profile = await authService.getCurrentUser();
          if (profile) {
            setUser(profile);
            setToken(savedToken);
          } else {
            setUser(null);
            setToken(null);
          }
        } catch {
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
