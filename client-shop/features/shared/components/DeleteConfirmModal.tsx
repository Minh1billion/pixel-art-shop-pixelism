"use client";

import Image from "next/image";
import { useEffect } from "react";
import { HiOutlineTrash, HiOutlineExclamationTriangle } from "react-icons/hi2";
import type { DeleteTarget } from "../hooks/useDeleteConfirm";

interface DeleteConfirmModalProps {
    target: DeleteTarget | null;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({
    target,
    loading = false,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onCancel();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [loading, onCancel]);

    if (!target) return null;

    const isHard = target.mode === "hard";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                onClick={!loading ? onCancel : undefined}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-xs bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

                    {/* Top accent line */}
                    <div className={`h-0.5 w-full ${isHard ? "bg-red-500" : "bg-amber-500/60"}`} />

                    <div className="p-5">
                        {/* Icon + Title */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                                isHard
                                    ? "bg-red-500/10 border border-red-500/20"
                                    : "bg-amber-500/10 border border-amber-500/20"
                            }`}>
                                {isHard
                                    ? <HiOutlineTrash className="w-4 h-4 text-red-400" />
                                    : <HiOutlineExclamationTriangle className="w-4 h-4 text-amber-400" />
                                }
                            </div>
                            <div>
                                <h3 className="text-white text-sm font-semibold">
                                    {isHard ? "Delete permanently?" : "Move to trash?"}
                                </h3>
                                <p className="text-gray-500 text-[11px] mt-0.5">
                                    {isHard
                                        ? "This action cannot be undone."
                                        : "You can restore it from trash within 30 days."}
                                </p>
                            </div>
                        </div>

                        {/* Sprite preview */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900 border border-neutral-800 mb-5">
                            <div
                                className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0"
                                style={{
                                    backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                                    backgroundSize: "8px 8px",
                                }}
                            >
                                {target.sprite.imageUrl ? (
                                    <Image
                                        src={target.sprite.imageUrl}
                                        alt={target.sprite.name}
                                        fill
                                        className="object-contain p-1.5"
                                        style={{ imageRendering: "pixelated" }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-base">🎮</div>
                                )}
                            </div>
                            <p className="text-white text-xs font-medium truncate">{target.sprite.name}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-gray-400 hover:text-white transition-all disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 ${
                                    isHard
                                        ? "bg-red-500/90 hover:bg-red-500 text-white border border-red-500/50"
                                        : "bg-amber-500/90 hover:bg-amber-500 text-black border border-amber-500/50"
                                }`}
                            >
                                {loading ? (
                                    <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <HiOutlineTrash className="w-3.5 h-3.5" />
                                        {isHard ? "Delete forever" : "Move to trash"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}