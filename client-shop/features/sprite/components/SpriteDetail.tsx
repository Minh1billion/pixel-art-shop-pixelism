"use client";

import Image from "next/image";
import { useState } from "react";
import {
    HiOutlineArrowLeft,
    HiOutlinePencilSquare,
    HiOutlineTrash,
    HiOutlineArrowDownTray,
    HiOutlineLink,
    HiOutlineCheck,
    HiOutlineTag,
    HiOutlineUser,
    HiOutlineCalendar,
    HiOutlinePhoto,
} from "react-icons/hi2";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SpriteService } from "@/features/sprite/services/sprite.service";
import SavingSpriteForm from "@/features/sprite/components/SavingSpriteForm";
import type { SpriteResponse, SpriteListResponse } from "@/features/sprite/types";

interface SpriteDetailProps {
    sprite: SpriteResponse | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onDeleted: () => void;
    onRefresh: () => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function Skeleton() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">
                <div className="w-24 h-8 rounded-lg bg-neutral-900 animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="aspect-square rounded-2xl bg-neutral-900 animate-pulse" />
                    <div className="space-y-5">
                        <div className="h-8 w-3/4 rounded-lg bg-neutral-900 animate-pulse" />
                        <div className="h-4 w-1/2 rounded bg-neutral-900 animate-pulse" />
                        <div className="flex gap-2 mt-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-6 w-20 rounded-full bg-neutral-900 animate-pulse" />
                            ))}
                        </div>
                        <div className="space-y-3 pt-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-12 rounded-xl bg-neutral-900 animate-pulse" />
                            ))}
                        </div>
                        <div className="flex gap-3 pt-4">
                            <div className="flex-1 h-10 rounded-xl bg-neutral-900 animate-pulse" />
                            <div className="flex-1 h-10 rounded-xl bg-neutral-900 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SpriteDetail({
    sprite,
    loading,
    error,
    onBack,
    onDeleted,
    onRefresh,
}: SpriteDetailProps) {
    const { user } = useAuth();

    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const isAdmin = user?.role === "ADMIN";
    const isOwner = user?.username === sprite?.createdBy;
    const canEdit = isOwner || isAdmin;
    const canDelete = isOwner || isAdmin;

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* silent */
        }
    };

    const handleDownload = async () => {
        if (!sprite) return;
        try {
            const res = await fetch(sprite.imageUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${sprite.slug ?? sprite.name}.png`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert("Download failed. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (!sprite) return;
        if (!confirm(`Delete "${sprite.name}"? This will move it to trash.`)) return;
        setDeleting(true);
        try {
            await SpriteService.deleteById(sprite.id);
            onDeleted();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <Skeleton />;

    if (error || !sprite) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-4">
                <div className="text-5xl">⚠️</div>
                <p className="text-slate-400 text-sm">{error ?? "Sprite not found."}</p>
                <button
                    onClick={onBack}
                    className="mt-2 px-4 py-2 rounded-lg text-sm border border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-600 transition-all"
                >
                    ← Back to Gallery
                </button>
            </div>
        );
    }

    const spriteForEdit: SpriteListResponse = {
        id: sprite.id,
        name: sprite.name,
        slug: sprite.slug,
        imageUrl: sprite.imageUrl,
        createdAt: sprite.createdAt,
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto">

                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                        <HiOutlineArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Gallery
                    </button>
                    <span className="text-neutral-700">/</span>
                    <span className="text-sm text-gray-500 truncate max-w-xs">{sprite.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                    <div className="relative group">
                        <div className="absolute inset-0 rounded-2xl bg-green-500/5 blur-xl scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-800/60 bg-neutral-900 flex items-center justify-center">
                            <div
                                className="absolute inset-0 opacity-40"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
                                    backgroundSize: "20px 20px",
                                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                                }}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <HiOutlinePhoto className="w-12 h-12 text-neutral-700 animate-pulse" />
                                </div>
                            )}
                            <Image
                                src={sprite.imageUrl}
                                alt={sprite.name}
                                fill
                                className={`object-contain p-8 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                                onLoad={() => setImageLoaded(true)}
                                unoptimized
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                {sprite.name}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1 font-mono">/{sprite.slug}</p>
                        </div>

                        {sprite.categoryNames.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {sprite.categoryNames.map((cat, i) => (
                                    <span
                                        key={sprite.categoryIds[i] ?? cat}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-300 border border-green-500/20"
                                    >
                                        <HiOutlineTag className="w-3 h-3" />
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/50 divide-y divide-neutral-800/60 overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <HiOutlineUser className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="text-xs text-gray-500 w-24 shrink-0">Created by</span>
                                <span className="text-sm text-white font-medium">{sprite.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <HiOutlineCalendar className="w-4 h-4 text-gray-500 shrink-0" />
                                <span className="text-xs text-gray-500 w-24 shrink-0">Created at</span>
                                <span className="text-sm text-white">{formatDate(sprite.createdAt)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors"
                            >
                                <HiOutlineArrowDownTray className="w-4 h-4" />
                                Download
                            </button>

                            <button
                                onClick={handleCopyUrl}
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                    copied
                                        ? "border-green-500/40 bg-green-500/10 text-green-300"
                                        : "border-neutral-700 bg-neutral-900 text-gray-300 hover:text-white hover:border-neutral-600"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <HiOutlineCheck className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineLink className="w-4 h-4" />
                                        Copy URL
                                    </>
                                )}
                            </button>

                            {canEdit && (
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-neutral-700 bg-neutral-900 text-gray-300 hover:text-white hover:border-neutral-600 transition-all"
                                >
                                    <HiOutlinePencilSquare className="w-4 h-4" />
                                    Edit
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-neutral-800 text-gray-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <HiOutlineTrash className="w-4 h-4" />
                                    {deleting ? "Deleting…" : "Delete"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SavingSpriteForm
                open={editOpen}
                editingSprite={spriteForEdit}
                onClose={() => setEditOpen(false)}
                onSaved={() => {
                    setEditOpen(false);
                    onRefresh();
                }}
            />
        </div>
    );
}