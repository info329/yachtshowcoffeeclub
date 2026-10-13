import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ROASTERS_SITE, site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy policy." />
      <section className="py-20">
        <div className="container-x max-w-3xl space-y-6 text-[16px] leading-relaxed text-deep/80">
          <h2 className="font-serif text-3xl text-deep">What we collect</h2>
          <p>
            When you request an invitation or send a partner enquiry, we receive what you type into the form: your name, email,
            role, company or vessel, the show you are interested in and your message. We use it only to consider and answer
            your request, and to invite you to club mornings.
          </p>
          <h2 className="font-serif text-3xl text-deep">Coffee orders</h2>
          <p>
            Coffee bought on this site is sold and shipped by Onshore Roasters SAS (Vallauris, France). The details you enter at
            checkout go directly to Onshore Roasters, who process the order and payment (by Stripe) and send you the
            confirmation, invoice and delivery updates. Their{" "}
            <a href={`${ROASTERS_SITE}/privacy`} target="_blank" rel="noopener" className="underline underline-offset-4">privacy notice</a>{" "}
            applies to that information. Your basket is kept in your own browser until you check out.
          </p>
          <h2 className="font-serif text-3xl text-deep">Cookies</h2>
          <p>This site sets no advertising or analytics cookies.</p>
          <h2 className="font-serif text-3xl text-deep">Your rights</h2>
          <p>
            You can ask to see, correct or delete what we hold about you at any time by emailing{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>. We keep enquiries for
            no longer than is needed to answer them and run the club.
          </p>
        </div>
      </section>
    </>
  );
}
