import { createFileRoute, Link } from "@tanstack/react-router";
import { breeds } from "@/data/breeds";
import { BreedCard } from "@/components/breed-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pelt & Paw — An Editorial Almanac of Dogs & Cats" },
      { name: "description", content: "An editorial almanac of dog and cat breeds: long-form dossiers, photographed and researched for serious owners." },
      { property: "og:title", content: "Pelt & Paw — An Editorial Almanac" },
      { property: "og:description", content: "Long-form dossiers on the breeds that share our homes." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

function Index() {
  const feature = breeds[0];
  const dogs = breeds.filter(b => b.species === "dog");
  const cats = breeds.filter(b => b.species === "cat");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Marquee strip */}
      <div className="overflow-hidden border-b border-ink/15 bg-ink py-3 text-cream">
        <div className="marquee flex w-max gap-12 whitespace-nowrap text-xs uppercase tracking-[0.3em]">
          {Array.from({ length: 2 }).flatMap((_, j) => breeds.map(b => (
            <span key={`${j}-${b.slug}`} className="flex items-center gap-12">
              <span>{b.name}</span><span className="text-gold">✦</span>
            </span>
          )))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 md:grid-cols-12 md:gap-12 md:px-10 md:py-24">
          <div className="md:col-span-7">
            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-foreground/60">
              <span>Issue № XXVI</span>
              <span className="h-px w-10 bg-ink/40" />
              <span className="text-rust">Spring Edition</span>
            </div>
            <h1 className="display-xl mt-6 text-balance fade-up">
              The animals<br/>
              <span className="italic text-rust">we live</span> with.
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
              An editorial almanac for the dog and cat breeds that share our homes — researched without sentiment, photographed without flinch, and written for people who plan to keep an animal for fifteen years.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/dogs" className="group inline-flex items-center gap-3 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-rust">
                The Dog Index <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link to="/cats" className="group inline-flex items-center gap-3 border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em] hover:text-rust">
                The Cat Index <span className="transition group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink">
              <img src={heroImg} alt="A dog and cat silhouetted in golden light" className="h-full w-full object-cover" width={1600} height={1200}/>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-cream">
                <span className="text-[10px] uppercase tracking-[0.25em]">Cover · MMXXVI</span>
                <span className="font-serif text-3xl italic">№ 26</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-foreground/60">
              <span>{breeds.length} breeds documented</span>
              <span>2 species · 1 obsession</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-3">
          <p className="eyebrow">The Cover Subject</p>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pages 04 — 18</p>
        </div>
        <BreedCard breed={feature} variant="feature" />
      </section>

      {/* DOG INDEX */}
      <section className="mx-auto mt-24 max-w-[1400px] px-6 md:px-10">
        <header className="grid gap-6 border-b border-ink/30 pb-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-rust">Section I</p>
            <h2 className="display-lg mt-3">The Dog Index.</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
            From the gun-dog estates of Scotland to the herding hills of Cumbria — five working pedigrees, considered.
          </p>
        </header>

        <div className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {dogs.map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} />
            </div>
          ))}
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="mx-auto mt-32 max-w-4xl px-6 text-center md:px-10">
        <p className="text-rust eyebrow">An Aside</p>
        <blockquote className="mt-6 font-serif text-3xl italic leading-snug text-balance md:text-5xl">
          &ldquo;A dog teaches a child fidelity, perseverance, and to turn around three times before lying down.&rdquo;
        </blockquote>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">— Robert Benchley, 1936</p>
      </section>

      {/* CAT INDEX */}
      <section className="mx-auto mt-32 max-w-[1400px] px-6 md:px-10">
        <header className="grid gap-6 border-b border-ink/30 pb-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-rust">Section II</p>
            <h2 className="display-lg mt-3">The Cat Index.</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
            From temple cats of Ayutthaya to a hairless mutation in 1960s Toronto — five feline lineages.
          </p>
        </header>

        <div className="mt-12 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((b, i) => (
            <div key={b.slug} className={i % 5 === 2 ? "md:translate-y-12" : ""}>
              <BreedCard breed={b} variant={i % 3 === 1 ? "tall" : "default"} />
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
