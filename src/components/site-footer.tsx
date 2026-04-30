export function SiteFooter() {
  return (
    <footer className="mt-24 surface-onyx text-cream md:mt-32">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="font-serif text-5xl leading-[0.95] tracking-tight md:text-6xl">
              Pelt
              <span className="italic font-normal text-champagne" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                {" "}&amp;{" "}
              </span>
              Paw.
            </p>
            <p className="mt-7 max-w-md text-sm leading-relaxed text-cream/65">
              A considered almanac of the breeds that share our homes — researched,
              photographed, and written for people who take their animals seriously.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-10 bg-champagne/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-champagne/80">Est. MMXXVI</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-champagne">Sections</p>
            <ul className="mt-6 space-y-3 text-sm text-cream/85">
              <li className="transition hover:text-champagne">Canines</li>
              <li className="transition hover:text-champagne">Felines</li>
              <li className="transition hover:text-champagne">Care &amp; Husbandry</li>
              <li className="transition hover:text-champagne">Field Notes</li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-champagne">The Newsletter</p>
            <p className="mt-6 text-sm leading-relaxed text-cream/65">
              A long-form essay every Sunday morning. No promotions. No filler.
            </p>
            <form className="mt-6 flex items-center gap-2 rounded-full border border-cream/15 bg-cream/5 p-1.5 backdrop-blur transition focus-within:border-champagne/60">
              <input
                type="email"
                placeholder="your@inbox.com"
                className="flex-1 bg-transparent px-4 text-sm text-cream placeholder:text-cream/35 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-full bg-champagne px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-cream"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-cream/12 pt-8 text-[10px] uppercase tracking-[0.28em] text-cream/45 md:flex-row">
          <p>© MMXXVI Pelt &amp; Paw Editorial</p>
          <p>Set in Fraunces &amp; Inter Tight</p>
        </div>
      </div>
    </footer>
  );
}
