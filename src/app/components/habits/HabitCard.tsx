"use client";

import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { toggleHabitCompletion } from "@/lib/habits";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export default function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentHabit, setCurrentHabit] = useState(habit);

  const today = new Date().toISOString().split("T")[0];
  const slug = getHabitSlug(habit.name);

  useEffect(() => {
    setStreak(calculateCurrentStreak(currentHabit.completions, today));
    setIsCompleted(currentHabit.completions.includes(today));
  }, [currentHabit, today]);

  const handleToggleCompletion = () => {
    const updatedHabit = toggleHabitCompletion(currentHabit, today);
    setCurrentHabit(updatedHabit);

    const allHabits = storage.getHabits();
    const updatedHabits = allHabits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );
    storage.saveHabits(updatedHabits);
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`w-full max-w-md bg-white rounded-2xl p-5 shadow-lg transition-all ${
        isCompleted ? "ring-1 ring-green-600" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--color-taupe-dark)]">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-[var(--color-taupe-primary)] mt-1">
              {habit.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            aria-label="Edit habit"
            className="p-2 rounded-full text-[var(--color-taupe-primary)] hover:bg-[var(--color-taupe-primary)]/10 hover:text-[var(--color-taupe-dark)] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => onDelete(habit)}
            aria-label="Delete habit"
            className="p-2 rounded-full text-[var(--color-taupe-primary)] hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div
          data-testid={`habit-streak-${slug}`}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-semibold text-[var(--color-taupe-dark)]">
            {streak} day{streak !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggleCompletion}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            isCompleted
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-[var(--color-taupe-primary)]/10 text-[var(--color-taupe-primary)] hover:bg-[var(--color-taupe-primary)]/20"
          }`}
        >
          {isCompleted ? "✓ Done" : "Complete"}
        </button>
      </div>
    </div>
  );
}
