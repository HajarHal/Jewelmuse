import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

const VALEURS = [
  {
    title: "Élégantes par essence",
    body: "Chaque pièce est choisie pour sa ligne, sa finition, sa retenue. Rien de tapageur, tout est pensé.",
  },
  {
    title: "Choisies avec soin",
    body: "Une collection courte et travaillée. Une pièce n'entre que lorsqu'elle a mérité sa place.",
  },
  {
    title: "Livraison partout au Maroc",
    body: "De Casablanca à Oujda, votre commande vous parvient où que vous soyez.",
  },
  {
    title: "Paiement à la livraison",
    body: "Commandez en toute confiance. Vous ne payez qu'une fois la pièce entre vos mains.",
  },
];

const FAQ = [
  {
    q: "Comment passer commande ?",
    a: "Choisissez une pièce, ouvrez sa page et remplissez le formulaire avec votre nom, téléphone, ville et adresse. On vous appelle pour confirmer avant l'envoi — aucun paiement en ligne n'est nécessaire.",
  },
  {
    q: "Quand vais-je recevoir ma commande ?",
    a: "La plupart des commandes arrivent partout au Maroc sous 2 à 4 jours ouvrables après confirmation par téléphone.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Oui. Si une pièce ne vous convient pas, vous pouvez la retourner dans son état d'origine.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-burgundy/10 blur-3xl" />
        <div className="mx-auto grid max-w-site items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div className="flex flex-col">
            <p className="eyebrow animate-fade">Bijoux raffinés · Maroc</p>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.08] text-ink animate-rise sm:text-6xl">
              Des bijoux raffinés
              <br />
              pour femmes <span className="italic text-burgundy">élégantes</span>
            </h1>
            <p className="mt-6 max-w-md font-body text-lg font-light leading-relaxed text-stone animate-rise [animation-delay:120ms]">
              Une collection courte et pensée, livrée partout au Maroc, payée à
              la livraison. 
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-rise [animation-delay:240ms]">
              <Link href="/products" className="btn-gold">
                Découvrir la collection
              </Link>
              <Link href="/#why" className="btn-outline">
                Pourquoi Jewel Muse
              </Link>
            </div>
          </div>

          <div className="relative animate-fade [animation-delay:200ms]">
            <div className="flex items-center justify-center overflow-hidden rounded-[2rem] border border-champagne/40 bg-gradient-to-br from-cream to-ivory p-10 shadow-[0_30px_80px_-40px_rgba(92,20,24,0.35)] sm:p-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Jewel Muse"
                className="w-full max-w-sm object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SÉLECTION */}
      <section className="mx-auto max-w-site px-6 py-16 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">La sélection</p>
            <h2 className="mt-3 font-display text-4xl font-medium text-ink md:text-5xl">
              Pièces phares
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden font-body text-sm uppercase tracking-[0.16em] text-burgundy transition hover:text-ink sm:inline"
          >
            Tout voir →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* POURQUOI */}
      <section id="why" className="bg-cream/70 py-20">
        <div className="mx-auto max-w-site px-6 md:px-10">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow">Pourquoi Jewel Muse</p>
            <h2 className="mt-3 font-display text-4xl font-medium text-ink md:text-5xl">
              Pensé, jamais chargé
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-burgundy/10 bg-burgundy/10 sm:grid-cols-2 lg:grid-cols-4">
            {VALEURS.map((v) => (
              <div key={v.title} className="bg-ivory p-8">
                <h3 className="font-display text-2xl font-medium text-ink">{v.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-stone">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <div className="text-center">
          <p className="eyebrow">Bon à savoir</p>
          <h2 className="mt-3 font-display text-4xl font-medium text-ink md:text-5xl">
            Vos questions, nos réponses
          </h2>
        </div>

        <div className="mt-12 divide-y divide-burgundy/10">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl font-medium text-ink">
                {item.q}
                <span className="font-body text-burgundy transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 font-body leading-relaxed text-stone">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/products" className="btn-gold">
            Découvrir la collection
          </Link>
        </div>
      </section>
    </>
  );
}
