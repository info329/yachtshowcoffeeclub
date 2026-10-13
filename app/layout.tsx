import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { site } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });

const description =
  "An invitation-only coffee morning for the marine professional community, at six of the world's great boat shows across five countries. With Onshore Roasters.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The Yacht Show Coffee Club — Invitation-Only Boat Show Mornings",
    template: "%s · The Yacht Show Coffee Club",
  },
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: {
    siteName: site.name,
    type: "website",
    title: "The Yacht Show Coffee Club",
    description: "A members-only coffee ritual for the world of yachting — Project Yachting × Onshore Roasters.",
    url: site.url,
    images: [{ url: "/images/hero-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#183a5b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      email: site.email,
      description: "An invitation-only coffee morning for the marine professional community, held at the world's great boat shows.",
      foundingLocation: { "@type": "Place", name: "Cannes, France" },
      parentOrganization: { "@type": "Organization", name: "Project Yachting", url: site.projectYachting },
      sponsor: { "@type": "Organization", name: "Onshore Roasters", url: site.onshoreRoasters },
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-cream focus:px-4 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CartDrawer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
