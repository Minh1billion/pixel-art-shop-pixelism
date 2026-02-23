"use client";

import { useState } from "react";
import { SpriteService } from "../services/sprite.service";
import type { SpriteRequest, SpriteResponse } from "@/features/sprite/types";

interface UseSavingSpriteOptions {
    onSuccess?: (sprite: SpriteResponse) => void;
}

export function useSavingSprite({ onSuccess }: UseSavingSpriteOptions = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async (
        data: SpriteRequest,
        image: File | null,
        editingId?: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            const result = editingId
                ? await SpriteService.update(editingId, data, image ?? undefined)
                : await SpriteService.create(data, image!);

            onSuccess?.(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { save, loading, error };
}