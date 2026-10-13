import type { Metadata } from "next";
import Image from "next/image";
import { InvitationForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Request an invitation",
  description: "The club is invitation-only. If you're a yacht owner, captain or work in the yachting world, tell us a little about yourself.",
  alternates: { canonical: "/invitation" },
};

export default async function InvitationPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const { show } = await searchParams;
  return (
    <section className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src="/images/gathering-21.jpg" alt="Guests talking on deck at a club morning" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-900/80 to-transparent" />
        <blockquote className="absolute bottom-12 left-12 right-12 font-serif text-3xl italic leading-snug text-cream">
          “Every person in the room is there because they were asked.”
        </blockquote>
      </div>
      <div className="px-5 pb-24 pt-36 sm:px-12 lg:px-16 lg:pt-40">
        <p className="eyebrow">By invitation</p>
        <h1 className="mt-6 font-serif text-display">Tell us a little <em className="text-brass">about yourself.</em></h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-deep/75">
          The club is invitation-only, which means everyone in the room belongs there. If you&apos;re a yacht owner, captain or
          simply work in the yachting world and this sounds like your kind of morning, we&apos;d love to hear from you.
        </p>
        <div className="mt-12 max-w-2xl">
          <InvitationForm defaultShow={show ?? ""} />
        </div>
      </div>
    </section>
  );
}
