"use client";

import { useState, useCallback } from "react";
import type { SpriteListResponse } from "@/features/sprite/types";

export interface DeleteTarget {
    sprite: SpriteListResponse;
    mode: "soft" | "hard"; 
}

export function useDeleteConfirm() {
    const [target, setTarget] = useState<DeleteTarget | null>(null);

    const confirmSoftDelete = useCallback((sprite: SpriteListResponse) => {
        setTarget({ sprite, mode: "soft" });
    }, []);

    const confirmHardDelete = useCallback((sprite: SpriteListResponse) => {
        setTarget({ sprite, mode: "hard" });
    }, []);

    const dismiss = useCallback(() => {
        setTarget(null);
    }, []);

    return { target, confirmSoftDelete, confirmHardDelete, dismiss };
}