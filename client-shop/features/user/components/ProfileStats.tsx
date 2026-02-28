"use client";

import { GiCrystalBall } from "react-icons/gi";
import type { UserListResponse } from "../types";

interface ProfileStatsProps {
  user: UserListResponse;
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const role = user.role === "ADMIN" ? "High Mage" : "Adventurer";

  const stats = [
    { rune: "ᚾ", value: joinedDate,                              label: "Joined"       },
    { rune: "ᛋ", value: user.isVerified ? "Sworn" : "Unsworn",  label: "Oath Status"  },
    { rune: "ᚢ", value: role,                                    label: "Standing"     },
    { rune: "ᚠ", value: user.role === "ADMIN" ? "∞" : "—",      label: "Relics Access"},
  ];

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
      <p className="text-[10px] text-green-400/40 tracking-[0.3em] uppercase mb-4 flex items-center gap-1.5">
        <GiCrystalBall className="w-3 h-3" /> Realm Stats
      </p>
      <div className="space-y-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl px-3 py-2.5 hover:border-green-400/20 transition-colors group"
          >
            <span className="text-[10px] text-neutral-500 tracking-wide">{s.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-green-400/20 text-[10px] group-hover:text-green-400/40 transition-colors select-none">{s.rune}</span>
              <span className="text-sm font-bold text-white">{s.value}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-green-400/10 text-[9px] tracking-[0.5em] mt-4 select-none">
        ✦ ᚠᚢᚦᚨᚱ ✦
      </p>
    </div>
  );
}