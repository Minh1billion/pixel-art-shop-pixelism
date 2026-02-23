"use client";

import { useState, useEffect } from "react";
import { UserService } from "../services/user.service";
import type { UserListResponse } from "@/features/user/types";
import type { PageResponse } from "@/features/shared/components/types";

export function useUsers(keyword: string, page: number, size: number) {
  const [data, setData] = useState<PageResponse<UserListResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await UserService.getAll(keyword, page, size);
        if (!controller.signal.aborted) setData(result);
      } catch (err: any) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetch();
    return () => controller.abort();
  }, [keyword, page, size]);

  return { data, loading, error };
}