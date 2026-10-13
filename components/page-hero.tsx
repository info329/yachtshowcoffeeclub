/** The opening band of an inner page. */
export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand/60 pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div className="container-x">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-6 max-w-5xl animate-rise font-serif text-display [animation-delay:120ms]">{title}</h1>
        {intro ? (
          <div className="mt-8 max-w-2xl animate-rise text-[17px] leading-relaxed text-deep/75 [animation-delay:240ms]">{intro}</div>
        ) : null}
      </div>
      <svg aria-hidden className="pointer-events-none absolute -right-24 -top-10 hidden h-[460px] w-[460px] text-brass/25 md:block" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" />
      </svg>
    </section>
  );
}
