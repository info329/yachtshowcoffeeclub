"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { onCartChange, readCart, type CartItem } from "@/lib/cart-store";
import { COFFEES } from "@/lib/catalog";
import { DELIVERY_COUNTRIES } from "@/lib/countries";
import { formatMoney } from "@/lib/money";
import { ROASTERS_API, ROASTERS_SITE } from "@/lib/site";

/** What Onshore Roasters' /api/shop/price returns (the parts shown here). */
interface PricedLine {
  sku: string;
  name: string;
  quantity: number;
  grossCents: number;
}
interface PricedCart {
  lines: PricedLine[];
  goodsNetCents: number;
  shippingGrossCents: number;
  vatCents: number;
  grossCents: number;
  legalMentions: string[];
  deliveryIsEstimate: boolean;
  discount?: { code: string; savedCents: number };
}
type VatStatus = "none" | "invalid" | "unverified" | "valid";
type VesselGap = "not_business" | "vessel_name" | "vessel_id" | "flag_state" | "declaration";

const GAP_TEXT: Record<VesselGap, string> = {
  not_business: "the company name or a valid VAT number of the owning or managing company",
  vessel_name: "the vessel's name",
  vessel_id: "its IMO or MMSI number",
  flag_state: "its flag state",
  declaration: "the declaration that it is in commercial use",
};

const ERRORS: Record<string, string> = {
  invalid: "Please check the details and try again.",
  rate_limited: "That's a lot of attempts in a short time. Please try again later, or email info@onshoreroasters.com.",
  empty: "Your basket is empty.",
  unavailable: "Something in your basket is no longer available.",
  zero: "This basket could not be priced.",
  delivery_unpriced: "We can't price delivery to that address automatically — email info@onshoreroasters.com and we'll quote it.",
  failed: "We couldn't start the payment. Nothing has been charged — please try again.",
};

