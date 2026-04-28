"use client";

import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { Habit } from "@/lib/types/habit";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";

interface HabitListProps {
  habits: Habit[];
  onRefresh: () => void;
}

export default function HabitList({ habits, onRefresh }: HabitListProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (deletingHabit) {
      setShowDeleteConfirm(true);
    }
  }, [deletingHabit]);

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleDelete = (habit: Habit) => {
    setDeletingHabit(habit);
  };

  const confirmDelete = () => {
    if (deletingHabit) {
      const allHabits = storage.getHabits();
      const filtered = allHabits.filter((h) => h.id !== deletingHabit.id);
      storage.saveHabits(filtered);
      setShowDeleteConfirm(false);
      setDeletingHabit(null);
      onRefresh();
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingHabit(null);
  };

  const handleEditSave = () => {
    setEditingHabit(null);
    onRefresh();
  };

  const handleEditCancel = () => {
    setEditingHabit(null);
  };

  if (habits.length === 0) {
    return (
      <div data-testid="empty-state" className="text-center py-12">
        <p className="text-[var(--color-taupe-primary)] text-lg">
          No habits yet. Create your first habit to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {editingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <HabitForm
            habit={editingHabit}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        </div>
      )}

      {showDeleteConfirm && deletingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-[var(--color-taupe-dark)] mb-2">
              Delete Habit?
            </h3>
            <p className="text-[var(--color-taupe-primary)] mb-4">
              Are you sure you want to delete "{deletingHabit.name}"? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 rounded-xl font-semibold text-[var(--color-taupe-dark)] bg-[var(--color-taupe-primary)]/10 hover:bg-[var(--color-taupe-primary)]/20 transition-all"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}