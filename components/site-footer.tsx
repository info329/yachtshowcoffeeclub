import Link from "next/link";
import Image from "next/image";
import { Logo } from "./logo";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-deep-900 text-cream">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-cream/70">
            An invitation-only gathering for the marine professional community — powered by Project Yachting, in
            partnership with Onshore Roasters.
          </p>
          <Link href="/invitation" className="btn-brass mt-8">
            Request an invitation <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow">Navigate</p>
          <ul className="mt-5 space-y-3 text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline text-cream/80 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow">The coffee</p>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li><Link href="/coffee#crew-beans" className="link-underline text-cream/80 hover:text-cream">Crew Beans</Link></li>
            <li><Link href="/coffee#guest-beans" className="link-underline text-cream/80 hover:text-cream">Guest Beans</Link></li>
            <li><Link href="/coffee#decaf-beans" className="link-underline text-cream/80 hover:text-cream">Decaf Beans</Link></li>
            <li><Link href="/coffee#orders" className="link-underline text-cream/80 hover:text-cream">Orders &amp; delivery</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow">Harbour</p>
          <a href={`mailto:${site.email}`} className="link-underline mt-5 inline-block text-[15px] text-cream/90">
            {site.email}
          </a>
          <p className="mt-4 text-[14px] leading-relaxed text-cream/60">{site.shows.join(" · ")}</p>
          <a href={site.onshoreRoasters} target="_blank" rel="noopener" className="mt-8 block opacity-80 transition hover:opacity-100">
            <span className="sr-only">Onshore Roasters</span>
            <Image src="/images/onshore-wordmark-light.png" alt="" width={1214} height={184} className="h-auto w-40" />
          </a>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-3 py-6 text-[12px] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Yacht Show Coffee Club · Powered by Project Yachting</p>
          <p className="flex gap-6">
            <Link href="/privacy" className="hover:text-cream">Privacy policy</Link>
            <Link href="/coffee#orders" className="hover:text-cream">Coffee orders by Onshore Roasters</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
