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
  const title = `${suffix}The Felines — Pelt & Paw`;

  let desc = "Every documented cat breed: ancestry, temperament, husbandry, and health.";
  if (q || hasFilters) {
    const parts: string[] = [];
    if (typeof count === "number") parts.push(`${count} breeds`);
    if (q) parts.push(`matching “${q}”`);
    if (hasFilters) parts.push(`tagged ${filters.map((f) => f.replace(/-/g, " ")).join(", ")}`);
    desc = `${parts.join(" ")}. Browse the full feline almanac.`;
  }

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (hasFilters) params.set("filters", JSON.stringify(filters));
  const canonicalPath = params.toString() ? `/cats?${params.toString()}` : "/cats";

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

export const Route = createFileRoute("/cats")({
  validateSearch: zodValidator(searchSchema),
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingCats,
  errorComponent: ErrorCats,
  head: ({ loaderData, match }) => {
    const all = (loaderData as BreedSummary[] | undefined) ?? [];
    const cats = all.filter((b) => b.species === "cat");
    const search = (match?.search ?? {}) as { q?: string; filters?: string[] };
    const q = search.q ?? "";
    const filters = search.filters ?? [];
    const count = cats.length ? filterBreeds(cats, { q, filters }).length : undefined;
    return buildHead(q, filters, count);
  },
  component: CatsPage,
});

function PendingCats() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <p className="eyebrow">Section II — Felidae</p>
        <h1 className="display-xl mt-4">The Felines.</h1>
        <p className="mt-6 text-sm text-muted-foreground">Loading the index…</p>
        <BreedGridSkeleton count={9} />
      </section>
      <SiteFooter />
    </div>
  );
}

function ErrorCats({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="eyebrow">Pressroom Error</p>
        <h1 className="display-lg mt-3">The wire is down.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <p className="mt-6 text-sm text-muted-foreground">Refresh the page to retry.</p>
      </div>
      <SiteFooter />
    </div>
  );
}

function CatsPage() {
  const breeds = Route.useLoaderData() as BreedSummary[];
  const { q, filters } = Route.useSearch();
  const navigate = useNavigate({ from: "/cats" });
  const cats = breeds.filter((b) => b.species === "cat");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6">
          <div>
            <p className="eyebrow">Section II — Felidae</p>
            <h1 className="display-xl mt-4">The Felines.</h1>
          </div>
          <p className="rounded-full border border-ink/15 bg-cream/60 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
            {cats.length} entries
          </p>
        </div>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-[1.15rem]">
          Every recognized feline lineage we have documented — from the lynx-eared frontier cats of Maine to a hairless mutation born in a 1966 Toronto living room.
        </p>
        <BreedExplorer
          breeds={cats}
          state={{ q, filters }}
          onChange={(next) => navigate({ search: () => ({ q: next.q, filters: next.filters }), replace: true })}
          emptyLabel="No felines match those filters."
        />
      </section>
      <SiteFooter />
    </div>
  );
}
