export function validateHabitName(name: string) {
  const normalized = name.trim(); // Clean up whitespace

  if (!normalized) {
    return { valid: false, value: normalized, error: "Habit name is required" };
  }

  if (normalized.length > 60) {
    return {
      valid: false,
      value: normalized,
      error: "Habit name must be 60 characters or fewer",
    };
  }

  return { valid: true, value: normalized, error: null };
}
