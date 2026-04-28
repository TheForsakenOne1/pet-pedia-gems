import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { breeds, getBreed } from "@/data/breeds";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatBar } from "@/components/stat-bar";
import { BreedCard } from "@/components/breed-card";

export const Route = createFileRoute("/breed/$slug")({
  loader: ({ params }) => {
    const breed = getBreed(params.slug);
    if (!breed) throw notFound();
    return { breed };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.breed;
    if (!b) return { meta: [{ title: "Breed not found — Pelt & Paw" }] };
    return {
      meta: [
        { title: `${b.name} — Pelt & Paw` },
        { name: "description", content: `${b.name}: ${b.tagline}. ${b.intro.slice(0, 140)}` },
        { property: "og:title", content: `${b.name} — ${b.tagline}` },
        { property: "og:description", content: b.intro.slice(0, 200) },
        { property: "og:image", content: b.image },
        { name: "twitter:image", content: b.image },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="eyebrow text-rust">Error</p>
        <h1 className="display-lg mt-3">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="eyebrow text-rust">Not Found</p>
        <h1 className="display-lg mt-3">No such breed in the index.</h1>
        <Link to="/" className="mt-8 inline-block border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em]">Back to the index →</Link>
      </div>
    </div>
  ),
  component: BreedPage,
});

function BreedPage() {
  const data = Route.useLoaderData();
  const b = data.breed;
  const related = breeds.filter(x => x.species === b.species && x.slug !== b.slug).slice(0, 3);

  const facts: [string, string][] = [
    ["Origin", b.origin],
    ["Group", b.group],
    ["Lifespan", b.lifespan],
    ["Size", b.size],
    ["Weight", b.weight],
    ["Coat", b.coat],
    ["Colors", b.colors],
    ["Recognized", b.yearRecognized],
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* MASTHEAD */}
      <section className="border-b border-ink/20">
        <div className="mx-auto max-w-[1400px] px-6 pt-12 md:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4 text-xs uppercase tracking-[0.25em] text-foreground/60">
            <span>Dossier № {b.issueNo}</span>
            <span className="hidden md:inline">{b.species === "dog" ? "Section I — Canidae" : "Section II — Felidae"}</span>
            <span>Folio {b.issueNo} / {breeds.length.toString().padStart(2, "0")}</span>
          </div>
          <p className="eyebrow mt-10 text-rust">{b.tagline}</p>
          <h1 className="display-xl mt-4 text-balance">{b.name}.</h1>
          <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-foreground/80 md:text-3xl">
            {b.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1400px] px-6 md:px-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-ink md:aspect-[21/9]">
            <img src={b.image} alt={b.name} className="h-full w-full object-cover" loading="eager" width={1024} height={1280}/>
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">Plate № {b.issueNo} — {b.name}, photographed for this issue</p>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-b border-ink/15">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-8 gap-y-6 px-6 py-12 md:grid-cols-4 md:px-10">
          {facts.map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rust">{k}</p>
              <p className="mt-2 font-serif text-xl leading-tight">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN ARTICLE */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-16 md:grid-cols-12 md:gap-20">
          <article className="md:col-span-8">
            <Section eyebrow="Chapter I" title="History">
              <p className="drop-cap body-serif">{b.history}</p>
            </Section>

            <Section eyebrow="Chapter II" title="Personality">
              <p className="body-serif">{b.personality}</p>
            </Section>

            <Section eyebrow="Chapter III" title="Care & Husbandry">
              <p className="body-serif">{b.care}</p>
            </Section>

            <Section eyebrow="Chapter IV" title="Health">
              <p className="body-serif">{b.health}</p>
            </Section>

            <div className="mt-20 border-y border-ink/30 py-10">
              <p className="eyebrow text-rust">Field Notes</p>
              <h3 className="font-serif text-3xl mt-3">Three things you may not know.</h3>
              <ol className="mt-8 space-y-6">
                {b.funFacts.map((f: string, i: number) => (
                  <li key={i} className="flex gap-6">
                    <span className="font-serif text-5xl leading-none text-rust">{(i+1).toString().padStart(2, "0")}</span>
                    <p className="text-pretty text-lg leading-relaxed text-foreground/85">{f}</p>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="md:col-span-4">
            <div className="sticky top-24 space-y-10">
              <div>
                <p className="eyebrow text-rust">Temperament</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.temperament.map((t: string) => (
                    <span key={t} className="border border-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow text-rust">By the Numbers</p>
                <div className="mt-4">
                  <StatBar label="Energy" value={b.energy}/>
                  <StatBar label="Affection" value={b.affection}/>
                  <StatBar label="Trainability" value={b.trainability}/>
                  <StatBar label="Grooming Needs" value={b.grooming}/>
                  <StatBar label="Shedding" value={b.shedding}/>
                  <StatBar label="Good w/ Kids" value={b.goodWithKids}/>
                </div>
              </div>

              <div className="bg-ink p-6 text-cream">
                <p className="eyebrow text-gold">Editor's Note</p>
                <p className="mt-3 font-serif text-xl italic leading-snug">
                  &ldquo;{b.tagline}&rdquo; — a {b.species} that rewards the prepared owner and humbles the sentimental one.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED */}
      <section className="mx-auto max-w-[1400px] border-t border-ink/30 px-6 py-20 md:px-10">
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-4">
          <p className="eyebrow">Continue Reading</p>
          <Link to={b.species === "dog" ? "/dogs" : "/cats"} className="text-xs font-semibold uppercase tracking-[0.22em] text-rust">
            All {b.species === "dog" ? "dogs" : "cats"} →
          </Link>
        </div>
        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {related.map(r => <BreedCard key={r.slug} breed={r} />)}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-16 first:mt-0">
      <div className="flex items-baseline gap-4">
        <p className="eyebrow text-rust">{eyebrow}</p>
        <span className="h-px flex-1 bg-ink/30" />
      </div>
      <h2 className="display-md mt-4">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
