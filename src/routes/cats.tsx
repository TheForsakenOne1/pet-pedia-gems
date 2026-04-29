import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreedExplorer } from "@/components/breed-explorer";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { listBreeds } from "@/server/breeds";
import type { BreedSummary } from "@/types/breed";

const CAT_FILTERS = [
  { id: "hypoallergenic", label: "Hypoallergenic" },
  { id: "hairless", label: "Hairless" },
  { id: "indoor", label: "Indoor-Suited" },
  { id: "lap-cat", label: "Lap Cat" },
  { id: "affectionate", label: "Affectionate" },
  { id: "family-friendly", label: "Family-Friendly" },
  { id: "dog-friendly", label: "Dog-Friendly" },
  { id: "highly-trainable", label: "Highly Trainable" },
  { id: "high-energy", label: "High-Energy" },
  { id: "low-energy", label: "Low-Energy" },
  { id: "low-grooming", label: "Low Grooming" },
  { id: "high-grooming", label: "High Grooming" },
  { id: "low-shedding", label: "Low Shedding" },
];

export const Route = createFileRoute("/cats")({
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingCats,
  errorComponent: ErrorCats,
  head: () => ({
    meta: [
      { title: "The Cat Index — Pelt & Paw" },
      { name: "description", content: "Every documented cat breed: ancestry, temperament, husbandry, and health." },
      { property: "og:title", content: "The Cat Index — Pelt & Paw" },
      { property: "og:description", content: "Every documented cat breed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatsPage,
});

function PendingCats() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-24">
        <p className="eyebrow text-rust">Section II</p>
        <h1 className="display-xl mt-4">The Cat Index.</h1>
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
        <p className="eyebrow text-rust">Pressroom Error</p>
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
  const cats = breeds.filter(b => b.species === "cat");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/30 pb-4">
          <div>
            <p className="eyebrow text-rust">Section II</p>
            <h1 className="display-xl mt-4">The Cat Index.</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{cats.length} entries</p>
        </div>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
          Every recognized feline lineage we have documented — from the lynx-eared frontier cats of Maine to a hairless mutation born in a 1966 Toronto living room.
        </p>
        <BreedExplorer breeds={cats} filters={CAT_FILTERS} emptyLabel="No cats match those filters." />
      </section>
      <SiteFooter />
    </div>
  );
}
