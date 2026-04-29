import { createFileRoute, Link } from "@tanstack/react-router";
import { BreedCard } from "@/components/breed-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { listBreeds } from "@/server/breeds";
import type { BreedSummary } from "@/types/breed";

export const Route = createFileRoute("/")({
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingIndex,
  head: () => ({
    meta: [
      { title: "Pelt & Paw — An Editorial Almanac of Dogs & Cats" },
      { name: "description", content: "An editorial almanac of every documented dog and cat breed: long-form dossiers, real photography, written for serious owners." },
      { property: "og:title", content: "Pelt & Paw — An Editorial Almanac" },
      { property: "og:description", content: "Long-form dossiers on every breed that shares our homes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="eyebrow text-rust">Pressroom Error</p>
        <h1 className="display-lg mt-3">The wire is down.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <p className="mt-6 text-sm text-muted-foreground">Refresh to retry — the index lives on a 12-hour cache.</p>
      </div>
      <SiteFooter />
    </div>
  ),
  component: Index,
});

function PendingIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:px-10 md:py-24">
        <p className="eyebrow text-rust">Living Edition</p>
        <h1 className="display-xl mt-4">The animals we live with.</h1>
        <p className="mt-6 text-sm text-muted-foreground">Loading the index…</p>
        <BreedGridSkeleton count={6} />
      </section>
      <SiteFooter />
    </div>
  );
}

function Index() {
  const breeds = Route.useLoaderData() as BreedSummary[];
  const dogs = breeds.filter(b => b.species === "dog");
  const cats = breeds.filter(b => b.species === "cat");
  const feature = breeds.find(b => !!b.image) ?? breeds[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-ink/15 bg-ink py-3 text-cream">
        <div className="marquee flex w-max gap-8 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] md:gap-12 md:text-xs">
          {Array.from({ length: 2 }).flatMap((_, j) => breeds.slice(0, 40).map(b => (
            <span key={`${j}-${b.slug}`} className="flex items-center gap-8 md:gap-12">
              <span>{b.name}</span><span className="text-gold">✦</span>
            </span>
          )))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-12 md:gap-12 md:px-10 md:py-24">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-foreground/60 md:gap-4 md:text-xs">
              <span>Issue № XXVI</span>
              <span className="h-px w-10 bg-ink/40" />
              <span className="text-rust">Living Edition</span>
            </div>
            <h1 className="display-xl mt-5 text-balance fade-up md:mt-6">
              The animals<br />
              <span className="italic text-rust">we live</span> with.
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg md:mt-8 md:text-xl">
              An editorial almanac documenting every recognized dog and cat breed — researched without sentiment, photographed from the field, and written for people who plan to keep an animal for fifteen years.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 md:mt-10 md:gap-6">
              <Link to="/dogs" className="group inline-flex items-center gap-3 bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-rust md:px-7 md:py-4 md:text-xs">
                The Dog Index <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link to="/cats" className="group inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] hover:text-rust md:text-xs">
                The Cat Index <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              {feature?.image ? (
                <img src={feature.image} alt={feature.name} className="h-full w-full object-cover" width={1600} height={2000} />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-3xl italic text-cream">Pelt &amp; Paw</div>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/90 to-transparent p-4 text-cream md:p-5">
                <span className="text-[10px] uppercase tracking-[0.25em]">Cover · MMXXVI</span>
                <span className="font-serif text-2xl italic md:text-3xl">№ {feature?.issueNo}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-foreground/60 md:text-[11px]">
              <span>{breeds.length} breeds documented</span>
              <span>2 species · 1 obsession</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE */}
      {feature && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
          <div className="flex items-baseline justify-between border-b border-ink/30 pb-3">
            <p className="eyebrow">The Cover Subject</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">№ {feature.issueNo}</p>
          </div>
          <BreedCard breed={feature} variant="feature" />
        </section>
      )}

      {/* DOG INDEX (preview) */}
      <section className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-6 md:mt-24 md:px-10">
        <header className="grid gap-4 border-b border-ink/30 pb-6 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-8">
            <p className="eyebrow text-rust">Section I</p>
            <h2 className="display-lg mt-3">The Dog Index.</h2>
            <p className="mt-3 text-sm text-muted-foreground">{dogs.length} pedigrees documented · a sampling below</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
            From the gun-dog estates of Scotland to the herding hills of Anatolia — every recognized canine pedigree, considered.
          </p>
        </header>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
          {dogs.slice(0, 9).map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center md:mt-12">
          <Link to="/dogs" className="inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em] hover:text-rust">
            See all {dogs.length} dogs →
          </Link>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="mx-auto mt-20 max-w-4xl px-4 text-center sm:px-6 md:mt-32 md:px-10">
        <p className="text-rust eyebrow">An Aside</p>
        <blockquote className="mt-5 font-serif text-2xl italic leading-snug text-balance sm:text-3xl md:mt-6 md:text-5xl">
          &ldquo;A dog teaches a child fidelity, perseverance, and to turn around three times before lying down.&rdquo;
        </blockquote>
        <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:mt-6 md:text-xs">— Robert Benchley, 1936</p>
      </section>

      {/* CAT INDEX (preview) */}
      <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6 md:mt-32 md:px-10">
        <header className="grid gap-4 border-b border-ink/30 pb-6 md:grid-cols-12 md:items-end md:gap-6">
          <div className="md:col-span-8">
            <p className="eyebrow text-rust">Section II</p>
            <h2 className="display-lg mt-3">The Cat Index.</h2>
            <p className="mt-3 text-sm text-muted-foreground">{cats.length} feline lineages documented · a sampling below</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
            From the temple cats of Ayutthaya to a hairless mutation in 1960s Toronto — every recognized feline lineage.
          </p>
        </header>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
          {cats.slice(0, 9).map((b, i) => (
            <div key={b.slug} className={i % 5 === 2 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 1 ? "tall" : "default"} />
            </div>
          ))}
        </div>
        <div className="mb-20 mt-10 text-center md:mb-24 md:mt-12">
          <Link to="/cats" className="inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em] hover:text-rust">
            See all {cats.length} cats →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
