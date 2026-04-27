import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--color-taupe-bg)]">
      <LoginForm />
    </div>
  );
}