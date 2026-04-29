export type Habit = {
  id: string; // A unique ID (e.g., UUID)
  userId: string; // Links the habit to a specific user
  name: string; // e.g., "Drink Water"
  description: string;
  frequency: "daily"; // Fixed string for this stage
  createdAt: string; // ISO date string
  completions: string[]; // Array of dates like ["2026-04-26"]
};
