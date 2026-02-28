"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

import { GiCastle, GiShop, GiSpellBook, GiScrollUnfurled, GiSwordman } from "react-icons/gi";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "/home",    label: "Kingdom",   icon: <GiCastle         className="w-3.5 h-3.5" />, hint: "Return to the realm" },
  { href: "/store",   label: "Bazaar",    icon: <GiShop           className="w-3.5 h-3.5" />, hint: "Trade & acquire relics" },
  { href: "/gallery", label: "Sanctum",   icon: <GiSpellBook      className="w-3.5 h-3.5" />, hint: "Sacred visual archives" },
  { href: "/profile", label: "Chronicle", icon: <GiSwordman       className="w-3.5 h-3.5" />, hint: "Your legend & deeds" },
  { href: "/docs",    label: "Grimoire",  icon: <GiScrollUnfurled className="w-3.5 h-3.5" />, hint: "Ancient knowledge" },
];

// Small decorative rune divider
function RuneDivider() {
  return (
    <span className="text-green-400/20 text-[10px] select-none tracking-widest px-1">
      ✦
    </span>
  );
}

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);
  const imgSrc = errored ? "/placeholder.png" : src;

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setErrored(true)}
    />
  );
}

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-full border border-green-400/40 bg-green-950 ring-1 ring-green-400/10 ring-offset-1 ring-offset-neutral-950 transition-all duration-300 w-7 h-7">
      <AvatarImage key={src ?? "placeholder"} src={src || "/placeholder.png"} alt={alt} />
      {/* Subtle shimmer overlay for fantasy feel */}
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-green-300/10 to-transparent pointer-events-none" />
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
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-400/30 to-transparent pointer-events-none" />

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
          scrolled ? "h-10" : "h-14"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className={`bg-white/5 rounded-md border border-green-400/20 group-hover:border-green-400/40 transition-all duration-300 overflow-hidden ${
              scrolled ? "w-6 h-6 p-px" : "w-7 h-7 p-0.5"
            }`}
          >
            <Image
              src="/pixelism.webp"
              alt="Pixelism"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className={`text-white font-black tracking-tight transition-all duration-300 ${
                scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
              }`}
            >
              PIXELISM
            </span>
            {!scrolled && (
              <span className="text-green-400/50 text-[9px] tracking-[0.2em] uppercase font-medium hidden sm:block">
                ⚔ Realm of Pixels ⚔
              </span>
            )}
          </div>
        </Link>

        {/* Right: user info + logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-px h-4 bg-neutral-800" />
            <Avatar src={user?.avatarUrl} alt={user?.username ?? "Wanderer"} />
            <div className="flex flex-col leading-none">
              <span
                className={`font-medium text-white leading-none whitespace-nowrap max-w-45 truncate transition-all duration-300 ${
                  scrolled ? "text-xs" : "text-sm"
                }`}
              >
                {user?.username ?? "Wanderer"}
              </span>
              {!scrolled && (
                <span className="text-green-400/50 text-[9px] tracking-wide">
                  Adventurer
                </span>
              )}
            </div>
            <button
              onClick={logout}
              disabled={logoutLoading}
              className={`text-neutral-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-400/30 px-3 rounded-lg transition-all disabled:opacity-40 whitespace-nowrap ${
                scrolled ? "text-[10px] py-0.5" : "text-xs py-1"
              }`}
            >
              {logoutLoading ? "Departing..." : "Depart"}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="sm:hidden flex items-center gap-1.5">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-800 text-neutral-400 hover:text-green-400 hover:border-green-400/30 transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX className="w-4 h-4" /> : <HiMenu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav bar */}
      <div
        className={`hidden sm:block border-t border-neutral-800/50 overflow-hidden transition-all duration-300 ease-in-out ${
          scrolled ? "max-h-0 opacity-0 border-transparent" : "max-h-12 opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-0.5 h-10 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="flex items-center">
                  {i > 0 && <RuneDivider />}
                  <Link
                    href={link.href}
                    title={link.hint}
                    className={`flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium whitespace-nowrap transition-all group relative ${
                      isActive
                        ? "bg-green-400/10 text-green-400 border border-green-400/20"
                        : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}>
                      {link.icon}
                    </span>
                    {link.label}
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-green-400 ml-0.5 animate-pulse" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4">
          {/* Mobile header decoration */}
          <div className="text-center mb-3">
            <p className="text-green-400/30 text-[10px] tracking-[0.3em] uppercase">
              ✦ Navigate the Realm ✦
            </p>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-800">
            <Avatar src={user?.avatarUrl} alt={user?.username ?? "Wanderer"} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{user?.username ?? "Wanderer"}</p>
              <p className="text-[10px] text-green-400/60 tracking-wide">Adventurer of the Realm</p>
            </div>
          </div>

          {/* Nav grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-green-400/10 text-green-400 border border-green-400/20"
                      : "text-neutral-400 bg-neutral-900 border border-neutral-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.icon}
                    {link.label}
                    {isActive && <span className="w-1 h-1 rounded-full bg-green-400 ml-auto animate-pulse" />}
                  </div>
                  <span className="text-[9px] text-neutral-600 leading-tight font-normal">
                    {link.hint}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            disabled={logoutLoading}
            className="w-full text-sm text-neutral-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-400/20 px-4 py-2.5 rounded-lg transition-all disabled:opacity-40 text-left"
          >
            {logoutLoading ? "⏳ Departing from the realm..." : "Depart from the Realm"}
          </button>

          {/* Bottom rune decoration */}
          <p className="text-center text-green-400/15 text-[10px] tracking-[0.4em] mt-4 select-none">
            ᚱ ᚢ ᚾ ᛖ ᛋ
          </p>
        </div>
      )}
    </header>
  );
}