import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group flex items-baseline gap-3">
          <span className="font-serif text-2xl leading-none tracking-tight md:text-3xl">
            Pelt <span className="italic text-rust">&amp;</span> Paw
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground md:inline">
            Vol. XXVI · Est. 2026
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] md:gap-9">
          <Link to="/" activeOptions={{ exact: true }} className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Index</Link>
          <Link to="/dogs" className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Dogs</Link>
          <Link to="/cats" className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Cats</Link>
          <Link to="/about" className="hidden border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust md:inline">About</Link>
        </nav>
      </div>
    </header>
  );
}
