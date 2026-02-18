"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/features/shared/components/ProtectedRoute";
import { useAuth, useLogout } from "@/features/auth/hooks";
import { AuthService } from "@/features/auth/services/auth.service";

function HomeContent() {
  const { user, refreshUser } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        try {
          await AuthService.fetchCurrentUser();
          refreshUser();
        } catch (err) {
          console.error("Failed to fetch user");
        }
      }
      
      setInitializing(false);
    };

    initUser();
  }, [refreshUser]);

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-neutral-400 mt-2">@{user?.username}</p>
          </div>
          
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="px-6 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition disabled:opacity-50"
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="text-xl font-semibold mb-2">Your Collections</h3>
            <p className="text-neutral-400">Browse your saved pixel art</p>
          </div>
          
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="text-xl font-semibold mb-2">Discover</h3>
            <p className="text-neutral-400">Explore new sprites</p>
          </div>
          
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
            <h3 className="text-xl font-semibold mb-2">Upload</h3>
            <p className="text-neutral-400">Share your creations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}