import { createFileRoute, Link } from "@tanstack/react-router";
import { BreedCard } from "@/components/breed-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreedGridSkeleton } from "@/components/breed-skeletons";
import { listBreeds } from "@/server/breeds";
import type { BreedSummary } from "@/types/breed";
import {
  Body,
  DisplayLG,
  DisplayXL,
  Eyebrow,
  EyebrowPill,
  Lede,
  MicroLabel,
  PullQuote,
} from "@/components/typography";

export const Route = createFileRoute("/")({
  loader: () => listBreeds(),
  pendingMs: 200,
  pendingComponent: PendingIndex,
  head: () => ({
    meta: [
      { title: "Pelt & Paw — A Considered Almanac of Dogs & Cats" },
      { name: "description", content: "A considered almanac of every documented dog and cat breed: long-form dossiers, real photography, written for serious owners." },
      { property: "og:title", content: "Pelt & Paw — A Considered Almanac" },
      { property: "og:description", content: "Long-form dossiers on every breed that shares our homes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <Eyebrow>Pressroom Error</Eyebrow>
        <DisplayLG className="mt-3">The wire is down.</DisplayLG>
        <Body size="base" className="mt-4" tone="muted">{error.message}</Body>
        <Body size="sm" className="mt-6" tone="muted">Refresh to retry — the index lives on a 12-hour cache.</Body>
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
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <Eyebrow>Living Edition</Eyebrow>
        <DisplayXL className="mt-4">The animals we live with.</DisplayXL>
        <Body size="sm" className="mt-6" tone="muted">Loading the index…</Body>
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

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* subtle gradient backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-champagne/15 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-brass/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-12 pt-12 sm:px-6 md:grid-cols-12 md:gap-14 md:px-10 md:pb-24 md:pt-20">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <EyebrowPill>Issue № XXVI</EyebrowPill>
              <Eyebrow as="span" className="tracking-[0.3em]">Living Edition · MMXXVI</Eyebrow>
            </div>
            <DisplayXL className="mt-7 fade-up md:mt-9">
              The animals
              <br />
              <span className="italic font-normal text-brass" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100' }}>
                we live
              </span>{" "}
              with.
            </DisplayXL>
            <Body size="xl" className="mt-7 max-w-xl md:mt-9">
              A considered almanac documenting every recognized dog and cat breed — researched without sentiment, photographed from the field, and written for people who plan to keep an animal for fifteen years.
            </Body>
            <div className="mt-9 flex flex-wrap items-center gap-3 md:mt-11 md:gap-4">
              <Link to="/dogs" className="btn-primary group inline-flex items-center gap-3">
                Read the canines <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link to="/cats" className="btn-ghost group inline-flex items-center gap-3">
                Read the felines <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8 md:mt-16 md:gap-10 md:pt-10">
              {[
                ["≈ 270", "Breeds"],
                ["6", "Editors"],
                ["0", "AI photos"],
              ].map(([big, small]) => (
                <div key={small}>
                  <p className="font-serif text-3xl leading-none tracking-tight md:text-4xl">{big}</p>
                  <MicroLabel className="mt-2 block">{small}</MicroLabel>
                </div>
              ))}
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-onyx shadow-[var(--shadow-press)]">
              {feature?.image ? (
                <img src={feature.image} alt={feature.name} className="h-full w-full object-cover" width={1600} height={2000} />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-3xl italic text-cream">Pelt &amp; Paw</div>
              )}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 text-cream md:p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-champagne/90">Cover · MMXXVI</p>
                  <p className="mt-1 font-serif text-2xl leading-tight md:text-[1.7rem]">{feature?.name}</p>
                </div>
                <span className="font-serif text-3xl italic text-champagne md:text-4xl">№ {feature?.issueNo}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.24em] text-foreground/55 md:text-[11px]">
              <span>{breeds.length} breeds documented</span>
              <span className="h-px flex-1 bg-ink/15" />
              <span>2 species · 1 obsession</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-ink/8 surface-onyx py-4 text-cream">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.32em] md:gap-14 md:text-[11px]">
          {Array.from({ length: 2 }).flatMap((_, j) => breeds.slice(0, 40).map(b => (
            <span key={`${j}-${b.slug}`} className="flex items-center gap-10 md:gap-14">
              <span className="text-cream/80">{b.name}</span><span className="text-champagne">✦</span>
            </span>
          )))}
        </div>
      </div>

      {/* FEATURE */}
      {feature && (
        <section className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
          <div className="flex items-baseline justify-between border-b border-ink/15 pb-4 pt-12 md:pt-20">
            <p className="eyebrow">The Cover Subject</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:text-xs">№ {feature.issueNo}</p>
          </div>
          <BreedCard breed={feature} variant="feature" />
        </section>
      )}

      {/* CANINES preview */}
      <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6 md:mt-28 md:px-10">
        <header className="grid gap-5 border-b border-ink/15 pb-7 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <p className="eyebrow">Section I — Canidae</p>
            <h2 className="display-lg mt-4">The Canines.</h2>
            <p className="mt-3 text-sm text-muted-foreground">{dogs.length} pedigrees documented · a sampling below</p>
          </div>
          <p className="text-[15px] leading-relaxed text-muted-foreground md:col-span-4">
            From the gun-dog estates of Scotland to the herding hills of Anatolia — every recognized canine pedigree, considered.
          </p>
        </header>

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-16 md:gap-x-10 md:gap-y-20 lg:grid-cols-3">
          {dogs.slice(0, 9).map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} />
            </div>
          ))}
        </div>
        <div className="mt-14 text-center md:mt-16">
          <Link to="/dogs" className="btn-ghost inline-flex items-center gap-3">
            See all {dogs.length} canines <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="mx-auto mt-24 max-w-4xl px-4 text-center sm:px-6 md:mt-36 md:px-10">
        <p className="eyebrow">An Aside</p>
        <blockquote className="mt-6 font-serif text-[1.85rem] italic leading-[1.15] tracking-tight text-balance sm:text-4xl md:mt-8 md:text-[3.25rem]">
          &ldquo;A dog teaches a child fidelity, perseverance, and to turn around three times before lying down.&rdquo;
        </blockquote>
        <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:mt-8">— Robert Benchley, 1936</p>
      </section>

      {/* FELINES preview */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6 md:mt-36 md:px-10">
        <header className="grid gap-5 border-b border-ink/15 pb-7 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <p className="eyebrow">Section II — Felidae</p>
            <h2 className="display-lg mt-4">The Felines.</h2>
            <p className="mt-3 text-sm text-muted-foreground">{cats.length} feline lineages documented · a sampling below</p>
          </div>
          <p className="text-[15px] leading-relaxed text-muted-foreground md:col-span-4">
            From the temple cats of Ayutthaya to a hairless mutation in 1960s Toronto — every recognized feline lineage.
          </p>
        </header>

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-16 md:gap-x-10 md:gap-y-20 lg:grid-cols-3">
          {cats.slice(0, 9).map((b, i) => (
            <div key={b.slug} className={i % 5 === 2 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 1 ? "tall" : "default"} />
            </div>
          ))}
        </div>
        <div className="mt-14 text-center md:mt-16">
          <Link to="/cats" className="btn-ghost inline-flex items-center gap-3">
            See all {cats.length} felines <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
