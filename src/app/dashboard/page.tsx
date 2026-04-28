"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Habit } from "@/lib/types/habit";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentSession = storage.getSession();
    if (!currentSession) {
      router.replace("/login");
      return;
    }
    setSession(currentSession);
    loadHabits(currentSession.userId);
  }, [router]);

  const loadHabits = (userId: string) => {
    const allHabits = storage.getHabits();
    const userHabits = allHabits.filter((h) => h.userId === userId);
    setHabits(userHabits);
    setLoading(false);
  };

  const handleLogout = () => {
    storage.setSession(null);
    router.replace("/login");
  };

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    if (session) {
      loadHabits(session.userId);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const refreshHabits = () => {
    if (session) {
      loadHabits(session.userId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-taupe-bg)]">
        <p className="text-[var(--color-taupe-primary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div
      data-testid="dashboard-page"
      className="min-h-screen flex flex-col bg-[var(--color-taupe-bg)] px-4 py-6"
    >
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-taupe-dark)]">
            Habit Tracker
          </h1>
          <p className="text-sm text-[var(--color-taupe-primary)]">
            {session?.email}
          </p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl font-semibold text-[var(--color-taupe-dark)] bg-[var(--color-taupe-primary)]/10 hover:bg-[var(--color-taupe-primary)]/20 transition-all"
        >
          Log Out
        </button>
      </header>

      <button
        data-testid="create-habit-button"
        onClick={handleCreateClick}
        className="w-full max-w-md mb-6 py-4 rounded-xl font-bold text-white bg-[var(--color-taupe-primary)] shadow-lg hover:brightness-95 active:scale-[0.98] transition-all"
      >
        + Create New Habit
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <HabitForm
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <main className="flex-1">
        <HabitList habits={habits} onRefresh={refreshHabits} />
      </main>
    </div>
  );
}