import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "Collection — Jewel Muse",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">
      <header className="mx-auto max-w-xl text-center">
        <p className="eyebrow">La collection</p>
        <h1 className="mt-3 font-display text-5xl font-medium text-ink md:text-6xl">
          Chaque pièce, choisie
        </h1>
        <p className="mt-5 font-body leading-relaxed text-stone">
          Une collection de bijoux et d&apos;accessoires soigneusement
          sélectionnés, pour sublimer le quotidien avec une élégance intemporelle
          et le souci du détail.
        </p>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
