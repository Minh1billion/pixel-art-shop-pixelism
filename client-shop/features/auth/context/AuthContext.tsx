"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../services/auth.service";
import type { AuthResponse } from "../types";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const cachedUser = AuthService.getCurrentUser();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
      }

      try {
        const freshUser = await AuthService.fetchCurrentUser();
        setUser(freshUser);
      } catch {
        setUser(null);
        if (cachedUser) {
          router.replace("/");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      router.replace("/");
    };

    window.addEventListener("auth:logout", handleForceLogout);
    return () => window.removeEventListener("auth:logout", handleForceLogout);
  }, [router]);

  const refreshUser = async () => {
    try {
      const freshUser = await AuthService.fetchCurrentUser();
      setUser(freshUser);
    } catch {
      setUser(null);
    }
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
      value={{ user, isAuthenticated: !!user, loading, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}