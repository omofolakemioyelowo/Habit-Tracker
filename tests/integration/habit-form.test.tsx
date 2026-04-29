import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HabitForm from "../../src/app/components/habits/HabitForm";
import HabitList from "../../src/app/components/habits/HabitList";
import { storage } from "../../src/lib/storage";
import { Habit } from "../../src/types/habit";

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
    storage.setSession({ userId: "user1", email: "test@example.com" });
  });

  it("shows a validation error when habit name is empty", async () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<HabitForm onSave={onSave} onCancel={onCancel} />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByText("Habit name is required")).toBeTruthy();
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    storage.saveHabits([]);

    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<HabitForm onSave={onSave} onCancel={onCancel} />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });
    fireEvent.change(screen.getByTestId("habit-description-input"), {
      target: { value: "Drink 8 glasses daily" },
    });
    fireEvent.submit(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = storage.getHabits();
      expect(habits.length).toBe(1);
      expect(habits[0].name).toBe("Drink Water");
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const existingHabit: Habit = {
      id: "existing-id",
      userId: "user1",
      name: "Original Name",
      description: "Original description",
      frequency: "daily",
      createdAt: "2026-01-01T00:00:00.000Z",
      completions: ["2026-04-28"],
    };
    storage.saveHabits([existingHabit]);

    const updatedHabit = { ...existingHabit, name: "Updated Name" };
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<HabitForm habit={updatedHabit} onSave={onSave} onCancel={onCancel} />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Updated Name" },
    });
    fireEvent.submit(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      const habits = storage.getHabits();
      expect(habits[0].id).toBe("existing-id");
      expect(habits[0].userId).toBe("user1");
      expect(habits[0].createdAt).toBe("2026-01-01T00:00:00.000Z");
      expect(habits[0].name).toBe("Updated Name");
      expect(habits[0].completions).toContain("2026-04-28");
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const existingHabit: Habit = {
      id: "to-delete",
      userId: "user1",
      name: "Delete Me",
      description: "Test",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: [],
    };
    storage.saveHabits([existingHabit]);

    const onRefresh = vi.fn();

    render(<HabitList habits={[existingHabit]} onRefresh={onRefresh} />);

    fireEvent.click(screen.getByTestId("habit-delete-delete-me"));

    await waitFor(() => {
      expect(screen.getByTestId("confirm-delete-button")).toBeTruthy();
    });

    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      const habits = storage.getHabits();
      expect(habits.length).toBe(0);
    });
  });
});