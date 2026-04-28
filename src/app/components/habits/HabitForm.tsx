"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { Habit } from "@/lib/types/habit";
import { validateHabitName } from "@/lib/validators";

interface HabitFormProps {
  habit?: Habit;
  onSave: () => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const router = useRouter();
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
    }
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error || "Validation failed");
      setIsSubmitting(false);
      return;
    }

    const session = storage.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const existingHabits = storage.getHabits();
    
    if (habit) {
      const updatedHabits = existingHabits.map((h) =>
        h.id === habit.id
          ? { ...h, name: validation.value, description }
          : h
      );
      storage.saveHabits(updatedHabits);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session.userId,
        name: validation.value,
        description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      storage.saveHabits([...existingHabits, newHabit]);
    }

    setIsSubmitting(false);
    onSave();
  };

  return (
    <div
      data-testid="habit-form"
      className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-bold text-[var(--color-taupe-dark)] mb-4">
        {habit ? "Edit Habit" : "Create New Habit"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-name"
            className="text-sm font-semibold text-[var(--color-taupe-dark)]"
          >
            Habit Name
          </label>
          <input
            id="habit-name"
            type="text"
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-[var(--color-taupe-primary)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-taupe-primary)] transition-all"
            placeholder="e.g., Drink Water"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-description"
            className="text-sm font-semibold text-[var(--color-taupe-dark)]"
          >
            Description (optional)
          </label>
          <input
            id="habit-description"
            type="text"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-[var(--color-taupe-primary)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-taupe-primary)] transition-all"
            placeholder="e.g., Drink 8 glasses daily"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="habit-frequency"
            className="text-sm font-semibold text-[var(--color-taupe-dark)]"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="w-full p-3 rounded-xl border border-[var(--color-taupe-primary)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-taupe-primary)] transition-all"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-[var(--color-taupe-dark)] bg-[var(--color-taupe-primary)]/10 hover:bg-[var(--color-taupe-primary)]/20 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="habit-save-button"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[var(--color-taupe-primary)] hover:brightness-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : habit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}