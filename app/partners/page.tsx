import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { PartnerForm } from "@/components/enquiry-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partners",
  description: "Project Yachting and Onshore Roasters make the club possible. Partner with the Yacht Show Coffee Club at the world's great boat shows.",
  alternates: { canonical: "/partners" },
};

const tiers = [
  {
    name: "Show Partner",
    price: "Per show — fee on request",
    perks: ["Logo on event signage", "Social mention before & after", "Two guest places at the morning", "Listing & short story on this page"],
  },
  {
    name: "Season Partner",
    price: "Full season — fee on request",
    featured: true,
    perks: ["Everything in Show Partner, full season", "Featured in member email newsletter", "Co-branded content opportunity at one event", "Option to address the group at a show of choice"],
  },
  {
    name: "Category Partner",
    price: "Negotiated",
    perks: ["Exclusive ownership of a named category", "e.g. 'Official Marine Insurance Partner'", "Combined with Show or Season tier", "Locks competitors out of the room"],
  },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Our partners"
        title={<>Made possible by people <em className="text-brass">who believe in it.</em></>}
        intro="Each of our partners is chosen because they belong in the room as much as our members do. We're grateful to all of them."
      />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-px bg-line md:grid-cols-2">
          <Reveal className="bg-cream p-8 sm:p-14">
            <p className="eyebrow">Founding organisation</p>
            <h2 className="mt-6 font-serif text-display">Project Yachting.</h2>
            <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-deep/80">
              <p>
                Project Yachting is the reason this club exists. They have spent years networking and building relationships
                around the world — connecting people, strengthening relationships, and quietly shaping how the industry meets
                itself.
              </p>
              <p>
                The club came out of a conversation in a Cannes coffee shop and an instinct to bring the marine community
                together differently — warmer, smaller, more genuine than a trade stand or drinks evening.
              </p>
            </div>
            <a href={site.projectYachting} target="_blank" rel="noopener" className="btn-ghost mt-10">Visit Project Yachting →</a>
          </Reveal>
          <Reveal className="bg-cream p-8 sm:p-14" delay={120}>
            <p className="eyebrow">Founding coffee partner</p>
            <Image src="/images/onshore-wordmark-ink.png" alt="Onshore Roasters" width={1214} height={184} className="mt-8 h-auto w-72" />
            <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-deep/80">
              <p className="font-serif text-2xl text-deep">Yacht coffee — freshly roasted &amp; delivered to your berth.</p>
              <p>
                Specialty coffee roasted to order and delivered to marinas across the Mediterranean, Caribbean and beyond.
                Trusted by superyacht crews worldwide for reliable yacht provisioning.
              </p>
              <p className="italic">“A lovely way to showcase our bespoke coffee.”</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/coffee" className="btn-primary">Shop the coffee →</Link>
              <a href={site.onshoreRoasters} target="_blank" rel="noopener" className="btn-ghost">Visit Onshore Roasters</a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-deep text-cream">
        <div className="container-x grid gap-16 py-24 sm:py-32 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow !text-brass-light">Work with us</p>
            <h2 className="mt-6 font-serif text-display">Every person in our room was personally invited.</h2>
            <p className="mt-6 font-serif text-2xl italic text-brass-light">That&apos;s why your brand belongs here.</p>
          </Reveal>
          <Reveal className="space-y-10 md:col-span-6 md:col-start-7" delay={120}>
            <div>
              <p className="eyebrow !text-brass-light">The audience</p>
              <p className="mt-4 font-serif text-3xl">The full marine ecosystem, in one room.</p>
              <p className="mt-4 text-[16px] leading-relaxed text-cream/75">
                Yacht owners. Captains &amp; crew, shipyards. Sales &amp; charter professionals. Family offices, marina operators,
                yacht designers and yacht industry professionals. The people who make decisions, and the people they trust —
                across five countries, at six of the world&apos;s most prestigious shows.
              </p>
            </div>
            <div>
              <p className="eyebrow !text-brass-light">Why invitation-only matters</p>
              <p className="mt-4 text-[16px] leading-relaxed text-cream/75">
                Every attendee is a verified professional from the yachting landscape, personally reviewed before receiving an
                invitation. No noise. No footfall. No accidental attendees. When your brand is part of a morning, you are in
                front of exactly who you want to be in front of.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <p className="eyebrow">Sponsorship tiers</p>
          <h2 className="mt-6 font-serif text-display">Three ways to be in the room.</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className={`relative flex h-full flex-col border p-8 sm:p-10 ${t.featured ? "border-deep bg-deep text-cream" : "border-line bg-cream-50"}`}>
                  {t.featured ? <span className="absolute -top-3 left-8 bg-brass px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-deep-900">Most chosen</span> : null}
                  <p className="font-serif text-3xl">{t.name}</p>
                  <p className={`mt-2 text-[13px] ${t.featured ? "text-cream/60" : "text-muted"}`}>{t.price}</p>
                  <ul className="mt-8 space-y-4 text-[15px]">
                    {t.perks.map((p) => (
                      <li key={p} className="flex gap-3"><span className="text-brass">✦</span>{p}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-deep/70">
            A brand can hold a Category Partner agreement on top of either a Show or Season tier. The two work together, not as
            alternatives — and no two brands in the same category will ever share a morning. Exact pricing agreed individually;
            get in touch for the current rate card.
          </p>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 border-t border-line bg-sand/60 py-24 sm:py-32">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Apply for next show</p>
            <h2 className="mt-6 font-serif text-display">Tell us about your brand.</h2>
            <p className="mt-6 text-[16px] text-deep/75">A short note is all we need. We respond personally, within 48 hours.</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
