// New-order notifications. Both channels are optional and fail-safe:
// if the relevant env vars aren't set, the channel is skipped silently,
// and a notification error never blocks the order from being saved.
//
// EMAIL  (Resend — https://resend.com, free tier):
//   RESEND_API_KEY   – your Resend API key
//   OWNER_EMAIL      – where order alerts are sent
//   EMAIL_FROM       – optional, e.g. "Jewel Muse <orders@yourdomain.com>"
//                      (defaults to Resend's onboarding sender for testing)
//
// WHATSAPP (CallMeBot — https://www.callmebot.com/blog/free-api-whatsapp-messages/, free):
//   WHATSAPP_PHONE     – your number in international format, e.g. 2126XXXXXXXX
//   CALLMEBOT_APIKEY   – the key CallMeBot gives you

import type { Order } from "./sheet";

function summarize(o: Order): string {
  const lines = [
    `Nouvelle commande #${o.id}`,
    `${o.productName}${o.color ? ` (${o.color})` : ""} ×${o.quantity}`,
    `Total : ${o.total.toLocaleString("fr-FR")} MAD`,
    `${o.customerName} — ${o.phone}`,
    `${o.city} — ${o.address}`,
  ];
  if (o.notes) lines.push(`Remarques : ${o.notes}`);
  return lines.join("\n");
}

async function sendEmail(o: Order): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!key || !to) return;

  const from = process.env.EMAIL_FROM || "Jewel Muse <onboarding@resend.dev>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nouvelle commande #${o.id} — ${o.productName}`,
      text: summarize(o),
    }),
  });
}

async function sendWhatsApp(o: Order): Promise<void> {
  const phone = process.env.WHATSAPP_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return;

  const text = encodeURIComponent(summarize(o));
  await fetch(
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      phone
    )}&text=${text}&apikey=${encodeURIComponent(apikey)}`
  );
}

/** Fire both notifications; log but never throw. */
export async function notifyNewOrder(order: Order): Promise<void> {
  const results = await Promise.allSettled([sendEmail(order), sendWhatsApp(order)]);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("[notify] failed:", r.reason);
  });
}