export function CheckoutClient({ cancelled }: { cancelled: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cart, setCart] = useState<PricedCart | null>(null);
  const [pricing, setPricing] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [vatStatus, setVatStatus] = useState<VatStatus>("none");
  const [vesselGaps, setVesselGaps] = useState<VesselGap[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("FR");
  const [forVessel, setForVessel] = useState(false);
  const [vesselName, setVesselName] = useState("");
  const [vesselId, setVesselId] = useState("");
  const [flagState, setFlagState] = useState("");
  const [commercial, setCommercial] = useState(false);
  const [notes, setNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const sync = () => {
      setItems(readCart());
      setLoaded(true);
    };
    sync();
    return onCartChange(sync);
  }, []);

  const vessel = forVessel && vesselName.trim()
    ? { name: vesselName.trim(), imoOrMmsi: vesselId.trim() || undefined, flagState: flagState.trim() || undefined, commercialUseDeclared: commercial }
    : undefined;

  const priceBody = JSON.stringify({
    items,
    email: email.trim() || undefined,
    discountCode: discountCode.trim() || undefined,
    delivery: { line1, line2, postcode, city, countryCode },
    isBusiness: !!company.trim(),
    vatNumber: vatNumber.trim() || undefined,
    vessel,
  });

  // Reprice after a pause in typing. The latest request wins.
  const seq = useRef(0);
  const reprice = useCallback(async (body: string) => {
    const mine = ++seq.current;
    setPricing(true);
    try {
      const res = await fetch(`${ROASTERS_API}/api/shop/price`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (mine !== seq.current) return;
      if (!res.ok || !data.cart) {
        setPriceError(res.status === 429 ? "Pricing is busy — give it a moment." : "We couldn't price this basket just now.");
        return;
      }
      setPriceError(null);
      setCart(data.cart as PricedCart);
      setVatStatus((data.vatStatus as VatStatus) ?? "none");
      setVesselGaps((data.vesselGaps as VesselGap[] | null) ?? null);
    } catch {
      if (mine === seq.current) setPriceError("We couldn't reach Onshore Roasters to price this basket.");
    } finally {
      if (mine === seq.current) setPricing(false);
    }
  }, []);

  useEffect(() => {
    if (!loaded || items.length === 0) return;
    const t = setTimeout(() => reprice(priceBody), 450);
    return () => clearTimeout(t);
  }, [loaded, items.length, priceBody, reprice]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acceptedTerms) {
      setError("Please accept the terms of sale.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${ROASTERS_API}/api/shop/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lang: "en",
          items,
          contact: { email: email.trim(), fullName: fullName.trim(), company: company.trim() || undefined, phone: phone.trim() || undefined },
          delivery: { line1: line1.trim(), line2: line2.trim() || undefined, postcode: postcode.trim(), city: city.trim(), countryCode },
          vessel,
          vatNumber: vatNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          discountCode: discountCode.trim() || undefined,
          paymentMethod: "card",
          acceptedTerms: true,
          marketing: { consent: { analytics: false, advertising: false } },
          company_website: honeypot,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.checkoutUrl) {
        setError(data.code === "discount" ? "That discount code can't be used on this order." : ERRORS[data.code] ?? ERRORS.failed);
        setSubmitting(false);
        return;
      }
      window.location.href = String(data.checkoutUrl);
    } catch {
      setError("We couldn't reach Onshore Roasters. Nothing has been charged — please try again.");
      setSubmitting(false);
    }
  }

  const known = items.filter((i) => COFFEES.some((c) => c.sku === i.sku));

  if (loaded && known.length === 0) {
    return (
      <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pb-20 pt-40 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-6 font-serif text-display">Your basket is empty.</h1>
        <Link href="/coffee" className="btn-primary mt-10">Browse the coffee</Link>
      </section>
    );
  }

  return (
    <section className="pb-24 pt-32 sm:pt-40">
      <div className="container-x">
        <p className="eyebrow">Checkout · Onshore Roasters</p>
        <h1 className="mt-4 font-serif text-display">Almost there.</h1>
        {cancelled ? (
          <p className="mt-6 max-w-2xl border-l-2 border-brass bg-sand/60 px-5 py-4 text-[15px]">
            Payment wasn&apos;t completed, and nothing has been charged. Your basket is still here whenever you&apos;re ready.
          </p>
        ) : null}

        <form onSubmit={submit} className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="space-y-14 lg:col-span-7">
            <fieldset>
              <legend className="font-serif text-3xl">Your details</legend>
              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <Field label="Full name" required value={fullName} onChange={setFullName} autoComplete="name" />
                <Field label="Email" type="email" required value={email} onChange={setEmail} autoComplete="email" />
                <Field label="Phone" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
                <Field label="Company or yacht (optional)" value={company} onChange={setCompany} autoComplete="organization" />
                <div className="sm:col-span-2">
                  <Field label="EU VAT number (businesses, optional)" value={vatNumber} onChange={setVatNumber} />
                  {vatStatus === "valid" ? <p className="mt-2 text-[13px] text-emerald-700">VAT number verified — reverse charge applies where it should.</p> : null}
                  {vatStatus === "invalid" ? <p className="mt-2 text-[13px] text-red-700">That doesn&apos;t look like a valid EU VAT number.</p> : null}
                  {vatStatus === "unverified" ? <p className="mt-2 text-[13px] text-muted">We couldn&apos;t verify that number with VIES, so VAT is charged for now.</p> : null}
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-serif text-3xl">Delivery</legend>
              <p className="mt-2 text-[14px] text-muted">To the yacht, your agent, the marina office or your home.</p>
              <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="Address" required value={line1} onChange={setLine1} autoComplete="address-line1" /></div>
                <div className="sm:col-span-2"><Field label="Berth, c/o agent, building (optional)" value={line2} onChange={setLine2} autoComplete="address-line2" /></div>
                <Field label="Postcode" required value={postcode} onChange={setPostcode} autoComplete="postal-code" />
                <Field label="Town / port" required value={city} onChange={setCity} autoComplete="address-level2" />
                <label className="sm:col-span-2">
                  <span className="label">Country *</span>
                  <select className="field" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} autoComplete="country">
                    {DELIVERY_COUNTRIES.map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="border border-line bg-cream-50 p-6 sm:p-8">
              <label className="flex cursor-pointer items-start gap-4">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-[#183a5b]" checked={forVessel} onChange={(e) => setForVessel(e.target.checked)} />
                <span>
                  <span className="font-serif text-2xl">This order is for a yacht</span>
                  <span className="mt-1 block text-[14px] text-muted">
                    Supplies for a commercial yacht can be VAT-exempt (Art. 148 VAT Directive). Tell us about the vessel and the
                    price updates.
                  </span>
                </span>
              </label>
              {forVessel ? (
                <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field label="Vessel name" value={vesselName} onChange={setVesselName} />
                  <Field label="IMO or MMSI" value={vesselId} onChange={setVesselId} />
                  <Field label="Flag state" value={flagState} onChange={setFlagState} />
                  <label className="flex items-start gap-3 sm:col-span-2">
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-[#183a5b]" checked={commercial} onChange={(e) => setCommercial(e.target.checked)} />
                    <span className="text-[14px]">I declare the vessel is used commercially (charter or other commercial activity) on the high seas.</span>
                  </label>
                  {vesselGaps && vesselGaps.length > 0 ? (
                    <p className="text-[13px] text-muted sm:col-span-2">
                      For the VAT exemption we still need {vesselGaps.map((g) => GAP_TEXT[g] ?? g).join(", ")}. Until then VAT is charged.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="font-serif text-3xl">Anything else</legend>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label>
                    <span className="label">Delivery notes (optional)</span>
                    <textarea className="field min-h-[90px]" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} />
                  </label>
                </div>
                <Field label="Discount code (optional)" value={discountCode} onChange={setDiscountCode} />
              </div>
              {/* Left empty by people; bots fill it. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                name="company_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </fieldset>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 border border-line bg-cream-50 p-6 sm:p-8">
              <p className="eyebrow">Your order</p>
              <ul className="mt-5 divide-y divide-line">
                {known.map((i) => {
                  const c = COFFEES.find((x) => x.sku === i.sku)!;
                  const priced = cart?.lines.find((l) => l.sku === i.sku);
                  return (
                    <li key={i.sku} className="flex items-center gap-4 py-4">
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-sand">
                        <Image src={c.image} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-xl leading-tight">{c.name}</p>
                        <p className="text-[12px] text-muted">{i.quantity} × 1 kg</p>
                      </div>
                      <p className="tabular-nums">{formatMoney(priced?.grossCents ?? c.priceCents * i.quantity)}</p>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[14px]">
                {cart?.discount ? (
                  <Row k={`Discount (${cart.discount.code})`} v={`− ${formatMoney(cart.discount.savedCents)}`} />
                ) : null}
                <Row k={cart?.deliveryIsEstimate ? "Delivery (estimate)" : "Delivery"} v={cart ? (cart.shippingGrossCents === 0 ? "Free" : formatMoney(cart.shippingGrossCents)) : "—"} />
                <Row k="of which VAT" v={cart ? formatMoney(cart.vatCents) : "—"} />
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-[13px] uppercase tracking-[0.16em] text-muted">Total</span>
                <span className={`font-serif text-4xl tabular-nums transition-opacity ${pricing ? "opacity-50" : ""}`}>
                  {cart ? formatMoney(cart.grossCents) : "—"}
                </span>
              </div>
              {cart?.legalMentions?.length ? (
                <ul className="mt-3 space-y-1 text-[12px] text-muted">
                  {cart.legalMentions.map((m) => <li key={m}>{m}</li>)}
                </ul>
              ) : null}
              {priceError ? <p className="mt-3 text-[13px] text-red-700">{priceError}</p> : null}

              <label className="mt-6 flex items-start gap-3 text-[13px] leading-relaxed">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#183a5b]" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                <span>
                  I&apos;m buying from Onshore Roasters SAS and accept their{" "}
                  <a href={`${ROASTERS_SITE}/terms`} target="_blank" rel="noopener" className="underline underline-offset-2">terms of sale</a> and{" "}
                  <a href={`${ROASTERS_SITE}/privacy`} target="_blank" rel="noopener" className="underline underline-offset-2">privacy notice</a>.
                </span>
              </label>

              {error ? <p className="mt-4 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[14px] text-red-800" role="alert">{error}</p> : null}

              <button type="submit" disabled={submitting || !cart || pricing} className="btn-primary mt-6 w-full">
                {submitting ? "Opening secure payment…" : `Pay securely${cart ? ` · ${formatMoney(cart.grossCents)}` : ""}`}
              </button>
              <p className="mt-4 text-center text-[12px] leading-relaxed text-muted">
                Card payment by Stripe. Your order confirmation, invoice and delivery updates come from Onshore Roasters.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required ? " *" : ""}
      </span>
      <input className="field" type={type} required={required} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="tabular-nums">{v}</dd>
    </div>
  );
}
