import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  sendOTP: async () => false,
  verifyOTP: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const loggedIn = await authService.isLoggedIn();
        setIsAuthenticated(loggedIn);
        
        if (loggedIn) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    return await authService.sendOTP(phoneNumber);
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      const response = await authService.verifyOTP(phoneNumber, otp);
      setIsAuthenticated(true);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        sendOTP,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};