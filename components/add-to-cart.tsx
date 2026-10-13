"use client";

import { useEffect, useState } from "react";
import { addToCart, MAX_QTY, onCartChange, openCartDrawer, readCart, setQuantity } from "@/lib/cart-store";

/** Adds a bag; once one is in the basket it becomes a stepper for that coffee. */
export function AddToCart({ sku, name, tone = "dark" }: { sku: string; name: string; tone?: "dark" | "light" }) {
  const [qty, setQty] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setQty(readCart().find((i) => i.sku === sku)?.quantity ?? 0);
      setReady(true);
    };
    sync();
    return onCartChange(sync);
  }, [sku]);

  if (!ready || qty === 0) {
    return (
      <button
        type="button"
        onClick={() => {
          addToCart(sku, 1);
          openCartDrawer();
        }}
        className={`${tone === "light" ? "btn-brass" : "btn-primary"} w-full`}
      >
        Add to basket
      </button>
    );
  }

  const border = tone === "light" ? "border-cream/40 text-cream" : "border-deep/30 text-deep";
  return (
    <div className="flex gap-3">
      <div className={`flex flex-1 items-center justify-between rounded-full border px-2 ${border}`}>
        <button
          type="button"
          onClick={() => setQuantity(sku, qty - 1)}
          className="h-11 w-11 rounded-full text-xl leading-none transition hover:bg-brass/20"
          aria-label={`One fewer ${name}`}
        >
          −
        </button>
        <span className="text-sm font-medium tabular-nums" aria-live="polite">
          {qty} × 1 kg
        </span>
        <button
          type="button"
          onClick={() => setQuantity(sku, qty + 1)}
          disabled={qty >= MAX_QTY}
          className="h-11 w-11 rounded-full text-xl leading-none transition hover:bg-brass/20 disabled:opacity-40"
          aria-label={`One more ${name}`}
        >
          +
        </button>
      </div>
      <button type="button" onClick={openCartDrawer} className={tone === "light" ? "btn-ghost-light" : "btn-ghost"}>
        Basket
      </button>
    </div>
  );
}
