"use client";

import { useState, useEffect, useMemo } from "react";
import { SpriteService } from "../services/sprite.service";
import { useDebounced } from "@/features/shared/hooks/useDebounced";
import type { SpriteFilterRequest, SpriteListResponse } from "@/features/sprite/types";
import type { PageResponse } from "@/features/shared/components/types";

export function useSprites(
  filter: SpriteFilterRequest,
  page: number,
  size: number,
  enabled = true
) {
  const [data, setData] = useState<PageResponse<SpriteListResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = () => setTick((t) => t + 1);

  const debouncedKeyword = useDebounced(filter.keyword);

  const stableFilter = useMemo<SpriteFilterRequest>(() => ({
    ...filter,
    keyword: debouncedKeyword,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [debouncedKeyword, filter.categoryIds, filter.sortBy, filter.sortOrder]);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    const fetchSprites = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await SpriteService.getSprites(stableFilter, page, size);
        if (!controller.signal.aborted) setData(result);
      } catch (err: any) {
        if (!controller.signal.aborted) setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchSprites();
    return () => controller.abort();
  }, [stableFilter, page, size, tick, enabled]);

  return { data, loading, error, refresh };
}