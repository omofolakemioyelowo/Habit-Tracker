import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased font-sans">
        <main className="min-h-screen max-w-md mx-auto shadow-2xl bg-[var(--background)]">
          {children}
        </main>
      </body>
    </html>
  );
}
