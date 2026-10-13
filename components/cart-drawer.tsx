"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COFFEES } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { MAX_QTY, onCartChange, onCartOpen, readCart, setQuantity, type CartItem } from "@/lib/cart-store";

/**
 * The basket, sliding in from the right. Shows shelf prices (VAT included) as a
 * guide; the real total, with delivery and the right VAT for the destination
 * or vessel, is worked out by Onshore Roasters at checkout.
 */
export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    const offChange = onCartChange(sync);
    const offOpen = onCartOpen(() => {
      sync();
      setOpen(true);
    });
    return () => {
      offChange();
      offOpen();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const lines = items.flatMap((i) => {
    const c = COFFEES.find((x) => x.sku === i.sku);
    return c ? [{ ...i, coffee: c }] : [];
  });
  const subtotal = lines.reduce((s, l) => s + l.coffee.priceCents * l.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-deep-900/50 backdrop-blur-[2px] transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="eyebrow">Onshore Roasters</p>
            <h2 className="mt-1 font-serif text-3xl">Your basket</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="h-11 w-11 rounded-full text-2xl hover:bg-sand" aria-label="Close basket">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-serif text-2xl">Nothing in here yet.</p>
            <p className="mt-3 text-[15px] text-muted">The coffee poured at the club, roasted to order by Onshore Roasters.</p>
            <Link href="/coffee" onClick={() => setOpen(false)} className="btn-primary mt-8">
              Browse the coffee
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.sku} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-sand">
                    <Image src={l.coffee.image} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-xl leading-tight">{l.coffee.name}</p>
                        <p className="mt-1 text-[12px] text-muted">1 kg · whole bean</p>
                      </div>
                      <p className="text-[15px] tabular-nums">{formatMoney(l.coffee.priceCents * l.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center gap-3 pt-3">
                      <div className="flex items-center rounded-full border border-line">
                        <button type="button" className="h-9 w-9 text-lg" onClick={() => setQuantity(l.sku, l.quantity - 1)} aria-label={`One fewer ${l.coffee.name}`}>
                          −
                        </button>
                        <span className="w-7 text-center text-sm tabular-nums">{l.quantity}</span>
                        <button
                          type="button"
                          className="h-9 w-9 text-lg disabled:opacity-40"
                          disabled={l.quantity >= MAX_QTY}
                          onClick={() => setQuantity(l.sku, l.quantity + 1)}
                          aria-label={`One more ${l.coffee.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => setQuantity(l.sku, 0)} className="text-[12px] uppercase tracking-[0.14em] text-muted hover:text-deep">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-cream-50 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] uppercase tracking-[0.16em] text-muted">Subtotal</span>
                <span className="font-serif text-3xl tabular-nums">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                VAT included. Delivery — to your yacht, agent or home — and any VAT exemption for a commercial yacht are
                worked out at checkout.
              </p>
              <Link href="/shop/checkout" onClick={() => setOpen(false)} className="btn-primary mt-5 w-full">
                Checkout <span aria-hidden>→</span>
              </Link>
              <p className="mt-3 text-center text-[11px] uppercase tracking-[0.16em] text-muted">
                Roasted &amp; shipped by Onshore Roasters
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
