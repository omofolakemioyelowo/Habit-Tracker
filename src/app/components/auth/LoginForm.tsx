"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { User } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const users: User[] = storage.getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      setError("No account found with this email.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password.");
      return;
    }

    storage.setSession({ userId: user.id, email: user.email });
    router.replace("/dashboard");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto px-6">
      <div className="w-full mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-taupe-dark)]">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[var(--color-taupe-primary)]">
          Sign in to continue tracking your habits
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-taupe-dark)]">
            Email Address
          </label>
          <input
            type="email"
            required
            className="w-full p-3 rounded-xl border border-[var(--color-taupe-primary)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-taupe-primary)] transition-all"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-taupe-dark)]">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full p-3 rounded-xl border border-[var(--color-taupe-primary)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-taupe-primary)] transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 bg-[var(--color-taupe-primary)] text-white rounded-xl font-bold shadow-lg hover:brightness-95 active:scale-[0.98] transition-all"
        >
          Sign In
        </button>
      </form>

      <p className="mt-8 text-sm text-[var(--color-taupe-primary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--color-taupe-dark)] hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}