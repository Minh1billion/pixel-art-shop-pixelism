"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { HiOutlineCamera } from "react-icons/hi2";
import { useUpdateAvatar } from "../hooks/useUpdateAvatar";

interface AvatarEditorProps {
  src?: string | null;
  username: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function AvatarEditor({ src, username, onSuccess, onError }: AvatarEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgErrored, setImgErrored] = useState(false);
  const { updateAvatar, loading } = useUpdateAvatar();

  const imgSrc = imgErrored || !src ? "/placeholder.png" : src;

  const handleFileSelect = async (file: File) => {
    try {
      await updateAvatar(file);
      onSuccess("✦ Visage rebound to the realm");
    } catch (e: any) {
      onError(e.message ?? "Failed to bind visage");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-linear-to-br from-green-400/20 via-transparent to-green-400/10 blur-sm" />
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-green-400/30 ring-2 ring-green-400/10 ring-offset-2 ring-offset-neutral-950">
          <Image
            key={imgSrc}
            src={imgSrc}
            alt={username}
            fill
            className="object-cover"
            onError={() => setImgErrored(true)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          >
            <HiOutlineCamera className="w-5 h-5 text-green-400" />
            <span className="text-[9px] text-green-300 tracking-widest uppercase">
              {loading ? "Binding..." : "Rebind"}
            </span>
          </button>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
      />
      <div className="text-center w-full">
        <p className="text-white font-bold text-base truncate max-w-full">{username}</p>
        <p className="text-green-400/50 text-[10px] tracking-[0.25em] uppercase">
          Adventurer of the Realm
        </p>
      </div>
    </div>
  );
}