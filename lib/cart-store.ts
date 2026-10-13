"use client";

/**
 * The basket, as the browser holds it: SKUs and quantities only. Every price
 * the visitor sees is worked out by Onshore Roasters, so a basket edited in
 * devtools changes what someone buys, never what they pay.
 */

export interface CartItem {
  sku: string;
  quantity: number;
}

const KEY = "ysc.cart.v1";
const EVENT = "ysc:cart";
export const MAX_QTY = 60;

function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.flatMap((e): CartItem[] => {
      if (!e || typeof e !== "object") return [];
      const sku = String((e as CartItem).sku ?? "").trim();
      const quantity = Math.floor(Number((e as CartItem).quantity));
      if (!sku || !Number.isFinite(quantity) || quantity <= 0) return [];
      return [{ sku, quantity: Math.min(quantity, MAX_QTY) }];
    });
  } catch {
    return [];
  }
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Storage blocked: the basket lasts for this page only.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function setQuantity(sku: string, quantity: number): void {
  const items = readCart().filter((i) => i.sku !== sku);
  const qty = Math.min(Math.max(0, Math.floor(quantity)), MAX_QTY);
  if (qty > 0) items.push({ sku, quantity: qty });
  write(items);
}

export function addToCart(sku: string, quantity = 1): void {
  const current = readCart().find((i) => i.sku === sku)?.quantity ?? 0;
  setQuantity(sku, current + quantity);
}

export function clearCart(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function onCartChange(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

const OPEN_EVENT = "ysc:cart-open";
export function openCartDrawer() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
export function onCartOpen(fn: () => void): () => void {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}
