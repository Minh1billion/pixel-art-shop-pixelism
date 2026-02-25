"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import SpriteDetail from "@/features/sprite/components/SpriteDetail";
import type { SpriteResponse } from "@/features/sprite/types";

export default function SpriteDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [sprite, setSprite] = useState<SpriteResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSprite = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await SpriteService.getById(id);
            setSprite(data);
        } catch (e: any) {
            setError(e.message ?? "Failed to load sprite.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSprite();
    }, [fetchSprite]);

    return (
        <SpriteDetail
            sprite={sprite}
            loading={loading}
            error={error}
            onBack={() => router.back()}
            onDeleted={() => router.push("/gallery")}
            onRefresh={fetchSprite}
        />
    );
}