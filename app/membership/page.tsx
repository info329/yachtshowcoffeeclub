import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Members area", alternates: { canonical: "/membership" } };

export default function MembershipPage() {
  return (
    <section className="grain relative flex min-h-[90vh] items-center overflow-hidden bg-deep text-cream">
      <div className="container-x relative z-10 max-w-3xl py-40 text-center">
        <p className="eyebrow !text-brass-light">Members area</p>
        <h1 className="mt-6 font-serif text-display">Launching soon.</h1>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-cream/75">
          We&apos;re putting the finishing touches on the members&apos; directory, insights and introductions platform. Existing
          members and applicants will be notified once the doors open.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-ghost-light">Return to the homepage</Link>
          <Link href="/coffee" className="btn-brass">Order the club coffee</Link>
        </div>
      </div>
    </section>
  );
}
