import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-burgundy/10 bg-cream/60">
      <div className="mx-auto max-w-site px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo className="h-20 w-auto" />
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-stone">
              Bijoux et accessoires raffinés pour femmes élégantes. Choisis avec
              soin, livrés partout au Maroc.
            </p>
          </div>

          <div>
            <p className="eyebrow">Explorer</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-stone">
              <li>
                <Link href="/" className="transition hover:text-burgundy">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-burgundy">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition hover:text-burgundy">
                  Questions fréquentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Notre promesse</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-stone">
              <li>Livraison partout au Maroc</li>
              <li>Paiement à la livraison</li>
              <li>Pièces choisies avec soin</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 hairline" />
        <p className="mt-6 text-center font-body text-xs uppercase tracking-[0.16em] text-stone/70">
          © {new Date().getFullYear()} Jewel Muse
        </p>
      </div>
    </footer>
  );
}
