"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { HiHome, HiShoppingBag, HiPhoto, HiUser, HiDocumentText } from "react-icons/hi2";
import { HiShoppingCart, HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "/home",    label: "Home",    icon: <HiHome    className="w-3.5 h-3.5" /> },
  { href: "/store",   label: "Store",   icon: <HiShoppingBag className="w-3.5 h-3.5" /> },
  { href: "/gallery", label: "Gallery", icon: <HiPhoto   className="w-3.5 h-3.5" /> },
  { href: "/profile", label: "Profile", icon: <HiUser    className="w-3.5 h-3.5" /> },
  { href: "/docs",    label: "Docs",    icon: <HiDocumentText className="w-3.5 h-3.5" /> },
];

export function Header() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-green-400/10">
      {/* ── ROW 1: Logo + User controls ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 bg-white/5 rounded-md p-0.5 border border-green-400/20">
            <Image
              src="/pixelism.png"
              alt="Pixelism"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-white font-black tracking-tight text-sm sm:text-base">PIXELISM</span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Cart — desktop */}
          <Link
            href="/cart"
            className={`hidden sm:flex relative items-center justify-center w-8 h-8 rounded-lg border transition-all ${
              pathname === "/cart"
                ? "border-green-400/40 bg-green-400/10 text-green-400"
                : "border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
            }`}
            aria-label="Cart"
          >
            <HiShoppingCart className="w-4 h-4" />
            {/* Replace 0 with real cart count from your store */}
            <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-green-400 text-neutral-950 text-[9px] font-black flex items-center justify-center leading-none">
              0
            </span>
          </Link>

          {/* User section — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-neutral-800" />
            <div className="w-7 h-7 rounded-full bg-green-950 border border-green-400/30 flex items-center justify-center shrink-0">
              <span className="text-green-300 text-[11px] font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-white leading-none whitespace-nowrap max-w-70 truncate">
              {user?.fullName}
            </span>
            <button
              onClick={logout}
              disabled={logoutLoading}
              className="text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 py-1 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap"
            >
              {logoutLoading ? "..." : "Logout"}
            </button>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="sm:hidden flex items-center gap-1.5">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-800 text-neutral-400"
              aria-label="Cart"
            >
              <HiShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-green-400 text-neutral-950 text-[9px] font-black flex items-center justify-center leading-none">
                0
              </span>
            </Link>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-800 text-neutral-400"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX className="w-4 h-4" /> : <HiMenu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Nav links (desktop only) ── */}
      <div className="hidden sm:block border-t border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-0.5 h-10 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-green-400/10 text-green-400 border border-green-400/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.icon}
                  {link.label}
                  {isActive && <span className="w-1 h-1 rounded-full bg-green-400 ml-0.5" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-full bg-green-950 border border-green-400/30 flex items-center justify-center shrink-0">
              <span className="text-green-300 text-sm font-bold">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-green-400">@{user?.username}</p>
            </div>
          </div>

          {/* Nav links grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-green-400/10 text-green-400 border border-green-400/20"
                      : "text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
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