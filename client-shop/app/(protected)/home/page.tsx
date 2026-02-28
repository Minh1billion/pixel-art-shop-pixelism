"use client";

import { useRouter } from "next/navigation";
import { GiCastle, GiSpellBook, GiSwordman, GiScrollUnfurled, GiCrystalBall } from "react-icons/gi";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="bg-neutral-950 text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-64 bg-green-500/5 blur-3xl rounded-full" />
        <div className="absolute top-32 left-1/4 w-64 h-64 bg-green-400/3 blur-3xl rounded-full" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 relative">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
          <span className="text-green-300 text-xs tracking-[0.25em] font-medium uppercase">
            ⚔ Pixel Art Realm ⚔
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tight mb-5 sm:mb-6">
          Relics forged for
          <br />
          <span className="text-green-400">true realms.</span>
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed mb-2">
          Venture through thousands of hand-crafted pixel relics. Claim them individually or pledge allegiance for boundless access — summon directly into your engine of choice.
        </p>
        <p className="text-green-400/30 text-[10px] tracking-[0.4em] mb-8 sm:mb-10 select-none">
          ✦ ᚱᛖᚨᛚᛗ ᛟᚠ ᛈᛁᚲᛖᛚᛋ ✦
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/store")}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 transition-colors text-sm tracking-wide w-full sm:w-auto"
          >
            <GiCastle className="w-4 h-4" />
            Enter the Bazaar
          </button>

          <button
            onClick={() => router.push("/docs")}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-neutral-700 hover:border-green-400/50 text-white font-medium rounded-xl transition-colors text-sm w-full sm:w-auto"
          >
            <GiScrollUnfurled className="w-4 h-4 text-green-400/60" />
            Read the Grimoire
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-800">

          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-green-400/40 transition-colors">
              <GiSpellBook className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-1">Seek & Discover</h3>
            <p className="text-green-400/30 text-[9px] tracking-widest mb-2 uppercase">Explore the Archives</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Delve through curated collections by school of art, style, and visual lore. Filter by resolution, animation frames, or hue enchantment.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-green-400/40 transition-colors">
              <GiCrystalBall className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-1">Claim or Pledge</h3>
            <p className="text-green-400/30 text-[9px] tracking-widest mb-2 uppercase">Bind the Relic</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Seize individual relics under a perpetual binding, or swear a monthly oath for unlimited dominion — renounce at will.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5 group-hover:border-green-400/40 transition-colors">
              <GiSwordman className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-1">Summon Instantly</h3>
            <p className="text-green-400/30 text-[9px] tracking-widest mb-2 uppercase">Deploy to the Field</p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Export as PNG, WebP, or spritesheets. Sigils available for Unity, Godot & Phaser. Full arcane API access for sworn subscribers.
            </p>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-neutral-800/60 relative">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-green-400/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "12,000+", label: "Relics Enshrined", rune: "ᚱ" },
            { value: "480+",    label: "Artisan Mages",    rune: "ᚢ" },
            { value: "38",      label: "Schools of Art",   rune: "ᚾ" },
            { value: "Free & Sworn", label: "Oath Tiers",  rune: "ᛖ" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-green-400/20 text-xs mb-1 select-none group-hover:text-green-400/40 transition-colors">
                {stat.rune}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom rune footer */}
        <div className="text-center pb-8">
          <p className="text-green-400/10 text-[10px] tracking-[0.5em] select-none">
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ
          </p>
        </div>
      </section>
    </main>
  );
}