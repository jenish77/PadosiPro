import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, SelectedTask } from '../types';
import { apiClient } from '../api/client';
import { saveToken, saveTokens, getToken, removeToken, removeTokens, saveUserData, getUserData, removeUserData } from '../storage/token.storage';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  unverifiedEmail: string | null;
  resendCooldown: number;
  selectedTasks: SelectedTask[];
  register: (email: string, password: string) => Promise<any>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  saveProfile: (profileData: UserProfile) => Promise<void>;
  saveTaskSelections: (taskIds: string[]) => Promise<void>;
  fetchUserStatus: () => Promise<void>;
  setUnverifiedEmail: (email: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([]);

  useEffect(() => {
    let isMounted = true;

    // Safety Timeout: Guarantee the app leaves splash loading in max 1.5s
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsInitializing(false);
      }
    }, 1500);

    const initializeAuth = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken && isMounted) {
          setToken(storedToken);
          try {
            const response = await apiClient.get('/auth/me');
            if (response.data?.success && response.data?.data && isMounted) {
              const userData = response.data.data;
              setUser({
                id: userData.id,
                email: userData.email,
                isVerified: userData.isVerified,
                hasCompletedProfile: userData.hasCompletedProfile,
                profile: userData.profile,
              });
              if (userData.selectedTasks) {
                setSelectedTasks(userData.selectedTasks);
              }
            }
          } catch (apiErr) {
            console.log('API auth check failed:', apiErr);
          }
        }
      } catch (error) {
        console.log('Session restoration failed:', error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
          clearTimeout(safetyTimer);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', { email, password });
      const data = response.data?.data;
      setUnverifiedEmail(email);
      setResendCooldown(data?.cooldownSeconds || 30);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, code });
      const data = response.data?.data;
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;

      if (accessToken) {
        setToken(accessToken);
        if (refreshToken) {
          await saveTokens(accessToken, refreshToken);
        } else {
          await saveToken(accessToken);
        }
        setUser(data.user);
        await saveUserData(data.user);
        setUnverifiedEmail(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/resend-otp', { email });
      setResendCooldown(response.data?.data?.cooldownSeconds || 30);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data?.data;

      if (data?.isVerified === false) {
        setUnverifiedEmail(email);
        setResendCooldown(data.cooldownSeconds || 30);
        return { isVerified: false };
      }

      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;

      if (accessToken) {
        setToken(accessToken);
        if (refreshToken) {
          await saveTokens(accessToken, refreshToken);
        } else {
          await saveToken(accessToken);
        }
        setUser(data.user);
        await saveUserData(data.user);
        return { isVerified: true, user: data.user };
      }
    } finally {
      setIsLoading(false);
    }
  };


  const saveProfile = async (profileData: UserProfile) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/profile', profileData);
      const savedProfile = response.data?.data;
      setUser((prev) => (prev ? { ...prev, hasCompletedProfile: true, profile: savedProfile } : null));
    } finally {
      setIsLoading(false);
    }
  };

  const saveTaskSelections = async (taskIds: string[]) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/tasks/select', { taskIds });
      const savedSelections = response.data?.data || [];
      setSelectedTasks(savedSelections);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data?.success && response.data?.data) {
        const userData = response.data.data;
        setUser({
          id: userData.id,
          email: userData.email,
          isVerified: userData.isVerified,
          hasCompletedProfile: userData.hasCompletedProfile,
          profile: userData.profile,
        });
        if (userData.selectedTasks) {
          setSelectedTasks(userData.selectedTasks);
        }
      }
    } catch (e) {
      console.log('Error refreshing user status:', e);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setSelectedTasks([]);
    setUnverifiedEmail(null);
    await removeTokens();
    await removeUserData();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isInitializing,
        unverifiedEmail,
        resendCooldown,
        selectedTasks,
        register,
        verifyOtp,
        resendOtp,
        login,
        saveProfile,
        saveTaskSelections,
        fetchUserStatus,
        setUnverifiedEmail,
        logout,
      }}
    >
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
