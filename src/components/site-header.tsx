import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:px-10 md:py-4">
        <Link to="/" onClick={() => setOpen(false)} className="group flex items-baseline gap-3">
          <span className="font-serif text-xl leading-none tracking-tight sm:text-2xl md:text-3xl">
            Pelt <span className="italic text-rust">&amp;</span> Paw
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground lg:inline">
            Vol. XXVI · Est. 2026
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] md:flex md:gap-8">
          <Link to="/" activeOptions={{ exact: true }} className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Index</Link>
          <Link to="/dogs" className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Dogs</Link>
          <Link to="/cats" className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">Cats</Link>
          <Link to="/about" className="border-b border-transparent pb-1 transition data-[status=active]:border-ink hover:text-rust">About</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 inline-flex items-center justify-center p-2 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-ink/15 bg-cream md:hidden">
          <ul className="flex flex-col px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em]">
            {[
              { to: "/", label: "Index", exact: true },
              { to: "/dogs", label: "Dogs" },
              { to: "/cats", label: "Cats" },
              { to: "/about", label: "About" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={l.exact ? { exact: true } : undefined}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink/10 py-3 transition data-[status=active]:text-rust"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
