"use client";

import { useState } from "react";
import { HiOutlineSquares2X2, HiOutlineBars3 } from "react-icons/hi2";
import SpriteCard from "./SpriteCard";
import type { SpriteListResponse } from "@/features/sprite/types";

type ViewMode = "grid" | "list";

interface SpriteGridProps {
  sprites: SpriteListResponse[];
  loading: boolean;
  error: string | null;
  onEdit?: (sprite: SpriteListResponse) => void;
  onDelete?: (sprite: SpriteListResponse) => void;
}

export default function SpriteGrid({ sprites, loading, error, onEdit, onDelete }: SpriteGridProps) {
  const [view, setView] = useState<ViewMode>("grid");

  const toolbar = (
    <div className="flex items-center justify-end mb-4">
      <div className="flex items-center gap-1 bg-neutral-900 border border-green-900/20 rounded-lg p-1">
        <button
          onClick={() => setView("grid")}
          className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-green-500/20" : "hover:bg-white/5"}`}
          aria-label="Grid view"
        >
          <HiOutlineSquares2X2 className={`w-4 h-4 transition-colors ${view === "grid" ? "text-green-400" : "text-gray-500"}`} />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-green-500/20" : "hover:bg-white/5"}`}
          aria-label="List view"
        >
          <HiOutlineBars3 className={`w-4 h-4 transition-colors ${view === "list" ? "text-green-400" : "text-gray-500"}`} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        {toolbar}
        {view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="bg-neutral-900 border border-green-900/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-neutral-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-3/4" />
                  <div className="h-2.5 bg-neutral-800 rounded w-1/2" />
                  <div className="h-7 bg-neutral-800 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-neutral-900 border border-green-900/10 rounded-2xl p-3 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-neutral-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-800 rounded w-1/3" />
                  <div className="h-2.5 bg-neutral-800 rounded w-1/4" />
                </div>
                <div className="h-7 w-16 bg-neutral-800 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {toolbar}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (sprites.length === 0) {
    return (
      <div>
        {toolbar}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-gray-500 text-sm">No sprites found. Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toolbar}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {sprites.map((sprite, index) => (
            <SpriteCard key={sprite.id} sprite={sprite} view="grid" index={index} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sprites.map((sprite) => (
            <SpriteCard key={sprite.id} sprite={sprite} view="list" onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}