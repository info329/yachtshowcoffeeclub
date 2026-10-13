/** Site-wide facts. */
export const site = {
  name: "The Yacht Show Coffee Club",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.yachtshowcoffeeclub.com").replace(/\/+$/, ""),
  email: "hello@yachtshowcoffeeclub.com",
  projectYachting: "https://www.project-yachting.com",
  onshoreRoasters: "https://onshoreroasters.com",
  shows: ["Palm Beach", "Palma", "Cannes", "Monaco", "Fort Lauderdale", "Antigua"],
};

/** The Onshore Roasters ops app that prices, takes and fulfils coffee orders. */
export const ROASTERS_API = (process.env.NEXT_PUBLIC_ROASTERS_API || "https://app.onshoreroasters.com").replace(/\/+$/, "");

/** Onshore Roasters' storefront, for its terms of sale and privacy notice. */
export const ROASTERS_SITE = (process.env.NEXT_PUBLIC_ROASTERS_SITE || "https://app.onshoreroasters.com/website").replace(
  /\/+$/,
  "",
);

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/coffee", label: "The Coffee" },
  { href: "/partners", label: "Partners" },
  { href: "/membership", label: "Members" },
];

export const events = [
  {
    name: "Cannes Yachting Festival",
    where: "Vieux Port, Cannes, France",
    when: "September 2026",
    note: "Where the club began — a coffee shop, a conversation.",
    key: "cannes",
  },
  {
    name: "Monaco Yacht Show",
    where: "Port Hercules, Monaco",
    when: "September 2026",
    note: "On the principality, with the season's biggest names.",
    key: "monaco",
  },
  {
    name: "Fort Lauderdale International Boat Show",
    where: "Fort Lauderdale, Florida",
    when: "October / November 2026",
    note: "The yachting capital of the world — our largest US morning.",
    key: "fort-lauderdale",
  },
  {
    name: "Antigua Charter Yacht Show",
    where: "Nelson's Dockyard, Antigua",
    when: "December 2026",
    note: "Caribbean season opener — where the charter fleet gathers.",
    key: "antigua",
  },
];

export const chapters = [
  { year: "2025", show: "Cannes Yachting Festival", line: "Where it began — a coffee shop, a conversation, the spark." },
  { year: "2026", show: "Palm Beach International", line: "Aboard a yacht. The morning that took the idea onto the water." },
  { year: "2026", show: "Palma International Boat Show", line: "On the Mediterranean — with Onshore Roasters." },
];

export const showOptions = [
  "Cannes Yachting Festival",
  "Monaco Yacht Show",
  "Fort Lauderdale International Boat Show",
  "Antigua Charter Yacht Show",
  "Palm Beach International Boat Show",
  "Palma International Boat Show",
  "Any / a future show",
];
