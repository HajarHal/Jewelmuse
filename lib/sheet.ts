// Google Sheets backend.
// Orders are stored in a Google Sheet via a small Apps Script "web app"
// (see google-apps-script/Code.gs and the deploy steps in README.md).
//
// Env vars used:
//   SHEET_WEBAPP_URL  – the deployed Apps Script web app URL
//   SHEET_SECRET      – a shared secret string (must match the script)
//
// If SHEET_WEBAPP_URL is missing, orders are logged to the server console
// and given a temporary id, so the site is fully testable before you wire
// up the sheet. Listing orders in /admin still requires the sheet.

export type OrderInput = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  color?: string | null;
  notes?: string | null;
  productName: string;
  unitPrice: number;
};

export type Order = OrderInput & {
  id: number;
  total: number;
  status: string;
  createdAt: string;
};

const URL = process.env.SHEET_WEBAPP_URL;
const SECRET = process.env.SHEET_SECRET ?? "";

export function sheetConfigured(): boolean {
  return Boolean(URL);
}

/** Append an order. Returns the created order (with id). */
export async function appendOrder(input: OrderInput): Promise<Order> {
  const total = input.unitPrice * input.quantity;

  if (!URL) {
    // Dev fallback: no sheet configured yet.
    const order: Order = {
      ...input,
      id: Date.now() % 100000,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    console.warn(
      "[orders] SHEET_WEBAPP_URL not set — order logged to console only:",
      order
    );
    return order;
  }

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, action: "create", ...input, total }),
    redirect: "follow",
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Sheet append failed");
  return data.order as Order;
}

/** List all orders, newest first. Throws if the sheet isn't configured. */
export async function getOrders(): Promise<Order[]> {
  if (!URL) throw new Error("SHEET_WEBAPP_URL not configured");

  const res = await fetch(
    `${URL}?secret=${encodeURIComponent(SECRET)}&action=list`,
    { cache: "no-store" }
  );
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Sheet read failed");

  const orders = (data.orders as Order[]) ?? [];
  return orders.sort((a, b) => b.id - a.id);
}

/** Update one order's status. */
export async function updateOrderStatus(id: number, status: string): Promise<void> {
  if (!URL) throw new Error("SHEET_WEBAPP_URL not configured");

  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, action: "updateStatus", id, status }),
    redirect: "follow",
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Status update failed");
}
