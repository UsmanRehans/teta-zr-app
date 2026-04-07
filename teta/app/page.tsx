import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">teta</h1>
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-5xl mb-4">🍋</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Home-cooked food
            <br />
            from Beirut&apos;s best
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Discover authentic Lebanese meals made by home cooks in your
            neighborhood. Kibbeh, tabbouleh, mana&apos;eesh — the way teta
            makes it.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link
              href="/login"
              className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full text-center hover:bg-primary-dark transition-colors"
            >
              Browse Cooks
            </Link>
            <Link
              href="/login?role=cook"
              className="w-full py-3 px-6 bg-white text-primary font-semibold rounded-full text-center border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-center mb-8">How it works</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <div>
                <p className="font-semibold">Find a cook near you</p>
                <p className="text-sm text-foreground/60">
                  Browse the map to see home cooks in your area
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <div>
                <p className="font-semibold">Pick your dishes</p>
                <p className="text-sm text-foreground/60">
                  Choose from today&apos;s menu — everything is made fresh
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <div>
                <p className="font-semibold">Pick up or arrange delivery</p>
                <p className="text-sm text-foreground/60">
                  Pay cash on delivery — simple as that
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-foreground/40">
        <p>Made with love in Beirut</p>
      </footer>
    </div>
  );
}
