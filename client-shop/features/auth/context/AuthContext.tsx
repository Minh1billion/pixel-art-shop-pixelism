"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "../services/auth.service";
import type { AuthResponse } from "../types";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      let currentUser = AuthService.getCurrentUser();

      if (!currentUser && pathname === "/home") {
        try {
          currentUser = await AuthService.fetchCurrentUser();
        } catch (err) {
          console.error("Failed to fetch user");
          router.push("/");
          setLoading(false);
          return;
        }
      }

      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, [pathname, router]);

  const refreshUser = () => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        refreshUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}