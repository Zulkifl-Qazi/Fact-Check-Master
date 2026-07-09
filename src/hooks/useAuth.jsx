import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load user session from localStorage on mount
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('fcm_user_session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (e) {
      console.error('Failed to load user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (provider, userData) => {
    const session = {
      ...userData,
      provider,
      joinedAt: userData.joinedAt || new Date().toISOString()
    };
    setUser(session);
    localStorage.setItem('fcm_user_session', JSON.stringify(session));
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fcm_user_session');
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isLoggedIn: !!user,
      showAuthModal,
      openAuthModal,
      closeAuthModal
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
