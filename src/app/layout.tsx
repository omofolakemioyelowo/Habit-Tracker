import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Simple habit tracking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
