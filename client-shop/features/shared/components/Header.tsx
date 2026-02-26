"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { HiHome, HiShoppingBag, HiPhoto, HiUser, HiDocumentText } from "react-icons/hi2";
import { HiShoppingCart, HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "/home",    label: "Kingdom",   icon: <HiHome         className="w-3.5 h-3.5" /> },
  { href: "/store",   label: "Bazaar",    icon: <HiShoppingBag  className="w-3.5 h-3.5" /> },
  { href: "/gallery", label: "Sanctum",   icon: <HiPhoto        className="w-3.5 h-3.5" /> },
  { href: "/profile", label: "Chronicle", icon: <HiUser         className="w-3.5 h-3.5" /> },
  { href: "/docs",    label: "Grimoire",  icon: <HiDocumentText className="w-3.5 h-3.5" /> },
];

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/placeholder.png");

  useEffect(() => {
    setImgSrc(src || "/placeholder.png");
  }, [src]);

  return (
    <div className="relative shrink-0 overflow-hidden rounded-full border border-green-400/30 bg-green-950 transition-all duration-300 w-7 h-7">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImgSrc("/placeholder.png")}
      />
    </div>
  );
}

export function Header() {
  const { user } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-green-400/10 transition-all duration-300 ease-in-out ${
        scrolled ? "shadow-lg shadow-black/40" : ""
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
          scrolled ? "h-10" : "h-14"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div
            className={`bg-white/5 rounded-md border border-green-400/20 transition-all duration-300 overflow-hidden ${
              scrolled ? "w-6 h-6 p-px" : "w-7 h-7 p-0.5"
            }`}
          >
            <Image
              src="/pixelism.png"
              alt="Pixelism"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span
            className={`text-white font-black tracking-tight transition-all duration-300 ${
              scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            PIXELISM
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-neutral-800" />
            <Avatar src={user?.avatarUrl} alt={user?.fullName ?? "User"} />
            <span
              className={`font-medium text-white leading-none whitespace-nowrap max-w-45 truncate transition-all duration-300 ${
                scrolled ? "text-xs" : "text-sm"
              }`}
            >
              {user?.fullName}
            </span>
            <button
              onClick={logout}
              disabled={logoutLoading}
              className={`text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 px-3 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap ${
                scrolled ? "text-[10px] py-0.5" : "text-xs py-1"
              }`}
            >
              {logoutLoading ? "..." : "Logout"}
            </button>
          </div>

          <div className="sm:hidden flex items-center gap-1.5">
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

      <div
        className={`hidden sm:block border-t border-neutral-800/50 overflow-hidden transition-all duration-300 ease-in-out ${
          scrolled ? "max-h-0 opacity-0 border-transparent" : "max-h-12 opacity-100"
        }`}
      >
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

      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
            <Avatar src={user?.avatarUrl} alt={user?.fullName ?? "User"} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-green-400">@{user?.username}</p>
            </div>
          </div>

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