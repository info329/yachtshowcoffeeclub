"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCart } from "@/lib/cart-store";
import { formatMoney } from "@/lib/money";
import { ROASTERS_API, ROASTERS_SITE } from "@/lib/site";

interface Summary {
  orderNumber: string;
  state: "paid" | "pending" | "cancelled";
  grossCents: number;
  currency: string;
  lines: { description: string; quantity: number }[];
}

/**
 * Where Stripe returns a buyer. Reads the order from Onshore Roasters rather
 * than trusting the redirect: their payment webhook may land a few seconds
 * after this page, so "pending" is re-checked for a little while.
 */
export function OrderStatus({ token }: { token: string }) {
  const [order, setOrder] = useState<Summary | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let stop = false;
    let tries = 0;
    const load = async () => {
      try {
        const res = await fetch(`${ROASTERS_API}/api/shop/order/${encodeURIComponent(token)}`, { cache: "no-store" });
        if (res.status === 404) return setMissing(true);
        const data = (await res.json()) as Summary;
        if (stop) return;
        setOrder(data);
        if (data.state === "paid") clearCart();
        if (data.state === "pending" && ++tries < 10) setTimeout(load, 3000);
      } catch {
        if (!stop && ++tries < 10) setTimeout(load, 3000);
      }
    };
    load();
    return () => {
      stop = true;
    };
  }, [token]);

  const heading = missing
    ? "We couldn't find that order."
    : !order
      ? "Checking your order…"
      : order.state === "paid"
        ? "Thank you — your coffee is on its way to the roaster."
        : order.state === "cancelled"
          ? "This order was cancelled."
          : "Waiting for payment confirmation…";

  return (
    <section className="flex min-h-[80vh] items-center pb-24 pt-36">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">{order ? `Order ${order.orderNumber}` : "Your order"}</p>
        <h1 className="mt-6 font-serif text-display">{heading}</h1>

        {order?.state === "paid" ? (
          <p className="mt-6 text-[17px] leading-relaxed text-deep/80">
            Onshore Roasters has your order and will roast it to order. Your confirmation and invoice are on their way by
            email from Onshore Roasters, followed by delivery and tracking updates.
          </p>
        ) : null}
        {order?.state === "pending" ? (
          <p className="mt-6 text-[17px] leading-relaxed text-deep/80">
            If you completed the payment, this updates in a moment. If you left the payment page, nothing has been charged —
            your basket is still here.
          </p>
        ) : null}

        {order && order.lines.length ? (
          <div className="mt-10 border border-line bg-cream-50 p-6 sm:p-8">
            <ul className="divide-y divide-line">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-[15px]">
                  <span>{l.description}</span>
                  <span className="tabular-nums text-muted">× {l.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-[13px] uppercase tracking-[0.16em] text-muted">Total</span>
              <span className="font-serif text-3xl tabular-nums">{formatMoney(order.grossCents, order.currency || "EUR")}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          {order?.state === "pending" ? <Link href="/shop/checkout" className="btn-primary">Back to checkout</Link> : null}
          <a href={`${ROASTERS_SITE.replace(/\/website$/, "")}/track`} target="_blank" rel="noopener" className="btn-ghost">Track an order</a>
          <Link href="/" className="btn-ghost">Back to the club</Link>
        </div>
        <p className="mt-10 text-[14px] text-muted">
          Questions about your order? Onshore Roasters: <a href="mailto:info@onshoreroasters.com" className="underline">info@onshoreroasters.com</a> · +33 7 85 59 78 13
        </p>
      </div>
    </section>
  );
}
