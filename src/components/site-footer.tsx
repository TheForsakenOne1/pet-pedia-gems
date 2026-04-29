export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink/20 bg-ink text-cream md:mt-32">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="font-serif text-4xl leading-none md:text-5xl">Pelt &amp; Paw.</p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">
              An editorial almanac of the breeds that share our homes — researched,
              photographed, and written for people who take their animals seriously.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-gold">Sections</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>The Dog Index</li>
              <li>The Cat Index</li>
              <li>Care &amp; Husbandry</li>
              <li>Field Notes</li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow text-gold">The Newsletter</p>
            <p className="mt-5 text-sm text-cream/70">A long-form essay every Sunday morning.</p>
            <form className="mt-4 flex border-b border-cream/40 pb-2">
              <input
                type="email"
                placeholder="your@inbox.com"
                className="flex-1 bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button type="button" className="text-xs font-semibold uppercase tracking-[0.2em] text-gold hover:text-cream">
                Subscribe →
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/15 pt-6 text-xs uppercase tracking-[0.2em] text-cream/50 md:flex-row">
          <p>© MMXXVI Pelt &amp; Paw Editorial</p>
          <p>Set in Instrument Serif &amp; Work Sans</p>
        </div>
      </div>
    </footer>
  );
}
