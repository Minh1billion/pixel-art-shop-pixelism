"use client";

import { useState, useEffect } from "react";
import { SpriteService } from "../services/sprite.service";
import type { SpriteFilterRequest, SpriteListResponse } from "@/features/sprite/types";
import type { PageResponse } from "@/features/shared/components/types";

export function useSpritesByUser(userId: string, filter: SpriteFilterRequest, page: number, size: number) {
    const [data, setData] = useState<PageResponse<SpriteListResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refresh = () => setTick((t) => t + 1);

    useEffect(() => {
        if (!userId) return;
        const controller = new AbortController();

        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await SpriteService.getSpritesByUser(userId, filter, page, size);
                if (!controller.signal.aborted) setData(result);
            } catch (err: any) {
                if (!controller.signal.aborted) setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [userId, filter, page, size, tick]);

    return { data, loading, error, refresh };
}