import Link from "next/link";

export const metadata = {
  title: "Commande confirmée — Jewel Muse",
};

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const ref = searchParams.ref;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center md:py-36">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-champagne bg-champagne/15">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7A1E22"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <p className="eyebrow mt-8">Merci</p>
      <h1 className="mt-3 font-display text-5xl font-medium text-ink">
        Votre commande est confirmée
      </h1>

      {ref && (
        <p className="mt-4 font-body text-sm uppercase tracking-[0.16em] text-stone">
          Référence · #{ref.padStart(4, "0")}
        </p>
      )}

      <p className="mt-6 font-body text-lg font-light leading-relaxed text-stone">
        Nous avons bien reçu votre commande et nous vous appellerons sous peu au
        numéro indiqué pour confirmer les détails. Le paiement se fait à la
        livraison.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link href="/products" className="btn-gold">
          Continuer mes achats
        </Link>
        <Link href="/" className="btn-outline">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
