"use client";

import { useState } from "react";
import { UserService } from "../services/user.service";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useUpdateAvatar() {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAvatar = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      await UserService.updateAvatar(file);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAvatar, loading, error };
}