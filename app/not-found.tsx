import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pt-24">
      <div className="container-x text-center">
        <p className="eyebrow">Off course · 404</p>
        <h1 className="mt-6 font-serif text-display">This page has drifted out of harbour.</h1>
        <Link href="/" className="btn-primary mt-10">Return to port →</Link>
      </div>
    </section>
  );
}
