'use client'

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState('');
  const [username, setUsername] = useState('');
  
  const router = useRouter();

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

  const logout = async () => {
    try {
      // Call the logout API
      const response = await fetch('http://127.0.0.1:8000/logout/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
  
      if (response.ok) {
        // Clear user data and token
        setAuthToken(null);
        setUsername('');
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        router.push('/'); 
        const data = await response.json();
        console.log(data)
      } else {
        // Handle API error
        const data = await response.json();
        console.error('Logout error:', data);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
