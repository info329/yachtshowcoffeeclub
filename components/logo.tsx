import Link from "next/link";

export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="The Yacht Show Coffee Club — home" className={`group flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className={`h-9 w-9 shrink-0 ${light ? "text-cream" : "text-deep"}`} aria-hidden>
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="20" cy="20" r="15.5" fill="none" stroke="#bc9359" strokeWidth="0.75" />
        {/* a coffee bean that is also a hull */}
        <path d="M11 22c3 4 15 4 18 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M20 9v12M20 11l6 8h-6M20 13l-5 6h5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M13 27c2.3 1.2 4.6 1.2 7 0s4.7-1.2 7 0" fill="none" stroke="#bc9359" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <span className={`leading-none ${light ? "text-cream" : "text-deep"}`}>
        <span className="block font-serif text-[19px] font-medium tracking-tight">The Yacht Show</span>
        <span className="mt-0.5 block text-[9.5px] font-medium uppercase tracking-[0.34em] text-brass">Coffee Club</span>
      </span>
    </Link>
  );
}
