import Link from "next/link";
import { notFound } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug, products, formatMAD } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  return { title: product ? `${product.name} — Jewel Muse` : "Jewel Muse" };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const onSale = product.oldPrice && product.oldPrice > product.price;

  return (
    <div className="mx-auto max-w-site px-6 py-12 md:px-10 md:py-16">
      <nav className="mb-8 font-body text-xs uppercase tracking-[0.16em] text-stone">
        <Link href="/" className="transition hover:text-burgundy">
          Accueil
        </Link>{" "}
        /{" "}
        <Link href="/products" className="transition hover:text-burgundy">
          Collection
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* GALERIE */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery media={product.media} alt={product.name} />
        </div>

        {/* INFOS + FORMULAIRE */}
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-ink md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="font-display text-3xl text-ink">{formatMAD(product.price)}</span>
            {onSale && (
              <span className="font-body text-lg text-stone/60 line-through">
                {formatMAD(product.oldPrice!)}
              </span>
            )}
          </div>

          <p className="mt-6 font-body text-lg font-light leading-relaxed text-stone">
            {product.description}
          </p>
          {product.descriptionAr && (
  <p
    dir="rtl"
    lang="ar"
    className="mt-3 text-stone-700 leading-loose text-right"
  >
    {product.descriptionAr}
  </p>
)}

          <dl className="mt-8 space-y-3 border-y border-burgundy/10 py-6 font-body text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Matière</dt>
              <dd className="text-right text-ink">{product.material}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Coloris disponibles</dt>
              <dd className="text-right text-ink">{product.colors.join(" · ")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Livraison</dt>
              <dd className="text-right text-ink">Partout au Maroc · Paiement à la livraison</dd>
            </div>
          </dl>

          <div className="mt-10 rounded-2xl border border-champagne/40 bg-cream/50 p-6 md:p-8">
            <h2 className="font-display text-2xl font-medium text-ink">Passer commande</h2>
            <p className="mt-1 font-body text-sm text-stone">
              Renseignez vos coordonnées on vous appelle pour confirmer avant l&apos;envoi.
            </p>
            <div className="mt-6">
              <OrderForm
                productId={product.id}
                productName={product.name}
                colors={product.colors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
