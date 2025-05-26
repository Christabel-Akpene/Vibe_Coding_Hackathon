import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';

type User = {
  id: string;
  email: string;
  name: string;
  businessName: string;
  currency: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    name: string, 
    businessName: string, 
    currency: string
  ) => Promise<void>;
  signOut: () => void;
  socialSignIn: (provider: 'google' | 'facebook') => Promise<void>;
};

// Mock API call functions for demonstration
const mockSignIn = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Accept any email/password combination for testing
  return {
    id: '1',
    email: email,
    name: 'Demo User',
    businessName: 'Demo Business',
    currency: 'USD'
  };
};

const mockSignUp = async (
  email: string, 
  password: string, 
  name: string, 
  businessName: string, 
  currency: string
): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is just a mock response
  return {
    id: '2',
    email,
    name,
    businessName,
    currency
  };
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  socialSignIn: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on mount
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // In a real app, check for a stored token/session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run on web platform
    if (Platform.OS === 'web') {
      checkUserAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await mockSignIn(email, password);
      setUser(user);
      
      // In a real app, store the token/session
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    businessName: string, 
    currency: string
  ) => {
    setIsLoading(true);
    try {
      const user = await mockSignUp(email, password, name, businessName, currency);
      setUser(user);
      
      // In a real app, store the token/session
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    
    // In a real app, clear the token/session
    if (Platform.OS === 'web') {
      localStorage.removeItem('user');
    }
    
    router.replace('/auth');
  };

  const socialSignIn = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      // This would integrate with the social provider's SDK
      // For mock purposes, we'll just create a fake user
      const user = {
        id: '3',
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        businessName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Business`,
        currency: 'USD'
      };
      
      setUser(user);
      
      // In a real app, store the token/session
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        socialSignIn,
      }}>
      {children}
    </AuthContext.Provider>
  );
};