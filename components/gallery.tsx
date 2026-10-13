"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface Photo {
  src: string;
  alt: string;
}

/** A grid of photos that opens into a full-screen viewer (arrow keys, Esc). */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block aspect-[16/10] h-full w-full overflow-hidden bg-deep"
              aria-label={`Open photo: ${p.alt}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? "(max-width:768px) 100vw, 66vw" : "(max-width:768px) 50vw, 33vw"} className="object-cover transition duration-700 group-hover:scale-[1.05]" />
              <span className="absolute inset-0 bg-deep-900/0 transition group-hover:bg-deep-900/20" />
            </button>
          </li>
        ))}
      </ul>

      {open !== null ? (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-[70] flex items-center justify-center bg-deep-900/95 p-4" onClick={() => setOpen(null)}>
          <div className="relative h-[80vh] w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[open].src} alt={photos[open].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button type="button" onClick={() => setOpen(null)} className="absolute right-4 top-4 h-12 w-12 rounded-full text-3xl text-cream hover:bg-cream/10" aria-label="Close">×</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full text-3xl text-cream hover:bg-cream/10 sm:left-6" aria-label="Previous photo">‹</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full text-3xl text-cream hover:bg-cream/10 sm:right-6" aria-label="Next photo">›</button>
          <p className="absolute bottom-5 left-0 right-0 text-center text-[13px] text-cream/70">{photos[open].alt} · {open + 1} / {photos.length}</p>
        </div>
      ) : null}
    </>
  );
}
