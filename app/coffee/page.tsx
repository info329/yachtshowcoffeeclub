import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AddToCart } from "@/components/add-to-cart";
import { getCoffees } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { ROASTERS_SITE, site } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "The Coffee — Onshore Roasters",
  description:
    "The coffee poured at every Yacht Show Coffee Club morning, roasted to order by Onshore Roasters and delivered to your yacht, agent or home.",
  alternates: { canonical: "/coffee" },
};

export default async function CoffeePage() {
  const coffees = await getCoffees();
  return (
    <>
      {/* Hero */}
      <section className="grain relative flex min-h-[88svh] items-end overflow-hidden bg-espresso text-cream">
        <Image src="/images/pour.jpg" alt="Milk poured into an Onshore Roasters cup at a club morning" fill priority sizes="100vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-espresso/20" />
        <div className="container-x relative z-10 pb-16 pt-40 sm:pb-24">
          <div className="flex animate-rise items-center gap-4">
            <Image src="/images/onshore-wordmark-light.png" alt="Onshore Roasters" width={1214} height={184} className="h-auto w-44 sm:w-56" priority />
            <span className="hidden h-px w-16 bg-brass-light sm:block" />
            <span className="hidden text-[11px] uppercase tracking-eyebrow text-brass-light sm:block">Founding coffee partner</span>
          </div>
          <h1 className="mt-8 max-w-5xl animate-rise font-serif text-hero [animation-delay:120ms]">
            The club&apos;s coffee, <em className="font-light text-brass-light">delivered to your berth.</em>
          </h1>
          <div className="mt-10 flex animate-rise flex-col gap-8 [animation-delay:260ms] md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-[17px] leading-relaxed text-cream/80">
              Every cup at a Yacht Show Coffee Club morning is Onshore Roasters. Three blends, each built for a job on board,
              roasted to order on the Côte d&apos;Azur and shipped to yachts, agents and homes across the Mediterranean, the
              Caribbean and beyond.
            </p>
            <a href="#range" className="btn-brass shrink-0">Shop the three coffees ↓</a>
          </div>
        </div>
      </section>

      {/* Promise strip */}
      <section className="border-b border-line bg-cream">
        <div className="container-x grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
          {[
            ["Roasted to order", "Never sat on a shelf"],
            ["1 kg bags", "Whole bean, for a busy machine"],
            ["To the yacht", "Or your agent, or your home"],
            ["VAT handled", "Commercial yachts & EU trade exempt"],
          ].map(([a, b]) => (
            <div key={a} className="px-2">
              <p className="font-serif text-2xl">{a}</p>
              <p className="mt-1 text-[13px] text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-6">
            <p className="eyebrow">Onshore Roasters</p>
            <h2 className="mt-6 font-serif text-display">
              Win the morning, <em className="text-brass">win the day.</em>
            </h2>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-deep/80">
              <p>
                Onshore Roasters is a specialty roastery on the French Riviera, set up to do one thing well: get great coffee
                onto yachts. Trusted by superyacht crews for reliable provisioning, they roast to order and deliver to the
                dock.
              </p>
              <p>
                They were with the club from its third chapter in Palma, and they&apos;ve been in every cup since. When guests
                asked where the coffee came from, the answer was always the same — so now you can order it here.
              </p>
            </div>
          </Reveal>
          <Reveal className="md:col-span-6" delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <Image src="/images/packshots.jpg" alt="Onshore Roasters Guest Beans, Crew Beans and Decaf bags" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* The range */}
      <section id="range" className="scroll-mt-24 border-t border-line bg-cream-50">
        <div className="container-x py-24 sm:py-32">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">The range · {coffees.length} coffees</p>
            <h2 className="mt-6 font-serif text-display">Freshly roasted, by the kilo.</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-deep/75">
              One to get the crew through a long show day, one your guests will comment on, and one with the caffeine taken
              out gently.
            </p>
          </Reveal>

          <div className="mt-20 space-y-28">
            {coffees.map((c, i) => (
              <article key={c.sku} id={c.slug} className="grid scroll-mt-28 gap-10 md:grid-cols-12 md:items-center">
                <Reveal className={`md:col-span-6 ${i % 2 ? "md:order-2 md:col-start-7" : ""}`}>
                  <div className="relative aspect-square overflow-hidden bg-sand">
                    <Image src={c.image} alt={`${c.name}, 1 kg bag`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
                    <span className="absolute left-5 top-5 bg-cream/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
                      {String(i + 1).padStart(2, "0")} · {c.origin}
                    </span>
                  </div>
                </Reveal>
                <Reveal className={`md:col-span-5 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-8"}`} delay={120}>
                  <p className="eyebrow">{c.moment}</p>
                  <h3 className="mt-4 font-serif text-display">{c.name}</h3>
                  <p className="mt-3 text-[15px] text-muted">{c.subtitle}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.notes.map((n) => (
                      <li key={n} className="rounded-full border border-line px-3.5 py-1.5 text-[12px] uppercase tracking-[0.14em]">
                        {n}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-[16px] leading-relaxed text-deep/80">{c.story}</p>
                  <p className="mt-3 text-[16px] italic leading-relaxed text-deep/70">{c.serve}</p>
                  <div className="mt-8 flex items-baseline gap-3 border-t border-line pt-6">
                    <span className="font-serif text-4xl tabular-nums">{formatMoney(c.priceCents)}</span>
                    <span className="text-[13px] text-muted">per 1 kg bag, VAT included</span>
                  </div>
                  <div className="mt-6 max-w-sm">
                    <AddToCart sku={c.sku} name={c.name} />
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How ordering works */}
      <section id="orders" className="scroll-mt-24 bg-deep text-cream">
        <div className="container-x grid gap-16 py-24 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow !text-brass-light">Orders &amp; delivery</p>
            <h2 className="mt-6 font-serif text-display">Ordered here. Roasted, sent and looked after by Onshore Roasters.</h2>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={120}>
            <ol className="space-y-8">
              {[
                [
                  "Add to basket, check out here",
                  "Pay securely by card. Your price, delivery and VAT are worked out live by Onshore Roasters as you type the address.",
                ],
                [
                  "Your order goes straight to the roastery",
                  "The order is placed with Onshore Roasters SAS, who roast it to order. They send your order confirmation and invoice by email.",
                ],
                [
                  "Delivered to the yacht, agent or home",
                  "You'll get shipping and tracking updates from Onshore Roasters, and any questions about the order go to them.",
                ],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-6 border-b border-cream/15 pb-8">
                  <span className="font-serif text-4xl text-brass-light">{i + 1}</span>
                  <div>
                    <p className="font-serif text-2xl">{t}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-cream/70">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-6 text-[14px] leading-relaxed text-cream/70 sm:grid-cols-2">
              <p>
                <span className="block font-medium text-cream">Ordering for a commercial yacht?</span>
                Add the vessel at checkout. Qualifying commercial yachts, orders leaving the EU and EU businesses with a valid
                VAT number pay the ex-VAT price automatically.
              </p>
              <p>
                <span className="block font-medium text-cream">Provisioning a whole season?</span>
                Larger runs are better as a quote, priced to a specific port.{" "}
                <a href={`${ROASTERS_SITE}/quote`} target="_blank" rel="noopener" className="text-brass-light underline underline-offset-4">
                  Request a quote from Onshore Roasters
                </a>
                .
              </p>
            </div>
            <a href="#range" className="btn-brass mt-10">Choose your coffee ↑</a>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x flex flex-col items-center gap-6 text-center">
          <Image src="/images/onshore-emblem.png" alt="" width={89} height={132} className="h-16 w-auto opacity-80" />
          <p className="max-w-2xl text-[14px] leading-relaxed text-muted">
            Coffee is sold and shipped by Onshore Roasters SAS, 2040 Chemin Saint Bernard, 06220 Vallauris, France ·
            RCS Antibes 982 066 086 · info@onshoreroasters.com.{" "}
            <a href={`${ROASTERS_SITE}/terms`} target="_blank" rel="noopener" className="underline underline-offset-4">Terms of sale</a>{" "}
            ·{" "}
            <a href={site.onshoreRoasters} target="_blank" rel="noopener" className="underline underline-offset-4">onshoreroasters.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
