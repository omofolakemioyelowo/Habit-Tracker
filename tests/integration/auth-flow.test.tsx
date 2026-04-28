import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import SignupForm from "../../src/app/components/auth/SignupForm";
import LoginForm from "../../src/app/components/auth/LoginForm";
import { storage } from "../../src/lib/storage";

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("test@example.com");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    const { rerender } = render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByTestId("auth-signup-submit"));

    rerender(<SignupForm />);

    fireEvent.change(screen.getAllByTestId("auth-signup-email")[0], {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getAllByTestId("auth-signup-password")[0], {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getAllByTestId("auth-signup-submit")[0]);

    await waitFor(() => {
      expect(screen.getByText("User already exists.")).toBeTruthy();
    });
  });

  it("submits the login form and stores the active session", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByTestId("auth-signup-submit"));

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("test@example.com");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "nonexistent@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.submit(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password.")).toBeTruthy();
    });
  });
});