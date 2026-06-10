import { formatMAD } from "@/lib/products";
import { getOrders, updateOrderStatus, type Order } from "@/lib/sheet";
import { revalidatePath } from "next/cache";

export const metadata = { title: "Commandes — Admin Jewel Muse" };
export const dynamic = "force-dynamic";

const STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "en attente",
  confirmed: "confirmée",
  shipped: "expédiée",
  delivered: "livrée",
  cancelled: "annulée",
  returned: "retournée",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-stone/20 text-stone",
};

async function updateStatus(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && STATUSES.includes(status as (typeof STATUSES)[number])) {
    await updateOrderStatus(id, status);
    revalidatePath("/admin/orders");
  }
}

export default async function AdminOrdersPage() {
  let orders: Order[] = [];
  let notConfigured = false;

  try {
    orders = await getOrders();
  } catch {
    notConfigured = true;
  }

  const pending = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="mx-auto max-w-site px-6 py-16 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Administration</p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink md:text-5xl">
            Commandes
          </h1>
        </div>
        <div className="flex gap-8 font-body text-sm text-stone">
          <div>
            <span className="block font-display text-3xl text-ink">{orders.length}</span>
            au total
          </div>
          <div>
            <span className="block font-display text-3xl text-gold-deep">{pending}</span>
            en attente
          </div>
        </div>
      </header>

      <div className="mt-10 hairline" />

      {notConfigured ? (
        <div className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-8 font-body text-sm text-amber-900">
          <p className="font-medium">Google Sheet non connecté.</p>
          <p className="mt-2 leading-relaxed">
            Définissez <code className="rounded bg-amber-100 px-1">SHEET_WEBAPP_URL</code> et{" "}
            <code className="rounded bg-amber-100 px-1">SHEET_SECRET</code> dans vos
            variables d&apos;environnement, en suivant les étapes du README. La navigation et
            le formulaire de commande fonctionnent sans cela — seule la liste des commandes
            ici nécessite la connexion au sheet.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-16 text-center font-body text-stone">
          Aucune commande pour le moment. Elles apparaîtront ici dès qu&apos;un client en passe une.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full min-w-[860px] border-collapse text-left font-body text-sm">
            <thead>
              <tr className="bg-cream text-xs uppercase tracking-[0.12em] text-stone">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Produit</th>
                <th className="px-5 py-4">Qté</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Passée le</th>
                <th className="px-5 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((o) => (
                <tr key={o.id} className="align-top transition hover:bg-cream/50">
                  <td className="px-5 py-4 text-stone">
                    #{String(o.id).padStart(4, "0")}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink">{o.customerName}</span>
                    <span className="mt-0.5 block text-xs text-stone">{o.city}</span>
                    <span className="mt-1 block max-w-[200px] text-xs text-stone/80">
                      {o.address}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink">
                    <a href={`tel:${o.phone}`} className="hover:text-gold-deep">
                      {o.phone}
                    </a>
                    {o.notes && (
                      <span className="mt-1 block max-w-[180px] text-xs italic text-stone">
                        &ldquo;{o.notes}&rdquo;
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink">
                    {o.productName}
                    {o.color && (
                      <span className="mt-0.5 block text-xs text-stone">{o.color}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-ink">{o.quantity}</td>
                  <td className="px-5 py-4 text-ink">{formatMAD(o.total)}</td>
                  <td className="px-5 py-4 text-stone">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`mb-2 inline-block rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${
                        STATUS_STYLES[o.status] ?? "bg-stone/20 text-stone"
                      }`}
                    >
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                    <form action={updateStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="rounded-lg border border-ink/15 bg-ivory px-2 py-1 text-xs"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {STATUS_LABELS[st] ?? st}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-ink/20 px-3 py-1 text-xs uppercase tracking-[0.1em] text-ink transition hover:border-gold-deep hover:text-gold-deep"
                      >
                        Enregistrer
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8 font-body text-xs text-stone">
        Cette page est protégée par mot de passe. Définissez un{" "}
        <code className="rounded bg-cream px-1">ADMIN_PASSWORD</code> robuste avant la mise en ligne.
      </p>
    </div>
  );
}
