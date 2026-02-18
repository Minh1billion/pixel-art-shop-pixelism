"use client";

import { useState } from "react";
import Image from "next/image";
import LoginForm from "@/features/auth/components/LoginForm";
import SignUpForm from "@/features/auth/components/SignUpForm";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

export default function Entry() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  return (
    <div className="flex min-h-screen">
      <div className="relative w-1/2 hidden md:block overflow-hidden">
        <img
          src="/main-bg.jpg"
          alt="Pixel background"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-green-900/30" />

        <div className="absolute inset-0 flex flex-col justify-center px-16 lg:px-20">
          <div className="inline-flex items-center gap-2 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full w-fit mb-6 border border-green-400/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-200 text-sm font-medium tracking-wider">
              FOR GAME CREATORS
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-green-400/20">
              <Image
                src="/pixelism.png"
                alt="Pixelism Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-lg">
              PIXELISM
            </h1>
          </div>

          <div className="h-1.5 w-24 bg-green-400 rounded-full" />

          <div className="mt-10 bg-green-950/30 backdrop-blur-md px-6 py-5 rounded-2xl border border-green-400/10 max-w-lg">
            <p className="text-green-50 text-lg leading-relaxed font-light">
              A curated pixel art gallery where you discover, collect and
              integrate sprites seamlessly into your games.
            </p>
            <p className="text-green-300 text-base mt-3 font-medium">
              Built for creators. Designed for enthusiasts.
            </p>
          </div>

          <div className="flex gap-8 mt-12">
            <div className="text-left">
              <div className="text-3xl font-bold text-white">Diverse</div>
              <div className="text-green-300 text-sm mt-1">Sprites</div>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-white">Mostly</div>
              <div className="text-green-300 text-sm mt-1">Free</div>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold text-white">Affordable</div>
              <div className="text-green-300 text-sm mt-1">Pricing</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-neutral-950 p-8">
        <div className="w-full max-w-md">
          {mode === "login" && (
            <LoginForm 
              onSwitchToSignup={() => setMode("signup")}
              onSwitchToReset={() => setMode("reset")}
            />
          )}
          
          {mode === "signup" && (
            <SignUpForm onSwitchToLogin={() => setMode("login")} />
          )}
          
          {mode === "reset" && (
            <ResetPasswordForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
}