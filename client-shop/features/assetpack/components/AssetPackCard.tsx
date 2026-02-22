"use client";

import type { AssetPackResponse } from "@/features/assetpack/types";

interface AssetPackCardProps {
    pack: AssetPackResponse;
    view?: "grid" | "list";
}

export default function AssetPackCard({ pack, view = "grid" }: AssetPackCardProps) {
    if (view === "list") {
        return (
            <div className="group flex items-center gap-4 bg-neutral-900 border border-green-900/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 p-3">
                {/* Thumbnail */}
                <div
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden relative"
                    style={{
                        backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                        backgroundSize: "10px 10px",
                    }}
                >
                    {pack.imageUrl ? (
                        <img
                            src={pack.imageUrl}
                            alt={pack.name}
                            className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                            style={{ imageRendering: "pixelated" }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xl">📦</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white text-sm font-semibold truncate group-hover:text-green-300 transition-colors">
                            {pack.name}
                        </h3>
                        {pack.price === 0 && (
                            <span className="shrink-0 bg-green-500 text-green-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                FREE
                            </span>
                        )}
                    </div>

                    {pack.categoryNames?.length > 0 && (
                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                            {pack.categoryNames.join(", ")}
                        </p>
                    )}

                    {/* Sprite count badge */}
                    <p className="text-gray-600 text-xs mt-1">
                        {pack.spriteCount} sprite{pack.spriteCount !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Price + Action */}
                <div className="shrink-0 flex items-center gap-3">
                    <span className="text-green-400 font-bold text-sm">
                        {pack.price === 0 ? "Free" : `$${pack.price.toFixed(2)}`}
                    </span>
                    <button className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                        Get Pack
                    </button>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div className="group bg-neutral-900 border border-green-900/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/20">
            {/* Cover image */}
            <div
                className="aspect-square relative overflow-hidden"
                style={{
                    backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                    backgroundSize: "14px 14px",
                }}
            >
                {pack.imageUrl ? (
                    <img
                        src={pack.imageUrl}
                        alt={pack.name}
                        className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                        style={{ imageRendering: "pixelated" }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">📦</div>
                )}

                {/* FREE badge */}
                {pack.price === 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-green-500 text-green-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        FREE
                    </div>
                )}

                {/* Sprite count badge */}
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                    {pack.spriteCount} sprites
                </div>

                {/* Sprite preview strip — show up to 4 thumbnails on hover */}
                {pack.sprites.length > 0 && (
                    <div className="absolute bottom-0 inset-x-0 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 backdrop-blur-sm p-1.5 gap-1.5">
                        {pack.sprites.slice(0, 4).map((s) => (
                            <div
                                key={s.id}
                                className="w-8 h-8 rounded-md overflow-hidden shrink-0"
                                style={{
                                    backgroundImage:
                                        "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
                                    backgroundSize: "6px 6px",
                                }}
                            >
                                <img
                                    src={s.imageUrl}
                                    alt={s.name}
                                    className="w-full h-full object-contain"
                                    style={{ imageRendering: "pixelated" }}
                                />
                            </div>
                        ))}
                        {pack.sprites.length > 4 && (
                            <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="text-[9px] text-gray-400">+{pack.sprites.length - 4}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-white text-sm font-semibold truncate group-hover:text-green-300 transition-colors">
                    {pack.name}
                </h3>

                {pack.categoryNames?.length > 0 && (
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                        {pack.categoryNames.join(", ")}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <span className="text-green-400 font-bold text-sm">
                        {pack.price === 0 ? "Free" : `$${pack.price.toFixed(2)}`}
                    </span>
                    <button className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-lg transition-colors">
                        Get Pack
                    </button>
                </div>
            </div>
        </div>
    );
}