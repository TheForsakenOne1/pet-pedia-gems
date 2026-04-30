import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks: { to: string; label: string; exact?: boolean }[] = [
    { to: "/", label: "Index", exact: true },
    { to: "/dogs", label: "Canines" },
    { to: "/cats", label: "Felines" },
    { to: "/about", label: "Masthead" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink/10 bg-bone/85 backdrop-blur-xl shadow-[0_1px_30px_-15px_rgba(0,0,0,0.15)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10 md:py-5">
        <Link to="/" onClick={() => setOpen(false)} className="group flex items-baseline gap-3">
          <span className="font-serif text-2xl leading-none tracking-tight sm:text-[1.6rem] md:text-3xl">
            Pelt
            <span className="mx-1 italic font-normal text-brass" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
              &amp;
            </span>
            Paw
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground lg:inline">
            Vol. XXVI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              className="group relative rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70 transition-colors hover:text-ink data-[status=active]:text-ink"
            >
              {l.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-center scale-x-0 bg-brass transition-transform duration-300 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
            </Link>
          ))}
          <Link
            to="/dogs"
            className="ml-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition-all hover:bg-brass"
          >
            Begin reading <span aria-hidden>→</span>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-bone/60 backdrop-blur transition hover:border-ink md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="border-t border-ink/10 bg-bone md:hidden">
          <ul className="flex flex-col px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em]">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={l.exact ? { exact: true } : undefined}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink/8 py-4 transition data-[status=active]:text-brass"
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
