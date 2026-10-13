"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { nav } from "@/lib/site";
import { cartCount, onCartChange, openCartDrawer, readCart } from "@/lib/cart-store";

/** Pages that open on a full-bleed dark image, where the header starts transparent. */
const OVER_IMAGE = new Set(["/", "/coffee"]);

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()));
    sync();
    return onCartChange(sync);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const transparent = OVER_IMAGE.has(pathname) && !scrolled && !open;
  const light = transparent;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        transparent ? "bg-transparent" : "border-b border-line/70 bg-cream/90 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        <Logo light={light} />

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`link-underline text-[12px] font-medium uppercase tracking-[0.18em] ${
                  light ? "text-cream/90 hover:text-cream" : "text-deep/80 hover:text-deep"
                } ${active ? (light ? "text-cream" : "text-deep") + " bg-[length:100%_1px]" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/invitation"
            className={`hidden text-[12px] font-medium uppercase tracking-[0.16em] sm:inline-flex ${
              light ? "btn-ghost-light !px-5 !py-2.5" : "btn-primary !px-5 !py-2.5"
            }`}
          >
            Request a place
          </Link>
          <button
            type="button"
            onClick={openCartDrawer}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
              light ? "text-cream hover:bg-cream/10" : "text-deep hover:bg-sand"
            }`}
            aria-label={`Open basket (${count} ${count === 1 ? "bag" : "bags"})`}
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
            {count > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brass px-1 text-[10px] font-semibold text-deep-900">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center lg:hidden ${light ? "text-cream" : "text-deep"}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-line/70 bg-cream transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-[520px]" : "max-h-0 border-t-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b border-line/60 py-4 font-serif text-2xl">
              {item.label}
            </Link>
          ))}
          <Link href="/invitation" className="btn-primary mt-6">
            Request a place
          </Link>
        </nav>
      </div>
    </header>
  );
}
