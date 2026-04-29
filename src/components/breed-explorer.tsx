import { useMemo } from "react";
import type { BreedSummary } from "@/types/breed";
import { BreedCard } from "@/components/breed-card";
import { Search, X } from "lucide-react";
import { tokenize, matchesAll } from "@/lib/search";

export interface ExplorerState {
  q: string;
  filters: string[];
}

interface Props {
  breeds: BreedSummary[];
  state: ExplorerState;
  onChange: (next: ExplorerState) => void;
  emptyLabel?: string;
  /** Human label for chip — if a tag isn't here it gets title-cased */
  labelOverrides?: Record<string, string>;
  /** Max chips to render before showing "show more" */
  maxChips?: number;
}

const DEFAULT_OVERRIDES: Record<string, string> = {
  "highly-trainable": "Highly Trainable",
  "family-friendly": "Family-Friendly",
  "high-energy": "High-Energy",
  "low-energy": "Low-Energy",
  "low-grooming": "Low Grooming",
  "high-grooming": "High Grooming",
  "low-shedding": "Low Shedding",
  "lap-cat": "Lap Cat",
  "dog-friendly": "Dog-Friendly",
  "indoor": "Indoor-Suited",
  "non-sporting": "Non-Sporting",
};

function prettify(tag: string, overrides: Record<string, string>): string {
  if (overrides[tag]) return overrides[tag];
  return tag
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function filterBreeds(breeds: BreedSummary[], state: ExplorerState): BreedSummary[] {
  const tokens = tokenize(state.q);
  const filterSet = new Set(state.filters);
  return breeds.filter((b) => {
    if (filterSet.size > 0) {
      for (const t of filterSet) if (!b.tags.includes(t)) return false;
    }
    if (tokens.length === 0) return true;
    return matchesAll(
      [b.name, b.tagline, b.intro, b.origin, b.group, ...b.temperament, ...b.tags],
      tokens,
    );
  });
}

export function BreedExplorer({
  breeds,
  state,
  onChange,
  emptyLabel = "No breeds match.",
  labelOverrides,
  maxChips = 18,
}: Props) {
  const overrides = { ...DEFAULT_OVERRIDES, ...(labelOverrides || {}) };
  const tokens = useMemo(() => tokenize(state.q), [state.q]);

  // Counts come from breeds matching the current SEARCH only (so chip counts
  // reflect "what would happen if I add this filter on top of the current text").
  // Active filter set is applied for display sort but we still show all chips.
  const chipCounts = useMemo(() => {
    const searchOnly = filterBreeds(breeds, { q: state.q, filters: [] });
    const counts = new Map<string, number>();
    for (const b of searchOnly) {
      for (const t of b.tags) counts.set(t, (counts.get(t) || 0) + 1);
    }
    return counts;
  }, [breeds, state.q]);

  const chips = useMemo(() => {
    const all = Array.from(chipCounts.entries())
      .map(([id, count]) => ({ id, count, label: prettify(id, overrides) }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    // Always include active filters even if their count became 0
    const present = new Set(all.map((c) => c.id));
    for (const f of state.filters) {
      if (!present.has(f)) all.unshift({ id: f, count: 0, label: prettify(f, overrides) });
    }
    return all.slice(0, maxChips);
  }, [chipCounts, state.filters, maxChips, overrides]);

  const filtered = useMemo(() => filterBreeds(breeds, state), [breeds, state]);

  const toggle = (id: string) => {
    const next = state.filters.includes(id)
      ? state.filters.filter((f) => f !== id)
      : [...state.filters, id];
    onChange({ ...state, filters: next });
  };

  const clearAll = () => onChange({ q: "", filters: [] });

  return (
    <div>
      <div className="mt-8 flex flex-col gap-4 md:mt-10">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
            placeholder="Search by name, temperament, origin, or trait…"
            aria-label="Search breeds"
            className="w-full border border-ink/30 bg-background/60 py-3 pl-11 pr-12 text-sm leading-tight outline-none transition focus:border-ink focus:ring-1 focus:ring-ink md:text-base"
          />
          {state.q && (
            <button
              type="button"
              onClick={() => onChange({ ...state, q: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-rust"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips — derived from real API tags, with counts */}
        {chips.length > 0 && (
          <div className="-mx-1 flex flex-wrap gap-2">
            {chips.map((f) => {
              const on = state.filters.includes(f.id);
              const disabled = !on && f.count === 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggle(f.id)}
                  aria-pressed={on}
                  disabled={disabled}
                  className={`mx-1 inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                    on
                      ? "border-ink bg-ink text-cream"
                      : disabled
                      ? "cursor-not-allowed border-ink/15 text-foreground/30"
                      : "border-ink/30 text-foreground/70 hover:border-ink hover:text-ink"
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`text-[10px] tabular-nums ${
                      on ? "text-cream/70" : "text-foreground/40"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
            {(state.filters.length > 0 || state.q) && (
              <button
                type="button"
                onClick={clearAll}
                className="mx-1 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rust underline-offset-4 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {filtered.length} of {breeds.length} {breeds[0]?.species === "dog" ? "dogs" : "cats"}
          {state.filters.length > 0 && ` · ${state.filters.length} filter${state.filters.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 border-y border-ink/20 py-16 text-center md:mt-20 md:py-20">
          <p className="eyebrow text-rust">No matches</p>
          <h3 className="display-md mt-3">{emptyLabel}</h3>
          <p className="mt-3 text-sm text-muted-foreground">Try a broader search or remove a filter.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 inline-block border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em] hover:text-rust"
          >
            Clear all filters →
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-12 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-10" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} tokens={tokens} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
