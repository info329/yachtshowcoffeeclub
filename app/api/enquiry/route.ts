import { z } from "zod";
import { sendInternalMail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = (max: number) => z.string().trim().max(max);

const Invitation = z.object({
  kind: z.literal("invitation"),
  firstName: s(100).min(1),
  lastName: s(100).min(1),
  email: s(200).email(),
  role: s(200).min(1),
  company: s(200).optional(),
  show: s(200).optional(),
  introducedBy: s(200).optional(),
  message: s(4000).optional(),
  privacy: z.literal(true),
  website: z.string().optional(),
});

const Partner = z.object({
  kind: z.literal("partner"),
  name: s(200).min(1),
  company: s(200).min(1),
  email: s(200).email(),
  shows: z.array(s(60)).max(10).optional(),
  message: s(4000).optional(),
  website: z.string().optional(),
});

const Body = z.discriminatedUnion("kind", [Invitation, Partner]);

// A small per-instance limit: forms are human-paced.
const hits = new Map<string, number[]>();
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 8;
}

export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return Response.json({ error: "Please check the required fields." }, { status: 400 });
  }
  // Bots fill the hidden field; answer as if it worked.
  if (body.website) return Response.json({ ok: true });
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",").pop()?.trim() || "unknown";
  if (limited(ip)) return Response.json({ error: "Too many requests — please email us instead." }, { status: 429 });

  const lines =
    body.kind === "invitation"
      ? [
          `Name: ${body.firstName} ${body.lastName}`,
          `Email: ${body.email}`,
          `Role: ${body.role}`,
          `Company / vessel: ${body.company || "—"}`,
          `Show: ${body.show || "—"}`,
          `Introduced by: ${body.introducedBy || "—"}`,
          "",
          body.message || "(no message)",
        ]
      : [
          `Name: ${body.name}`,
          `Company: ${body.company}`,
          `Email: ${body.email}`,
          `Shows: ${body.shows?.join(", ") || "—"}`,
          "",
          body.message || "(no message)",
        ];
  const subject =
    body.kind === "invitation"
      ? `Invitation request: ${body.firstName} ${body.lastName}${body.show ? ` — ${body.show}` : ""}`
      : `Partner enquiry: ${body.company}`;

  try {
    const sent = await sendInternalMail({ subject, text: lines.join("\n"), replyTo: body.email });
    // No mail transport configured: say so, so the page offers the email route
    // instead of telling someone their request went through when it didn't.
    if (!sent) return Response.json({ error: "unconfigured", subject, text: lines.join("\n") }, { status: 503 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[enquiry] send failed:", err);
    return Response.json({ error: "We couldn't send that just now. Please email hello@yachtshowcoffeeclub.com." }, { status: 502 });
  }
}
