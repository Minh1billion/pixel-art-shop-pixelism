"use client";

import { useState } from "react";
import { UserService, type UpdateProfilePayload } from "../services/user.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useUpdateProfile() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      setLoading(true);
      setError(null);
      await UserService.updateProfile(payload);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}