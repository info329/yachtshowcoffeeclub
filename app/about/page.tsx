import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The story of the Yacht Show Coffee Club — from a Cannes coffee shop to a yacht in Palm Beach to Palma with Onshore Roasters.",
  alternates: { canonical: "/about" },
};

const chapters = [
  {
    n: "01",
    place: "Cannes, France",
    title: "A coffee shop, a conversation.",
    body: "It started informally — a conversation in the yachting world that sparked something bigger than expected. The enthusiasm from those first gatherings was the signal that something real was here.",
  },
  {
    n: "02",
    place: "Palm Beach, USA",
    title: "Aboard a yacht.",
    body: "From Cannes it moved aboard a yacht at the Palm Beach Boat Show, taking the idea literally onto the water. The same conversation, on a new coast.",
  },
  {
    n: "03",
    place: "Palma, Mallorca",
    title: "With Onshore Roasters.",
    body: "The third chapter brought it to Palma — in partnership with Onshore Roasters — cementing the club's identity as a genuinely international community, rooted in both the Mediterranean and US yachting worlds.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The story so far"
        title={<>Three chapters, <em className="text-brass">one community.</em></>}
        intro="The Yacht Show Coffee Club is an invitation-only gathering for the marine professional community — a warm, genuine conversation between people who belong together."
      />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <ol className="relative space-y-20 before:absolute before:bottom-0 before:left-[27px] before:top-2 before:w-px before:bg-line md:before:left-1/2">
            {chapters.map((c, i) => (
              <li key={c.n} className="relative grid gap-6 pl-20 md:grid-cols-2 md:gap-20 md:pl-0">
                <span className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border border-brass bg-cream font-serif text-xl text-brass md:left-1/2 md:-translate-x-1/2">
                  {c.n}
                </span>
                <Reveal className={i % 2 ? "md:col-start-2" : "md:pr-16 md:text-right"}>
                  <p className="eyebrow">Chapter {c.n} · {c.place}</p>
                  <h2 className="mt-4 font-serif text-title">{c.title}</h2>
                  <p className="mt-5 text-[17px] leading-relaxed text-deep/80">{c.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid md:grid-cols-3">
        {["/images/gathering-5.jpg", "/images/gathering-21.jpg", "/images/gathering-29.jpg"].map((src) => (
          <div key={src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={src} alt="A Yacht Show Coffee Club morning in Palma" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="bg-deep text-cream">
        <div className="container-x py-24 sm:py-32">
          <Reveal>
            <p className="eyebrow !text-brass-light text-center">What it stands for</p>
            <blockquote className="mx-auto mt-8 max-w-4xl text-center font-serif text-title italic leading-snug">
              “People matter more than logos. Conversations matter more than introductions. Every person in the room is there
              because they were asked.”
            </blockquote>
          </Reveal>
          <div className="mt-20 grid gap-px bg-cream/10 md:grid-cols-3">
            {[
              ["Warm, not cold", "Invitation-only without being exclusive. Like a friend recommending a private club."],
              ["Understated", "No hard sell, no flashy claims. The kind of club that doesn't need to shout."],
              ["Sea & coffee", "Two worlds that share a love of craft, quality and community. That's the thread."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 120} className="bg-deep p-10">
                <p className="font-serif text-3xl">{t}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-cream/70">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center sm:py-32">
        <div className="container-x">
          <p className="eyebrow">If this sounds like you</p>
          <h2 className="mt-6 font-serif text-display">We&apos;d love to hear from you.</h2>
          <Link href="/invitation" className="btn-primary mt-10">Request an invitation →</Link>
        </div>
      </section>
    </>
  );
}
