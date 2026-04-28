import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "../../src/lib/habits";
import { Habit } from "../../src/lib/types/habit";

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const habit: Habit = {
      id: "1",
      userId: "user1",
      name: "Test Habit",
      description: "Test",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: [],
    };
    const updated = toggleHabitCompletion(habit, "2026-04-28");
    expect(updated.completions).toContain("2026-04-28");
  });

  it("removes a completion date when the date already exists", () => {
    const habit: Habit = {
      id: "1",
      userId: "user1",
      name: "Test Habit",
      description: "Test",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: ["2026-04-28"],
    };
    const updated = toggleHabitCompletion(habit, "2026-04-28");
    expect(updated.completions).not.toContain("2026-04-28");
  });

  it("does not mutate the original habit object", () => {
    const habit: Habit = {
      id: "1",
      userId: "user1",
      name: "Test Habit",
      description: "Test",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: [],
    };
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, "2026-04-28");
    expect(habit.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    const habit: Habit = {
      id: "1",
      userId: "user1",
      name: "Test Habit",
      description: "Test",
      frequency: "daily",
      createdAt: "2026-01-01",
      completions: ["2026-04-28"],
    };
    const updated = toggleHabitCompletion(habit, "2026-04-28");
    const duplicates = updated.completions.filter(
      (d, i) => updated.completions.indexOf(d) !== i
    );
    expect(duplicates.length).toBe(0);
  });
});