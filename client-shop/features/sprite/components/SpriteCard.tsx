"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import type { SpriteListResponse } from "@/features/sprite/types";

interface SpriteCardProps {
  sprite: SpriteListResponse;
  view?: "grid" | "list";
  onEdit?: (sprite: SpriteListResponse) => void;
  onDelete?: (sprite: SpriteListResponse) => void;
}

export default function SpriteCard({ sprite, view = "grid", onEdit, onDelete }: SpriteCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
    onDelete?.(sprite);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  if (view === "list") {
    return (
      <div className="group flex items-center gap-4 bg-neutral-900 border border-green-900/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 p-3">
        <div
          className="shrink-0 w-16 h-16 rounded-xl overflow-hidden relative"
          style={{
            backgroundImage: "repeating-conic-gradient(#1a1a1a 0% 25%, #232323 0% 50%)",
            backgroundSize: "10px 10px",
          }}
        >
          {sprite.imageUrl ? (
            <Image
              src={sprite.imageUrl}
              alt={sprite.name}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xl">🎮</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-semibold truncate group-hover:text-green-300 transition-colors">
            {sprite.name}
          </h3>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(sprite)}
              className="text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Edit
            </button>
          )}
          {onDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleConfirm}
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-gray-400 px-2 py-1.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="text-xs bg-neutral-800 hover:bg-red-500/10 border border-neutral-700 hover:border-red-500/30 text-gray-500 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                aria-label="Delete"
              >
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            )
          )}
          <button className="text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Get
          </button>
        </div>
      </div>
    );
  }

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
          <Image
            src={sprite.imageUrl}
            alt={sprite.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🎮</div>
        )}

        {/* Action buttons on hover */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(sprite)}
              className="bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            confirmDelete ? (
              <div className="flex gap-1">
                <button
                  onClick={handleConfirm}
                  className="bg-red-500/80 hover:bg-red-500 border border-red-500/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-gray-300 text-xs px-2 py-1 rounded-lg backdrop-blur-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                className="bg-neutral-900/80 hover:bg-red-500/20 border border-neutral-700 hover:border-red-500/40 text-gray-400 hover:text-red-400 p-1 rounded-lg backdrop-blur-sm transition-colors"
                aria-label="Delete"
              >
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
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