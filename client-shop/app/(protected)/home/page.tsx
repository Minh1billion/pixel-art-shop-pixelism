"use client";

export default function HomePage() {
  return (
    <main className="bg-neutral-950 text-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
          <span className="text-green-300 text-xs tracking-wider font-medium uppercase">Pixel Art Marketplace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none tracking-tight mb-5 sm:mb-6">
          Sprites built for
          <br />
          <span className="text-green-400">real games.</span>
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed mb-8 sm:mb-10">
          Browse thousands of hand-crafted pixel art sprites. License individually or subscribe for unlimited access — integrate directly into your game engine of choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button className="px-8 py-3 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 transition-colors text-sm tracking-wide w-full sm:w-auto">
            Browse Sprites
          </button>
          <button className="px-8 py-3 bg-transparent border border-neutral-700 hover:border-green-400/50 text-white font-medium rounded-xl transition-colors text-sm w-full sm:w-auto">
            View Pricing
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-800">
          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2">Browse & Discover</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Explore curated collections by category, style, and art direction. Filter by resolution, animation frames, or color palette.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2">Buy or Subscribe</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Purchase individual assets with a perpetual license, or unlock everything with a monthly plan — cancel anytime.
            </p>
          </div>

          <div className="bg-neutral-950 p-6 sm:p-8 hover:bg-green-950/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-green-950 border border-green-400/20 flex items-center justify-center mb-4 sm:mb-5">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2">Integrate Instantly</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Export in PNG, WebP, or spritesheets. Plugins available for Unity, Godot, and Phaser. Full API access for pro subscribers.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[
            { value: "12,000+", label: "Sprites" },
            { value: "480+", label: "Creators" },
            { value: "38", label: "Categories" },
            { value: "Free & Paid", label: "Tiers" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}