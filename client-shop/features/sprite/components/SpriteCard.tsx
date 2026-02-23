"use client";

import type { SpriteListResponse } from "@/features/sprite/types";

interface SpriteCardProps {
  sprite: SpriteListResponse;
  view?: "grid" | "list";
  onEdit?: (sprite: SpriteListResponse) => void;
}

export default function SpriteCard({ sprite, view = "grid", onEdit }: SpriteCardProps) {
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
          {sprite.imageUrl ? (
            <img
              src={sprite.imageUrl}
              alt={sprite.name}
              className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xl">🎮</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-semibold truncate group-hover:text-green-300 transition-colors">
            {sprite.name}
          </h3>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(sprite)}
              className="text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Edit
            </button>
          )}
          <button className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Get
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-neutral-900 border border-green-900/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/20">
      <div
        className="aspect-square relative overflow-hidden"
        style={{
          backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
          backgroundSize: "14px 14px",
        }}
      >
        {sprite.imageUrl ? (
          <img
            src={sprite.imageUrl}
            alt={sprite.name}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🎮</div>
        )}

        {/* Edit button overlay - chỉ hiện khi có onEdit */}
        {onEdit && (
          <button
            onClick={() => onEdit(sprite)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white text-sm font-semibold truncate group-hover:text-green-300 transition-colors">
          {sprite.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <button className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-lg transition-colors">
            Get
          </button>
        </div>
      </div>
    </div>
  );
}