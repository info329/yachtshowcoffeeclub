import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { chapters, events, site } from "@/lib/site";
import { Gallery } from "@/components/gallery";

const PALMA = [
  "Guests in conversation aboard the yacht",
  "Tamping a shot of Onshore Roasters coffee",
  "Morning coffee in the cockpit",
  "Arriving on the dock in Palma",
  "Introductions on deck",
  "Old friends, new introductions",
  "Coffee and conversation",
  "The yacht that hosted the morning",
  "Last cups before the show opens",
].map((alt, i) => ({ src: `/gallery/palma-${String(i + 1).padStart(2, "0")}.jpg`, alt }));

export const metadata: Metadata = {
  title: "Events",
  description: "Where the Yacht Show Coffee Club gathers next — Cannes, Monaco, Fort Lauderdale and Antigua.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="A season across multiple coastlines"
        title={<>Where the club <em className="text-brass">gathers next.</em></>}
        intro="A calendar built across the great shows of Europe, America and the Caribbean. Members are contacted personally first; the rest is by request."
      />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <p className="eyebrow">Upcoming</p>
          <ul className="mt-10 border-t border-line">
            {events.map((e, i) => (
              <li key={e.key} className="border-b border-line">
                <Reveal delay={i * 80} className="group grid gap-4 py-10 transition-colors hover:bg-sand/50 md:grid-cols-12 md:items-center md:px-4">
                  <p className="font-serif text-xl text-brass md:col-span-2">{e.when}</p>
                  <div className="md:col-span-6">
                    <h2 className="font-serif text-title">{e.name}</h2>
                    <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-muted">{e.where}</p>
                  </div>
                  <p className="text-[15px] leading-relaxed text-deep/75 md:col-span-3">{e.note}</p>
                  <div className="md:col-span-1 md:text-right">
                    <Link
                      href={`/invitation?show=${encodeURIComponent(e.name)}`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-deep/30 transition group-hover:border-deep group-hover:bg-deep group-hover:text-cream"
                      aria-label={`Request a place at ${e.name}`}
                    >
                      →
                    </Link>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand/60 py-24 sm:py-32">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">The chapters so far</p>
            <h2 className="mt-6 font-serif text-title">Every morning, a little bigger.</h2>
          </div>
          <ol className="space-y-10 md:col-span-7 md:col-start-6">
            {chapters.map((c) => (
              <li key={c.show} className="grid grid-cols-[80px_1fr] gap-6 border-b border-line pb-10">
                <span className="font-serif text-3xl text-brass">{c.year}</span>
                <div>
                  <p className="font-serif text-2xl">{c.show}</p>
                  <p className="mt-2 text-[15px] text-deep/75">{c.line}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Gallery · Palma International Boat Show 2026</p>
              <h2 className="mt-6 font-serif text-display">In the room.</h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              A morning aboard in Palma, with Onshore Roasters behind the machine. Were you there?{" "}
              <a href={`mailto:${site.email}?subject=Palma%20image%20set`} className="underline underline-offset-4">Ask us for the full image set.</a>
            </p>
          </div>
          <div className="mt-12">
            <Gallery photos={PALMA} />
          </div>
        </div>
      </section>
    </>
  );
}
