import { User, Session } from "../types/auth";
import { Habit } from "../types/habit";

const KEYS = {
  USERS: "habit-tracker-users",
  SESSION: "habit-tracker-session",
  HABITS: "habit-tracker-habits",
};

export const storage = {
  getUsers: (): User[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },
  getSession: (): Session | null => {
    if (typeof window === "undefined") return null;
    return JSON.parse(localStorage.getItem(KEYS.SESSION) || "null");
  },
  getHabits: (): Habit[] => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(KEYS.HABITS) || "[]");
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    localStorage.setItem(KEYS.USERS, JSON.stringify([...users, user]));
  },
  setSession: (session: Session | null) => {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  },
  saveHabits: (habits: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
  },
};
