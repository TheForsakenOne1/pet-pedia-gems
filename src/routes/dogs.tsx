import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreedExplorer } from "@/components/breed-explorer";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { listBreeds } from "@/server/breeds";
import type { BreedSummary } from "@/types/breed";

const DOG_FILTERS = [
  { id: "working", label: "Working" },
  { id: "herding", label: "Herding" },
  { id: "hunting", label: "Hunting" },
  { id: "guardian", label: "Guardian" },
  { id: "companion", label: "Companion" },
  { id: "highly-trainable", label: "Highly Trainable" },
  { id: "family-friendly", label: "Family-Friendly" },
  { id: "high-energy", label: "High-Energy" },
  { id: "low-energy", label: "Low-Energy" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
  { id: "giant", label: "Giant" },
];

export const Route = createFileRoute("/dogs")({
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingDogs,
  errorComponent: ErrorDogs,
  head: () => ({
    meta: [
      { title: "The Dog Index — Pelt & Paw" },
      { name: "description", content: "Every documented dog breed: history, temperament, care, and health, written for serious owners." },
      { property: "og:title", content: "The Dog Index — Pelt & Paw" },
      { property: "og:description", content: "Every documented dog breed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
  const dogs = breeds.filter(b => b.species === "dog");
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
        <BreedExplorer breeds={dogs} filters={DOG_FILTERS} emptyLabel="No dogs match those filters." />
      </section>
      <SiteFooter />
    </div>
  );
}
