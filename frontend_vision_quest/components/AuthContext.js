'use client'

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (storedToken) {
      setAuthToken(storedToken);
      setUsername(storedUsername)
    }
  }, []);

  const login = ( token, username ) => {
    setAuthToken( token );
    setUsername(username)
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setAuthToken(null);
    setUsername('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
