import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-burgundy/10 bg-ivory/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-site items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="group" aria-label="Jewel Muse — accueil">
          <Logo className="h-12 w-auto transition-opacity group-hover:opacity-80 md:h-14" />
        </Link>

        <div className="flex items-center gap-8 font-body text-sm uppercase tracking-[0.16em] text-ink">
          <Link href="/" className="hidden transition hover:text-burgundy sm:inline">
            Accueil
          </Link>
          <Link href="/products" className="transition hover:text-burgundy">
            Collection
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-burgundy/50 px-5 py-2 text-xs text-burgundy transition hover:bg-burgundy hover:text-ivory"
          >
            Boutique
          </Link>
        </div>
      </nav>
    </header>
  );
}
