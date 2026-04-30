import { useMemo } from "react";
import type { BreedSummary } from "@/types/breed";
import { BreedCard } from "@/components/breed-card";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { tokenize, matchesAll } from "@/lib/search";
import { Body, DisplayMD, Eyebrow, MicroLabel } from "@/components/typography";

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

  const speciesLabel = breeds[0]?.species === "dog" ? "canines" : "felines";
  const hasQuery = !!state.q;
  const hasFilters = state.filters.length > 0;

  return (
    <div>
      <div className="mt-10 flex flex-col gap-5">
        {/* Search input — premium pill */}
        <div
          className={`group relative rounded-full border bg-cream/70 backdrop-blur transition-all duration-300 ${
            hasQuery
              ? "border-ink shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
              : "border-ink/15 hover:border-ink/30"
          } focus-within:border-ink focus-within:shadow-[0_0_0_4px_rgba(0,0,0,0.04)] focus-within:bg-cream`}
        >
          <Search
            className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition group-focus-within:text-ink"
            aria-hidden
          />
          <input
            type="search"
            value={state.q}
            onChange={(e) => onChange({ ...state, q: e.target.value })}
            placeholder="Search by name, temperament, origin, or trait…"
            aria-label="Search breeds"
            className="w-full bg-transparent py-4 pl-12 pr-12 text-[14px] leading-tight outline-none placeholder:text-muted-foreground/70 md:text-[15px]"
          />
          {state.q && (
            <button
              type="button"
              onClick={() => onChange({ ...state, q: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter chips */}
        {chips.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-3 w-3 text-brass" aria-hidden />
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-brass">
                Refine by trait
              </span>
            </div>
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
                    className="chip mx-1"
                  >
                    <span>{f.label}</span>
                    <span
                      className={`tabular-nums text-[9.5px] ${
                        on ? "text-cream/70" : "text-foreground/40"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}
              {(hasFilters || hasQuery) && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mx-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-rust transition hover:bg-rust/5"
                >
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>
          </div>
        )}

        <MicroLabel>
          {filtered.length} of {breeds.length} {speciesLabel}
          {hasFilters && ` · ${state.filters.length} filter${state.filters.length > 1 ? "s" : ""}`}
        </MicroLabel>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-ink/10 bg-cream/60 px-6 py-20 text-center backdrop-blur md:mt-20">
          <Eyebrow>No matches</Eyebrow>
          <DisplayMD className="mt-3">{emptyLabel}</DisplayMD>
          <Body size="base" className="mx-auto mt-3 max-w-md">
            Try a broader search, drop a filter, or clear everything to see the full almanac.
          </Body>
          <button type="button" onClick={clearAll} className="btn-ghost mt-7 inline-flex items-center gap-2">
            <X className="h-3.5 w-3.5" /> Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-14 md:gap-x-10 md:gap-y-20 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} tokens={tokens} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
