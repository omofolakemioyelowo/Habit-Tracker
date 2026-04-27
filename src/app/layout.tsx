import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and achieve your goals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased font-sans">
        {/* This main wrapper does three things:
          1. 'min-h-screen': Ensures the background covers the whole phone.
          2. 'max-w-md mx-auto': Centers the app like a mobile phone on desktop.
          3. 'shadow-2xl': Adds a depth effect.
        */}
        <main className="min-h-screen max-w-md mx-auto shadow-2xl bg-[var(--background)]">
          {children}
        </main>
      </body>
    </html>
  );
}
