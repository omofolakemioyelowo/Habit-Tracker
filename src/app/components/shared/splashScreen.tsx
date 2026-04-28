"use client";

import Image from "next/image";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 bg-[var(--color-taupe-bg)]"
    >
      <div className="relative w-32 h-32 mb-6 animate-[zoomIn_0.6s_ease-out_forwards]">
        <Image
          src="/icons/512.png"
          alt="Habit Tracker Logo"
          fill
          priority
          unoptimized
          className="object-contain opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]"
        />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--color-taupe-primary)] opacity-0 animate-[fadeIn_0.5s_ease-out_0.3s_forwards]">
        Habit Tracker
      </h1>
      <div className="mt-6 w-12 h-1 bg-[var(--color-taupe-primary)]/20 overflow-hidden rounded-full opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards]">
        <div className="w-full h-full bg-[var(--color-taupe-primary)] origin-left animate-[loading_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}