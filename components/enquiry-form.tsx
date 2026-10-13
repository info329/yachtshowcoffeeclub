"use client";

import Link from "next/link";
import { useState } from "react";
import { showOptions, site } from "@/lib/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; mailto?: string };

function mailtoFor(subject: string, text: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

async function post(payload: Record<string, unknown>, setState: (s: State) => void) {
  setState({ kind: "sending" });
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return setState({ kind: "sent" });
    if (data.error === "unconfigured") {
      return setState({
        kind: "error",
        message: "Our form inbox isn't connected just yet — one click sends this to us by email instead.",
        mailto: mailtoFor(data.subject, data.text),
      });
    }
    setState({ kind: "error", message: data.error || "Something went wrong. Please try again." });
  } catch {
    setState({ kind: "error", message: `We couldn't send that. Please email ${site.email}.` });
  }
}

function Status({ state, sentText }: { state: State; sentText: string }) {
  if (state.kind === "sent") {
    return (
      <div className="border border-brass/50 bg-cream-50 p-8 text-center" role="status">
        <p className="font-serif text-3xl">Thank you.</p>
        <p className="mt-3 text-[16px] text-deep/75">{sentText}</p>
        <Link href="/" className="btn-ghost mt-8">Back to the club</Link>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="border-l-2 border-brass bg-sand/60 px-5 py-4 text-[15px]" role="alert">
        <p>{state.message}</p>
        {state.mailto ? <a href={state.mailto} className="btn-primary mt-4">Send by email →</a> : null}
      </div>
    );
  }
  return null;
}

const Honeypot = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" value={value} onChange={(e) => onChange(e.target.value)} />
);

export function InvitationForm({ defaultShow = "" }: { defaultShow?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", role: "", company: "", show: defaultShow, introducedBy: "", message: "", privacy: false, website: "" });
  const set = (k: keyof typeof f) => (v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  if (state.kind === "sent") return <Status state={state} sentText="We read every request personally. When we reply, it's from a person." />;

  return (
    <form
      className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        post({ kind: "invitation", ...f, privacy: f.privacy === true }, setState);
      }}
    >
      <Input label="First name" required value={f.firstName} onChange={set("firstName")} autoComplete="given-name" />
      <Input label="Last name" required value={f.lastName} onChange={set("lastName")} autoComplete="family-name" />
      <Input label="Email" type="email" required value={f.email} onChange={set("email")} autoComplete="email" />
      <Input label="Your role in the marine world" required value={f.role} onChange={set("role")} placeholder="Captain, owner, broker, yard…" />
      <Input label="Company or vessel" value={f.company} onChange={set("company")} autoComplete="organization" />
      <label className="block">
        <span className="label">Which show interests you?</span>
        <select className="field" value={f.show} onChange={(e) => set("show")(e.target.value)}>
          <option value="">Select…</option>
          {showOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <div className="sm:col-span-2"><Input label="Who introduced you to the club?" value={f.introducedBy} onChange={set("introducedBy")} /></div>
      <label className="block sm:col-span-2">
        <span className="label">Anything else you&apos;d like to tell us?</span>
        <textarea className="field min-h-[110px]" value={f.message} onChange={(e) => set("message")(e.target.value)} maxLength={4000} />
      </label>
      <label className="flex items-start gap-3 text-[14px] sm:col-span-2">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#183a5b]" checked={f.privacy} onChange={(e) => set("privacy")(e.target.checked)} />
        <span>I agree to the <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>. *</span>
      </label>
      <Honeypot value={f.website} onChange={set("website")} />
      <div className="sm:col-span-2"><Status state={state} sentText="" /></div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send my request →"}
        </button>
        <p className="mt-4 text-[13px] text-muted">We read every request personally. No automated emails — when we reply, it&apos;s from a person.</p>
      </div>
    </form>
  );
}

const PARTNER_SHOWS = ["Cannes", "Monaco", "Fort Lauderdale", "Antigua", "Palm Beach", "Palma", "All shows / season", "Not sure yet"];

export function PartnerForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [f, setF] = useState({ name: "", company: "", email: "", message: "", website: "" });
  const [shows, setShows] = useState<string[]>([]);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  if (state.kind === "sent") return <Status state={state} sentText="We respond personally, within 48 hours." />;

  return (
    <form
      className="relative grid gap-x-8 gap-y-7 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        post({ kind: "partner", ...f, shows }, setState);
      }}
    >
      <Input label="Name" required value={f.name} onChange={set("name")} autoComplete="name" />
      <Input label="Company" required value={f.company} onChange={set("company")} autoComplete="organization" />
      <div className="sm:col-span-2"><Input label="Email" type="email" required value={f.email} onChange={set("email")} autoComplete="email" /></div>
      <fieldset className="sm:col-span-2">
        <legend className="label">Which shows interest you?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {PARTNER_SHOWS.map((s) => {
            const on = shows.includes(s);
            return (
              <button
                type="button"
                key={s}
                aria-pressed={on}
                onClick={() => setShows((p) => (on ? p.filter((x) => x !== s) : [...p, s]))}
                className={`rounded-full border px-4 py-2 text-[13px] transition ${on ? "border-deep bg-deep text-cream" : "border-line hover:border-deep"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="block sm:col-span-2">
        <span className="label">Tell us about your brand</span>
        <textarea className="field min-h-[110px]" value={f.message} onChange={(e) => set("message")(e.target.value)} maxLength={4000} />
      </label>
      <Honeypot value={f.website} onChange={set("website")} />
      <div className="sm:col-span-2"><Status state={state} sentText="" /></div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Sending…" : "Send enquiry →"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}{required ? " *" : ""}</span>
      <input className="field" type={type} required={required} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
