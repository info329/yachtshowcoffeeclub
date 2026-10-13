import { ROASTERS_API } from "./site";

/**
 * The Onshore Roasters range, as sold on this site.
 *
 * Prices, VAT and delivery always come from Onshore Roasters at checkout (the
 * basket holds only SKUs and quantities). The catalogue is read from their
 * public API so a price change there shows here within minutes; the copy
 * below is the club's own presentation of each coffee, and the fallback if
 * their API cannot be reached while the page builds.
 */

export interface Coffee {
  sku: string;
  slug: string;
  name: string;
  subtitle: string;
  /** Shelf price, VAT included, per 1 kg bag. */
  priceCents: number;
  image: string;
  origin: string;
  notes: string[];
  story: string;
  serve: string;
  /** Where it fits in a show week. */
  moment: string;
}

export const COFFEES: Coffee[] = [
  {
    sku: "CB01kg",
    slug: "crew-beans",
    name: "Crew Beans",
    subtitle: "Brazilian single origin · chocolate, hazelnut, fudge",
    priceCents: 3500,
    image: "/coffee/crew-beans.jpg",
    origin: "Brazil",
    notes: ["Milk chocolate", "Hazelnut", "Fudge"],
    story:
      "A Brazilian single origin built for long days on board: milk chocolate, hazelnut and a fudge-like finish. It's forgiving on a busy machine, so it tastes right even when the shot is rushed.",
    serve: "With milk it makes a nutty, chocolatey latte; as espresso it's sweet and syrupy.",
    moment: "The 6am set-up, the crew mess, the long show day.",
  },
  {
    sku: "GB01kg",
    slug: "guest-beans",
    name: "Guest Beans",
    subtitle: "Colombian · Brazilian blend · stone fruit, maple cream",
    priceCents: 3800,
    image: "/coffee/guest-beans.jpg",
    origin: "Colombia & Brazil",
    notes: ["Stone fruit", "Maple cream", "Syrupy body"],
    story:
      "A high-altitude Colombian blended with a rounder Brazilian. The Colombian brings bright stone fruit; the Brazilian adds body and a maple-cream sweetness. This is the coffee poured at the club's mornings.",
    serve: "As espresso it's syrupy and balanced; in milk it stays light without losing its fruit.",
    moment: "The guest cup — the one people ask about.",
  },
  {
    sku: "DB1KG",
    slug: "decaf-beans",
    name: "Decaf Beans",
    subtitle: "Swiss Water® Process · chocolate, berries",
    priceCents: 3600,
    image: "/coffee/decaf-beans.jpg",
    origin: "Swiss Water® decaf",
    notes: ["Dark chocolate", "Red berries", "Clean finish"],
    story:
      "Decaffeinated by the Swiss Water® Process, which uses only water, temperature and time — no chemical solvents. 99.9% caffeine-free and still tastes like coffee: chocolate and berries in the cup.",
    serve: "Good as espresso or with milk, at any hour.",
    moment: "The after-dinner espresso on the aft deck.",
  },
];

interface ApiProduct {
  sku: string;
  slug: string | null;
  name: string;
  subtitle: string | null;
  imageUrl: string | null;
  priceCents: number;
}

/** The range with live prices from Onshore Roasters; the fallback if unreachable. */
export async function getCoffees(): Promise<Coffee[]> {
  try {
    const res = await fetch(`${ROASTERS_API}/api/shop/catalog`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return COFFEES;
    const data = (await res.json()) as { products?: ApiProduct[] };
    const live = new Map((data.products ?? []).map((p) => [p.sku, p]));
    if (live.size === 0) return COFFEES;
    // Our three, with today's price; any we list that they no longer sell is dropped.
    return COFFEES.flatMap((c) => {
      const p = live.get(c.sku);
      if (!p) return [];
      return [{ ...c, name: p.name || c.name, priceCents: p.priceCents ?? c.priceCents }];
    });
  } catch {
    return COFFEES;
  }
}

export function coffeeBySku(sku: string): Coffee | undefined {
  return COFFEES.find((c) => c.sku === sku);
}
