import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreedExplorer, filterBreeds } from "@/components/breed-explorer";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { listBreeds } from "@/server/breeds";
import type { BreedSummary } from "@/types/breed";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  filters: fallback(z.array(z.string()), []).default([]),
});

function buildHead(q: string, filters: string[], count?: number) {
  const hasFilters = filters.length > 0;
  const titleBits: string[] = [];
  if (q) titleBits.push(`“${q}”`);
  if (hasFilters) titleBits.push(filters.map((f) => f.replace(/-/g, " ")).join(" + "));
  const suffix = titleBits.length ? `${titleBits.join(" · ")} — ` : "";
  const title = `${suffix}The Dog Index — Pelt & Paw`;

  let desc = "Every documented dog breed: history, temperament, care, and health, written for serious owners.";
  if (q || hasFilters) {
    const parts: string[] = [];
    if (typeof count === "number") parts.push(`${count} breeds`);
    if (q) parts.push(`matching “${q}”`);
    if (hasFilters) parts.push(`tagged ${filters.map((f) => f.replace(/-/g, " ")).join(", ")}`);
    desc = `${parts.join(" ")}. Browse the full canine almanac.`;
  }

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (hasFilters) params.set("filters", JSON.stringify(filters));
  const canonicalPath = params.toString() ? `/dogs?${params.toString()}` : "/dogs";

  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalPath },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
      { name: "robots", content: q || hasFilters ? "noindex,follow" : "index,follow" },
    ],
    links: [{ rel: "canonical", href: canonicalPath }],
  };
}

export const Route = createFileRoute("/dogs")({
  validateSearch: zodValidator(searchSchema),
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingDogs,
  errorComponent: ErrorDogs,
  head: ({ loaderData, search }) => {
    const all = (loaderData as BreedSummary[] | undefined) ?? [];
    const dogs = all.filter((b) => b.species === "dog");
    const q = search?.q ?? "";
    const filters = search?.filters ?? [];
    const count = dogs.length ? filterBreeds(dogs, { q, filters }).length : undefined;
    return buildHead(q, filters, count);
  },
  component: DogsPage,
});

function PendingDogs() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-24">
        <p className="eyebrow text-rust">Section I</p>
        <h1 className="display-xl mt-4">The Dog Index.</h1>
        <p className="mt-6 text-sm text-muted-foreground">Loading the index…</p>
        <BreedGridSkeleton count={9} />
      </section>
      <SiteFooter />
    </div>
  );
}

function ErrorDogs({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="eyebrow text-rust">Pressroom Error</p>
        <h1 className="display-lg mt-3">The wire is down.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <p className="mt-6 text-sm text-muted-foreground">Refresh the page to retry — the index lives on a 12-hour cache.</p>
      </div>
      <SiteFooter />
    </div>
  );
}

function DogsPage() {
  const breeds = Route.useLoaderData() as BreedSummary[];
  const { q, filters } = Route.useSearch();
  const navigate = useNavigate({ from: "/dogs" });
  const dogs = breeds.filter((b) => b.species === "dog");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/30 pb-4">
          <div>
            <p className="eyebrow text-rust">Section I</p>
            <h1 className="display-xl mt-4">The Dog Index.</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{dogs.length} entries</p>
        </div>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
          A complete working list of canine pedigrees — from gundogs to giants. Each entry runs deep: origin, anatomy, temperament, hard health truths, and the care a fifteen-year companion deserves.
        </p>
        <BreedExplorer
          breeds={dogs}
          state={{ q, filters }}
          onChange={(next) => navigate({ search: () => ({ q: next.q, filters: next.filters }), replace: true })}
          emptyLabel="No dogs match those filters."
        />
      </section>
      <SiteFooter />
    </div>
  );
}
