"use client";

import Image from "next/image";
import { useAuth, useLogout } from "@/features/auth/hooks";

export function Header() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  return (
    <header className="sticky top-0 z-50 border-b border-green-400/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-white/5 rounded-lg p-1 border border-green-400/20">
            <Image
              src="/pixelism.png"
              alt="Pixelism"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-white font-black tracking-tight text-lg">PIXELISM</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{user?.fullName}</p>
            <p className="text-xs text-green-400 mt-0.5">@{user?.username}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-950 border border-green-400/30 flex items-center justify-center">
            <span className="text-green-300 text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-4 py-1.5 rounded-lg transition-all disabled:opacity-40"
          >
            {logoutLoading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}