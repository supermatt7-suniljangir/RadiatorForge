"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { logout as logoutService } from "@/features/auth/logout";
import { toast } from "@/hooks/use-toast";
import { getProfileService } from "@/services/clientServices/profile/ProfileService";
import { User } from "@/types/user";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const { data } = await getProfileService();

      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refreshUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
  }, []);

  const value = useMemo(() => {
    return {
      logout,
      isLoading,
      setUser,
      user,
      setIsLoading,
      refreshUser,
    };
  }, [user, isLoading, refreshUser, logout]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
