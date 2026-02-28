"use client";

import { useState } from "react";
import { GiSwordman } from "react-icons/gi";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AvatarEditor } from "@/features/user/components/AvatarEditor";
import { ProfileForm } from "@/features/user/components/ProfileForm";
import { ProfileStats } from "@/features/user/components/ProfileStats";

type ToastState = { message: string; type: "success" | "error" } | null;

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${
        type === "success"
          ? "bg-green-950 border-green-400/30 text-green-300"
          : "bg-red-950 border-red-400/30 text-red-300"
      }`}
    >
      {type === "success"
        ? <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
        : <HiOutlineXCircle className="w-4 h-4 shrink-0" />
      }
      {message}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-150 h-48 bg-green-500/4 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-10 relative">

        {/* Page heading */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <GiSwordman className="w-4 h-4 text-green-400/50" />
            <span className="text-green-400/40 text-[10px] tracking-[0.35em] uppercase">
              Your Legend & Deeds
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            The <span className="text-green-400">Chronicle</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* Left: avatar card + stats */}
          <div className="space-y-4 min-w-0">

            {/* Avatar card — no overflow-hidden so text isn't clipped */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center relative">
              <span className="absolute top-3 right-3 text-green-400/10 text-xs select-none">ᚱ</span>
              <span className="absolute bottom-3 left-3 text-green-400/10 text-xs select-none">ᛖ</span>

              <AvatarEditor
                src={user.avatarUrl}
                username={user.username}
                onSuccess={(msg) => showToast(msg, "success")}
                onError={(msg) => showToast(msg, "error")}
              />

              <div className="w-full mt-5 pt-5 border-t border-neutral-800 text-center">
                <p className="text-[10px] text-neutral-600 tracking-widest uppercase mb-1">
                  Oath-bound email
                </p>
                <p className="text-xs text-neutral-300 break-all leading-relaxed">{user.email}</p>
              </div>
            </div>

            <ProfileStats user={user} />
          </div>

          {/* Right: profile form */}
          <div className="space-y-4 min-w-0">
            <ProfileForm
              user={user}
              onSuccess={(msg) => showToast(msg, "success")}
              onError={(msg) => showToast(msg, "error")}
            />

            <p className="text-center text-green-400/10 text-[10px] tracking-[0.5em] pt-2 select-none">
              ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ
            </p>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}