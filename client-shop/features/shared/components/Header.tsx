"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth, useLogout } from "@/features/auth/hooks";

export function Header() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-green-400/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 bg-white/5 rounded-lg p-1 border border-green-400/20 shrink-0">
            <Image
              src="/pixelism.png"
              alt="Pixelism"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-white font-black tracking-tight text-base sm:text-lg">PIXELISM</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white leading-none">{user?.fullName}</p>
            <p className="text-xs text-green-400 mt-0.5">@{user?.username}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-950 border border-green-400/30 flex items-center justify-center shrink-0">
            <span className="text-green-300 text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-4 py-1.5 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap"
          >
            {logoutLoading ? "..." : "Logout"}
          </button>
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-800 text-neutral-400"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-green-950 border border-green-400/30 flex items-center justify-center shrink-0">
              <span className="text-green-300 text-sm font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.fullName}</p>
              <p className="text-xs text-green-400">@{user?.username}</p>
            </div>
          </div>
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="w-full text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 text-left"
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </header>
  );
}