import { useEffect, useMemo, useRef, useState } from "react";
import type { BreedSummary } from "@/types/breed";
import { BreedCard } from "@/components/breed-card";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { tokenize, matchesAll } from "@/lib/search";
import { Body, DisplayMD, Eyebrow, MicroLabel } from "@/components/typography";
import { track } from "@/lib/analytics";

export interface ExplorerState {
  q: string;
  filters: string[];
}

interface Props {
  breeds: BreedSummary[];
  state: ExplorerState;
  onChange: (next: ExplorerState) => void;
  emptyLabel?: string;
  /** Used for analytics — which index page this explorer lives on */
  surface: "dogs" | "cats";
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
  surface,
  labelOverrides,
  maxChips = 18,
}: Props) {
  const overrides = { ...DEFAULT_OVERRIDES, ...(labelOverrides || {}) };
  const tokens = useMemo(() => tokenize(state.q), [state.q]);

  // Debounced "filtering" indicator — flips on when q/filters change and back
  // off after a short delay so the grid shows skeletons during rapid typing.
  const [isFiltering, setIsFiltering] = useState(false);
  const stateKey = `${state.q}::${state.filters.join("|")}`;
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 220);
    return () => clearTimeout(t);
  }, [stateKey]);

  // Counts come from breeds matching the current SEARCH only.
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
    const present = new Set(all.map((c) => c.id));
    for (const f of state.filters) {
      if (!present.has(f)) all.unshift({ id: f, count: 0, label: prettify(f, overrides) });
    }
    return all.slice(0, maxChips);
  }, [chipCounts, state.filters, maxChips, overrides]);

  const filtered = useMemo(() => filterBreeds(breeds, state), [breeds, state]);

  // Suggestions for the empty state — the most populous tags in the FULL
  // dataset that the user has not already enabled.
  const suggestions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of breeds) for (const t of b.tags) counts.set(t, (counts.get(t) || 0) + 1);
    const active = new Set(state.filters);
    return Array.from(counts.entries())
      .filter(([id]) => !active.has(id))
      .map(([id, count]) => ({ id, count, label: prettify(id, overrides) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [breeds, state.filters, overrides]);

  const toggle = (id: string) => {
    const action = state.filters.includes(id) ? "remove" : "add";
    const next = action === "remove" ? state.filters.filter((f) => f !== id) : [...state.filters, id];
    const nextResults = filterBreeds(breeds, { q: state.q, filters: next }).length;
    track("filter_toggle", {
      surface,
      tag: id,
      action,
      active_filters: next,
      results: nextResults,
    });
    onChange({ ...state, filters: next });
  };

  const clearAll = () => {
    track("filters_clear_all", {
      surface,
      cleared_query: state.q,
      cleared_filters: state.filters,
    });
    onChange({ q: "", filters: [] });
  };

  // search_submit — fire when query is committed (debounced) OR on Enter.
  const lastTracked = useRef<string>("");
  useEffect(() => {
    const t = setTimeout(() => {
      if (state.q.trim().length < 2) return;
      const key = `${state.q}::${state.filters.join("|")}`;
      if (lastTracked.current === key) return;
      lastTracked.current = key;
      track("search_submit", {
        surface,
        query: state.q,
        filters: state.filters,
        results: filtered.length,
      });
    }, 600);
    return () => clearTimeout(t);
  }, [state.q, state.filters, filtered.length, surface]);

  // empty_results — fire once per unique empty (q, filters) state.
  const lastEmpty = useRef<string>("");
  useEffect(() => {
    if (isFiltering) return;
    if (filtered.length !== 0) return;
    if (state.q === "" && state.filters.length === 0) return;
    const key = `${state.q}::${state.filters.join("|")}`;
    if (lastEmpty.current === key) return;
    lastEmpty.current = key;
    track("empty_results", { surface, query: state.q, filters: state.filters });
  }, [filtered.length, isFiltering, state.q, state.filters, surface]);

  const speciesLabel = breeds[0]?.species === "dog" ? "canines" : "felines";
  const hasQuery = !!state.q;
  const hasFilters = state.filters.length > 0;

  return (
    <div>
      <div className="mt-10 flex flex-col gap-5">
        {/* Search input */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            track("search_submit", {
              surface,
              query: state.q,
              filters: state.filters,
              results: filtered.length,
            });
          }}
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
        </form>

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
          {isFiltering ? "Filtering…" : `${filtered.length} of ${breeds.length} ${speciesLabel}`}
          {hasFilters && ` · ${state.filters.length} filter${state.filters.length > 1 ? "s" : ""}`}
        </MicroLabel>
      </div>

      {/* Results: skeleton while filtering, empty state, or grid */}
      {isFiltering ? (
        <BreedGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-ink/10 bg-cream/60 px-6 py-16 text-center backdrop-blur md:mt-20 md:py-20">
          <Eyebrow>No matches</Eyebrow>
          <DisplayMD className="mt-3">{emptyLabel}</DisplayMD>
          <Body size="base" className="mx-auto mt-3 max-w-md">
            {hasQuery
              ? `Nothing in the index matches “${state.q}”${
                  hasFilters ? " with the current filters" : ""
                }.`
              : "No entries match the current filter combination."}{" "}
            Try a popular trait below or clear everything to see the full almanac.
          </Body>

          {suggestions.length > 0 && (
            <div className="mx-auto mt-7 max-w-xl">
              <div className="mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-3 w-3 text-brass" aria-hidden />
                <Eyebrow as="span">Try a popular trait</Eyebrow>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      // Replace filters with just the suggestion + clear query for a clean reset
                      track("filter_toggle", {
                        surface,
                        tag: s.id,
                        action: "add",
                        active_filters: [s.id],
                        results: filterBreeds(breeds, { q: "", filters: [s.id] }).length,
                      });
                      onChange({ q: "", filters: [s.id] });
                    }}
                    className="chip"
                  >
                    <span>{s.label}</span>
                    <span className="tabular-nums text-[9.5px] text-foreground/40">{s.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={clearAll}
            className="btn-ghost mt-7 inline-flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" /> Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-14 md:gap-x-10 md:gap-y-20 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <div
              key={b.slug}
              className={i % 5 === 1 ? "md:translate-y-12" : ""}
              onClick={() =>
                track("breed_card_click", {
                  surface,
                  slug: b.slug,
                  query: state.q,
                  filters: state.filters,
                })
              }
            >
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} tokens={tokens} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
