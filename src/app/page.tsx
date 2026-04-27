"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/app/components/shared/splashScreen";
import { storage } from "@/lib/storage";

export default function BootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const MIN_DELAY = 2000;

    const timer = setTimeout(() => {
      const session = storage.getSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }

      setShowSplash(false);
    }, MIN_DELAY);
    return () => clearTimeout(timer);
  }, [router]);

  return <>{showSplash && <SplashScreen />}</>;
}
