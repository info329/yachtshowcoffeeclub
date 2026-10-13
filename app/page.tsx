import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { AddToCart } from "@/components/add-to-cart";
import { getCoffees } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { site } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const coffees = await getCoffees();
  return (
    <>
      {/* Hero */}
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-deep-900 text-cream">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-poster.jpg"
          aria-hidden
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-900 via-deep-900/40 to-deep-900/30" />
        <div className="container-x relative z-10 pb-16 pt-40 sm:pb-24">
          <p className="eyebrow animate-rise !text-brass-light">A Project Yachting × Onshore Roasters initiative · Est. 2025</p>
          <h1 className="mt-6 max-w-5xl animate-rise font-serif text-hero font-normal [animation-delay:120ms]">
            Coffee, conversation, <em className="font-light text-brass-light">and the right people.</em>
          </h1>
          <div className="mt-10 grid animate-rise gap-10 [animation-delay:260ms] md:grid-cols-12 md:items-end">
            <p className="max-w-xl text-[17px] leading-relaxed text-cream/80 md:col-span-6">
              An invitation-only gathering for the yachting community, held at the world&apos;s great boat shows — from the
              Mediterranean to America to the Caribbean.
            </p>
            <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
              <Link href="/invitation" className="btn-brass">
                Request your place <span aria-hidden>→</span>
              </Link>
              <Link href="/about" className="btn-ghost-light">
                Read the story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shows marquee */}
      <div className="overflow-hidden border-b border-line bg-cream py-5" aria-label={`Shows: ${site.shows.join(", ")}`}>
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap pr-12 font-serif text-2xl italic text-deep/70" aria-hidden>
          {[...site.shows, ...site.shows, ...site.shows, ...site.shows].map((s, i) => (
            <span key={i} className="flex items-center gap-12">
              {s} <span className="text-brass">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* What it is */}
      <section className="py-24 sm:py-36">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">What it is</p>
            <h2 className="mt-6 font-serif text-display">
              A morning for the people who <em className="text-brass">belong here.</em>
            </h2>
          </Reveal>
          <Reveal className="space-y-6 text-[17px] leading-relaxed text-deep/80 md:col-span-6 md:col-start-7 md:pt-14" delay={150}>
            <p>
              The Yacht Show Coffee Club brings together a range of industry professionals, yacht owners and the people who
              make this industry what it is.
            </p>
            <p>
              Every person in the room is there because they were asked — no pressure, no pitching, just a gathering of
              yachting passion and good conversation.
            </p>
            <p>
              If you&apos;re a yacht owner, captain or simply work in the yachting world and this sounds like your kind of
              morning, we&apos;d love to hear from you.
            </p>
            <Link href="/invitation" className="link-underline inline-block pt-2 text-[13px] font-medium uppercase tracking-[0.18em]">
              Tell us about yourself →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Next gathering */}
      <section className="bg-deep text-cream">
        <div className="container-x grid gap-0 md:grid-cols-2">
          <div className="relative min-h-[380px] overflow-hidden md:min-h-[620px]">
            <Image src="/images/gathering-17.jpg" alt="Guests in conversation aboard a yacht at the club's Palma morning" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center py-16 md:py-24 md:pl-16">
            <Reveal>
              <p className="eyebrow !text-brass-light">Next gathering</p>
              <h2 className="mt-6 font-serif text-display">Cannes Yachting Festival.</h2>
              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-cream/15 pt-8">
                {[
                  ["Where", "Cannes, France"],
                  ["When", "September 2026"],
                  ["Format", "Coffee, 10:00am"],
                  ["Places", "By invitation"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-cream/50">{k}</dt>
                    <dd className="mt-1.5 font-serif text-2xl">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 max-w-md text-[16px] leading-relaxed text-cream/75">
                Where the club began. A morning of coffee and conversation, to kick-start the show.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/invitation" className="btn-brass">Request your place →</Link>
                <Link href="/events" className="btn-ghost-light">All events</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonial + numbers */}
      <section className="py-24 sm:py-36">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-center">In the room</p>
            <blockquote className="mx-auto mt-8 max-w-4xl text-center font-serif text-title italic leading-snug">
              “Good people, and a lovely atmosphere to meet, converse and sample some amazing coffee — great initiative.”
            </blockquote>
            <p className="mt-6 text-center text-[13px] uppercase tracking-[0.2em] text-muted">Attendee, Palma 2026</p>
          </Reveal>
          <div className="mt-20 grid grid-cols-3 divide-x divide-line border-y border-line">
            {[
              ["6", "Yacht shows"],
              ["100%", "Personally invited"],
              ["5", "Countries"],
            ].map(([n, l], i) => (
              <Reveal key={l} delay={i * 120} className="px-2 py-10 text-center sm:py-14">
                <p className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-none">{n}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted sm:text-[12px]">{l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The coffee */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <div className="container-x py-24 sm:py-32">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <Reveal className="md:col-span-7">
              <p className="eyebrow !text-brass-light">The coffee in your cup</p>
              <h2 className="mt-6 font-serif text-display">
                Poured at every morning. <em className="text-brass-light">Now delivered to your berth.</em>
              </h2>
            </Reveal>
            <Reveal className="md:col-span-5" delay={150}>
              <p className="text-[16px] leading-relaxed text-cream/75">
                Our founding coffee partner, Onshore Roasters, roasts to order on the Côte d&apos;Azur and delivers to yachts,
                agents and homes across the Mediterranean, the Caribbean and beyond. Order the club&apos;s coffee here — Onshore
                Roasters takes it from there.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {coffees.map((c, i) => (
              <Reveal key={c.sku} delay={i * 120}>
                <article className="group flex h-full flex-col">
                  <Link href={`/coffee#${c.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-deep-900">
                    <Image src={c.image} alt={`${c.name} — 1 kg bag`} fill sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 30vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  </Link>
                  <div className="mt-6 flex flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-3xl">{c.name}</h3>
                      <p className="tabular-nums text-cream/90">{formatMoney(c.priceCents)}</p>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-cream/60">{c.subtitle}</p>
                    <div className="mt-auto pt-6">
                      <AddToCart sku={c.sku} name={c.name} tone="light" />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-center">
            <Link href="/coffee" className="link-underline text-[13px] font-medium uppercase tracking-[0.18em] text-brass-light">
              Discover Onshore Roasters →
            </Link>
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow text-center">In partnership with</p>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            <a href={site.projectYachting} target="_blank" rel="noopener" className="group bg-cream p-12 text-center transition hover:bg-sand">
              <p className="font-serif text-4xl">Project Yachting</p>
              <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-muted">Founding organisation</p>
            </a>
            <Link href="/coffee" className="group flex flex-col items-center bg-cream p-12 text-center transition hover:bg-sand">
              <Image src="/images/onshore-wordmark-ink.png" alt="Onshore Roasters" width={1214} height={184} className="mt-2 h-auto w-56" />
              <p className="mt-5 text-[12px] uppercase tracking-[0.2em] text-muted">Founding coffee partner</p>
            </Link>
          </div>
          <p className="mt-10 text-center">
            <Link href="/partners" className="btn-ghost">Become a partner →</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-sand">
        <div className="container-x py-24 text-center sm:py-32">
          <Reveal>
            <p className="eyebrow">By invitation</p>
            <h2 className="mx-auto mt-6 max-w-3xl font-serif text-display">
              Tell us a little <em className="text-brass">about yourself.</em>
            </h2>
            <Link href="/invitation" className="btn-primary mt-10">
              Request an invitation →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
