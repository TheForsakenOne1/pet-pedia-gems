import { useMemo, useState } from "react";
import type { BreedSummary } from "@/types/breed";
import { BreedCard } from "@/components/breed-card";
import { Search, X } from "lucide-react";

interface Props {
  breeds: BreedSummary[];
  /** Available filter chips (tag values) */
  filters: { id: string; label: string }[];
  emptyLabel?: string;
}

export function BreedExplorer({ breeds, filters, emptyLabel = "No breeds match." }: Props) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return breeds.filter(b => {
      if (active.size > 0) {
        const has = Array.from(active).every(t => b.tags.includes(t));
        if (!has) return false;
      }
      if (!needle) return true;
      const hay = [
        b.name,
        b.tagline,
        b.origin,
        b.group,
        ...b.temperament,
        ...b.tags,
      ].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [breeds, q, active]);

  return (
    <div>
      {/* Search + clear */}
      <div className="mt-10 flex flex-col gap-4 md:mt-12">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, temperament, origin, or trait…"
            aria-label="Search breeds"
            className="w-full border border-ink/30 bg-background/60 py-3 pl-11 pr-12 text-sm leading-tight outline-none transition focus:border-ink focus:ring-1 focus:ring-ink md:text-base"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-rust"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="-mx-1 flex flex-wrap gap-2">
          {filters.map(f => {
            const on = active.has(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                aria-pressed={on}
                className={`mx-1 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                  on
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/30 text-foreground/70 hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          {(active.size > 0 || q) && (
            <button
              type="button"
              onClick={() => { setActive(new Set()); setQ(""); }}
              className="mx-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rust underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {filtered.length} of {breeds.length} {breeds[0]?.species === "dog" ? "dogs" : "cats"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-20 border-y border-ink/20 py-20 text-center">
          <p className="eyebrow text-rust">No matches</p>
          <h3 className="display-md mt-3">{emptyLabel}</h3>
          <p className="mt-3 text-sm text-muted-foreground">Try a broader search or remove a filter.</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-10" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
