"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: number;
  productName: string;
  colors: string[];
};

const VILLES_MAROC = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Autre",
];

export default function OrderForm({ productId, productName, colors }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    quantity: 1,
    color: colors[0] ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.customerName.trim()) next.customerName = "Veuillez saisir votre nom.";
    if (!form.phone.trim()) next.phone = "Le numéro de téléphone est requis.";
    else if (!/^[0-9+\s-]{8,}$/.test(form.phone.trim()))
      next.phone = "Saisissez un numéro de téléphone valide.";
    if (!form.city.trim()) next.city = "Veuillez choisir votre ville.";
    if (!form.address.trim()) next.address = "L'adresse de livraison est requise.";
    if (form.quantity < 1) next.quantity = "La quantité doit être d'au moins 1.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push(`/order/success?ref=${data.order.id}`);
      } else {
        setServerError(data.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch {
      setServerError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="field-label" htmlFor="customerName">
          Nom complet
        </label>
        <input
          id="customerName"
          className="field"
          placeholder="Votre nom complet"
          value={form.customerName}
          onChange={(e) => update("customerName", e.target.value)}
        />
        {errors.customerName && (
          <p className="mt-1 text-xs text-burgundy">{errors.customerName}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="phone">
            Téléphone
          </label>
          <input
            id="phone"
            inputMode="tel"
            className="field"
            placeholder="06 00 00 00 00"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          {errors.phone && <p className="mt-1 text-xs text-burgundy">{errors.phone}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="city">
            Ville
          </label>
          <select
            id="city"
            className="field"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          >
            <option value="">Choisissez votre ville</option>
            {VILLES_MAROC.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.city && <p className="mt-1 text-xs text-burgundy">{errors.city}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="address">
          Adresse de livraison complète
        </label>
        <textarea
          id="address"
          rows={3}
          className="field resize-none"
          placeholder="Rue, immeuble, appartement, quartier…"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
        {errors.address && <p className="mt-1 text-xs text-burgundy">{errors.address}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="color">
            Coloris / modèle
          </label>
          {colors.length > 0 ? (
            <select
              id="color"
              className="field"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
            >
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="color"
              className="field"
              placeholder="Coloris / modèle souhaité"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="field-label">Quantité</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-11 w-11 rounded-xl border border-ink/15 font-body text-lg text-ink transition hover:border-burgundy hover:text-burgundy"
              onClick={() => update("quantity", Math.max(1, form.quantity - 1))}
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="w-8 text-center font-body text-base">{form.quantity}</span>
            <button
              type="button"
              className="h-11 w-11 rounded-xl border border-ink/15 font-body text-lg text-ink transition hover:border-burgundy hover:text-burgundy"
              onClick={() => update("quantity", form.quantity + 1)}
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="notes">
          Remarques <span className="lowercase tracking-normal">(facultatif)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          className="field resize-none"
          placeholder="Tout ce qu'on devrait savoir pour la livraison"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      {serverError && (
        <p className="rounded-xl bg-burgundy/5 px-4 py-3 text-sm text-burgundy">{serverError}</p>
      )}

      <button type="submit" className="btn-gold w-full" disabled={submitting}>
        {submitting ? "Envoi en cours…" : "Confirmer la commande"}
      </button>

      <p className="text-center font-body text-xs text-stone">
        Paiement à la livraison · On vous appelle pour confirmer
      </p>
    </form>
  );
}
