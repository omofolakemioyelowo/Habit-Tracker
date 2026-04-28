import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits and achieve your goals",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#5c554d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Habits" />
        <link rel="apple-touch-icon" href="/icons/192.png" />
      </head>
      <body className="antialiased font-sans">
        <main className="min-h-screen max-w-md mx-auto shadow-2xl bg-[var(--background)]">
          {children}
        </main>
      </body>
    </html>
  );
}