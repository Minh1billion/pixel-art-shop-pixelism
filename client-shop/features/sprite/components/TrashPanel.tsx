"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineTrash, HiOutlineArrowPath, HiXMark } from "react-icons/hi2";
import { useTrashSprites } from "@/features/sprite/hooks/useTrashSprites";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import type { SpriteListResponse } from "@/features/sprite/types";

interface TrashPanelProps {
    open: boolean;
    onClose: () => void;
    onRestored?: () => void;
}

export default function TrashPanel({ open, onClose, onRestored }: TrashPanelProps) {
    const [page, setPage] = useState(0);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [confirmHardDelete, setConfirmHardDelete] = useState<string | null>(null);

    const { data, loading, error, refresh } = useTrashSprites(page, 20, open);

    const handleRestore = async (sprite: SpriteListResponse) => {
        try {
            setLoadingId(sprite.id);
            await SpriteService.restoreById(sprite.id);
            refresh();
            onRestored?.();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleHardDelete = async (sprite: SpriteListResponse) => {
        try {
            setLoadingId(sprite.id);
            await SpriteService.hardDeleteById(sprite.id);
            setConfirmHardDelete(null);
            refresh();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    const sprites = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full z-50 w-full max-w-sm bg-neutral-950 border-l border-green-900/20 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-green-900/20 shrink-0">
                    <div className="flex items-center gap-2">
                        <HiOutlineTrash className="w-4 h-4 text-red-400" />
                        <h2 className="text-white font-semibold text-sm tracking-wide">Trash</h2>
                        {data && (
                            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                                {data.totalElements}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <HiXMark className="w-4 h-4" />
                    </button>
                </div>

                {/* Info banner */}
                <div className="px-5 py-3 bg-red-500/5 border-b border-red-500/10 shrink-0">
                    <p className="text-[11px] text-red-400/70">
                        Items in trash are automatically deleted after 30 days.
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {loading && (
                        <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 animate-pulse"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-neutral-800 shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-neutral-800 rounded w-2/3" />
                                        <div className="h-2.5 bg-neutral-800 rounded w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && sprites.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="text-4xl mb-3">🗑️</div>
                            <p className="text-gray-500 text-sm">Trash is empty</p>
                        </div>
                    )}

                    {!loading && sprites.map((sprite) => {
                        const isLoading = loadingId === sprite.id;
                        const isConfirming = confirmHardDelete === sprite.id;

                        return (
                            <div
                                key={sprite.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-green-900/10 hover:border-green-900/20 transition-colors"
                            >
                                {/* Thumbnail */}
                                <div
                                    className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0"
                                    style={{
                                        backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                                        backgroundSize: "8px 8px",
                                    }}
                                >
                                    {sprite.imageUrl ? (
                                        <Image
                                            src={sprite.imageUrl}
                                            alt={sprite.name}
                                            fill
                                            className="object-contain p-1.5"
                                            style={{ imageRendering: "pixelated" }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-lg">🎮</div>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-xs font-medium truncate">{sprite.name}</p>
                                    <p className="text-gray-600 text-[10px] mt-0.5">
                                        Deleted {new Date(sprite.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="shrink-0 flex items-center gap-1">
                                    {isConfirming ? (
                                        <>
                                            <button
                                                onClick={() => handleHardDelete(sprite)}
                                                disabled={isLoading}
                                                className="text-[10px] bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? "..." : "Delete"}
                                            </button>
                                            <button
                                                onClick={() => setConfirmHardDelete(null)}
                                                disabled={isLoading}
                                                className="text-[10px] bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-400 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleRestore(sprite)}
                                                disabled={isLoading}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20 transition-colors disabled:opacity-50"
                                                aria-label="Restore"
                                                title="Restore"
                                            >
                                                {isLoading ? (
                                                    <span className="text-[10px]">...</span>
                                                ) : (
                                                    <HiOutlineArrowPath className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setConfirmHardDelete(sprite.id)}
                                                disabled={isLoading}
                                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-50"
                                                aria-label="Delete permanently"
                                                title="Delete permanently"
                                            >
                                                <HiOutlineTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-green-900/20 shrink-0">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            ← Prev
                        </button>
                        <span className="text-xs text-gray-600">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}