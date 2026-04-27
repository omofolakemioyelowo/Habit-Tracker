export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  if (!completions.length) return 0; // No completions? Streak is 0.

  // 1. Clean data: Remove duplicates and sort newest to oldest
  const uniqueDates = Array.from(new Set(completions)).sort().reverse();

  // 2. Set the "starting point" (usually today's date)
  const targetDate = today || new Date().toISOString().split("T")[0];

  // 3. If they haven't done it today, the "current" streak is already broken
  if (!uniqueDates.includes(targetDate)) return 0;

  let streak = 0;
  let currentCheck = new Date(targetDate);

  // 4. Loop through sorted dates and count consecutive days
  for (const dateStr of uniqueDates) {
    const formattedCheck = currentCheck.toISOString().split("T")[0];

    if (dateStr === formattedCheck) {
      streak++; // It's a match!
      currentCheck.setDate(currentCheck.getDate() - 1); // Move "check date" to yesterday
    } else if (new Date(dateStr) < currentCheck) {
      break; // We found a gap in the calendar
    }
  }

  return streak;
}
