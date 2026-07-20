import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('agropredict_admin_key') || '');
  const isAdmin = Boolean(adminKey);
  const user = useMemo(() => ({
    full_name: isAdmin ? 'AgroPredict Admin' : 'Demo Farmer',
    role: isAdmin ? 'admin' : 'farmer',
  }), [isAdmin]);

  const loginAdmin = (key) => {
    if (key !== 'admin123') return false;
    localStorage.setItem('agropredict_admin_key', key);
    setAdminKey(key);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('agropredict_admin_key');
    setAdminKey('');
  };
  const navigateToLogin = () => {};
  const checkAppState = () => {};
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: true, 
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: { name: 'AgroPredict AI' },
      logout,
      loginAdmin,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
