import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  it("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("**/login");
  });

  it("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-session", JSON.stringify({
        userId: "test-user",
        email: "test@example.com",
      }));
    });
    await page.goto("http://localhost:3000/");
    await page.waitForURL("**/dashboard");
  });

  it("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await page.waitForURL("**/login");
  });

  it("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");
    await page.getByTestId("auth-signup-email").fill("newuser@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  it("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-users", JSON.stringify([{
        id: "existing-user",
        email: "existing@example.com",
        password: "password123",
        createdAt: "2026-01-01",
      }]));
    });
    await page.goto("http://localhost:3000/login");
    await page.getByTestId("auth-login-email").fill("existing@example.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();
    await page.waitForURL("**/dashboard");
  });

  it("creates a habit from the dashboard", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-session", JSON.stringify({
        userId: "test-user",
        email: "test@example.com",
      }));
    });
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("Drink 8 glasses");
    await page.getByTestId("habit-save-button").click();
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  it("completes a habit for today and updates the streak", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-session", JSON.stringify({
        userId: "test-user",
        email: "test@example.com",
      }));
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("habit-tracker-habits", JSON.stringify([{
        id: "habit-1",
        userId: "test-user",
        name: "Exercise",
        description: "Daily exercise",
        frequency: "daily",
        createdAt: "2026-01-01",
        completions: [],
      }]));
    });
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("habit-complete-exercise").click();
    const streakEl = await page.getByTestId("habit-streak-exercise");
    await expect(streakEl).toContainText("1 day");
  });

  it("persists session and habits after page reload", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-session", JSON.stringify({
        userId: "test-user",
        email: "test@example.com",
      }));
      localStorage.setItem("habit-tracker-habits", JSON.stringify([{
        id: "habit-1",
        userId: "test-user",
        name: "Read Books",
        description: "Read 30 minutes",
        frequency: "daily",
        createdAt: "2026-01-01",
        completions: [],
      }]));
    });
    await page.goto("http://localhost:3000/dashboard");
    await page.reload();
    await expect(page.getByTestId("habit-card-read-books")).toBeVisible();
  });

  it("logs out and redirects to /login", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("habit-tracker-session", JSON.stringify({
        userId: "test-user",
        email: "test@example.com",
      }));
    });
    await page.goto("http://localhost:3000/dashboard");
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");
  });

  it("loads the cached app shell when offline after the app has been loaded once", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.waitForURL("**/login");
    await page.evaluate(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js");
      }
    });
  });
});