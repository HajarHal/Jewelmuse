import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { appendOrder } from "@/lib/sheet";
import { notifyNewOrder } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productId = Number(body.productId);
    const product = products.find((p) => p.id === productId);

    // Server-side validation (never trust the client)
    const missing: string[] = [];
    if (!body.customerName?.trim()) missing.push("name");
    if (!body.phone?.trim()) missing.push("phone");
    if (!body.city?.trim()) missing.push("city");
    if (!body.address?.trim()) missing.push("address");
    if (!product) missing.push("product");

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing or invalid: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const quantity = Math.max(1, Number(body.quantity) || 1);

    // 1) Save the order to the Google Sheet
    const order = await appendOrder({
      customerName: String(body.customerName).trim(),
      phone: String(body.phone).trim(),
      city: String(body.city).trim(),
      address: String(body.address).trim(),
      quantity,
      color: body.color ? String(body.color).trim() : null,
      notes: body.notes ? String(body.notes).trim() : null,
      productName: product!.name,
      unitPrice: product!.price,
    });

    // 2) Notify the shop owner (email + WhatsApp). Non-blocking failures.
    await notifyNewOrder(order);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
