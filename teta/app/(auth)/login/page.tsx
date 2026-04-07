import Link from "next/link";
import PhoneLogin from "@/components/auth/PhoneLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">👋</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Teta
          </h1>
          <p className="text-sm text-foreground/60">
            Enter your phone number to get started
          </p>
        </div>

        <PhoneLogin />
      </main>
    </div>
  );
}
