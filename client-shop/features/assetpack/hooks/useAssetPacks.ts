"use client";

import { useState, useEffect } from "react";
import { AssetPackService } from "../services/assetpack.service";
import type { AssetPackFilterRequest, AssetPackResponse } from "@/features/assetpack/types";
import type { PageResponse } from "@/features/shared/components/types";

export function useAssetPacks(
    filter: AssetPackFilterRequest,
    page: number,
    size: number
) {
    const [data, setData] = useState<PageResponse<AssetPackResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetch = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await AssetPackService.getAll(filter, page, size);
                if (!controller.signal.aborted) setData(result);
            } catch (err: any) {
                if (!controller.signal.aborted) setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [filter, page, size]);

    return { data, loading, error };
}