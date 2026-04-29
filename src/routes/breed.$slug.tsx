import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StatBar } from "@/components/stat-bar";
import { BreedCard } from "@/components/breed-card";
import { BreedDetailSkeleton } from "@/components/breed-skeletons";
import { BreedImage } from "@/components/breed-image";
import { getBreedDetail, listBreeds } from "@/server/breeds";
import type { BreedDetail, BreedSummary } from "@/types/breed";

export const Route = createFileRoute("/breed/$slug")({
  loader: async ({ params }) => {
    const [breed, all] = await Promise.all([
      getBreedDetail({ data: { slug: params.slug } }),
      listBreeds(),
    ]);
    if (!breed) throw notFound();
    const related = all
      .filter((b) => b.species === breed.species && b.slug !== breed.slug && !!b.image)
      .slice(0, 3);
    return { breed, related };
  },
  pendingMs: 200,
  pendingComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <BreedDetailSkeleton />
      <SiteFooter />
    </div>
  ),
  head: ({ loaderData }) => {
    const b = loaderData?.breed;
    if (!b) {
      return {
        meta: [{ title: "Breed not found — Pelt & Paw" }],
      };
    }
    const desc = `${b.name}: ${b.tagline}. ${b.intro}`.replace(/\s+/g, " ").slice(0, 200);
    const meta: Array<Record<string, string>> = [
      { title: `${b.name} — Pelt & Paw` },
      { name: "description", content: desc },
      { name: "keywords", content: [b.name, b.species, b.group, ...b.temperament, ...b.tags].join(", ") },
      { property: "og:title", content: `${b.name} — ${b.tagline}` },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "article:section", content: b.species === "dog" ? "Dogs" : "Cats" },
      { property: "article:tag", content: b.tags.join(",") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${b.name} — ${b.tagline}` },
      { name: "twitter:description", content: desc },
    ];
    if (b.image) {
      meta.push({ property: "og:image", content: b.image });
      meta.push({ property: "og:image:alt", content: `${b.name} — reference photograph` });
      meta.push({ name: "twitter:image", content: b.image });
      meta.push({ name: "twitter:image:alt", content: `${b.name} — reference photograph` });
    }

    const ld = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${b.name} — ${b.tagline}`,
      description: desc,
      image: b.image || undefined,
      author: { "@type": "Organization", name: "Pelt & Paw Editorial" },
      publisher: { "@type": "Organization", name: "Pelt & Paw" },
      about: {
        "@type": b.species === "dog" ? "Thing" : "Thing",
        name: b.name,
        additionalType: b.species === "dog" ? "https://schema.org/Dog" : "https://schema.org/Cat",
        description: b.intro,
        ...(b.origin && b.origin !== "Origin uncertain" ? { countryOfOrigin: b.origin } : {}),
      },
      keywords: [b.name, b.species, b.group, ...b.temperament, ...b.tags].join(", "),
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Pelt & Paw", item: "/" },
        { "@type": "ListItem", position: 2, name: b.species === "dog" ? "Dogs" : "Cats", item: b.species === "dog" ? "/dogs" : "/cats" },
        { "@type": "ListItem", position: 3, name: b.name },
      ],
    };

    return {
      meta,
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(ld) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumb) },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="eyebrow text-rust">Error</p>
        <h1 className="display-lg mt-3">Something went wrong.</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-8 inline-block border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em]">Back to the index →</Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="eyebrow text-rust">Not Found</p>
        <h1 className="display-lg mt-3">No such breed in the index.</h1>
        <Link to="/" className="mt-8 inline-block border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em]">Back to the index →</Link>
      </div>
    </div>
  ),
  component: BreedPage,
});

function HeroImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/9] md:aspect-[21/9]">
      <BreedImage src={src} alt={alt} name={name} loading="eager" width={2000} height={1100} />
    </div>
  );
}

function BreedPage() {
  const data = Route.useLoaderData() as { breed: BreedDetail; related: BreedSummary[] };
  const b = data.breed;
  const related = data.related;

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
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 md:px-10 md:pt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-foreground/60 md:text-xs">
            <span>Dossier № {b.issueNo}</span>
            <span className="hidden md:inline">{b.species === "dog" ? "Section I — Canidae" : "Section II — Felidae"}</span>
            <Link to={b.species === "dog" ? "/dogs" : "/cats"} className="text-rust">
              ← All {b.species === "dog" ? "dogs" : "cats"}
            </Link>
          </div>
          <p className="eyebrow mt-8 text-rust md:mt-10">{b.tagline}</p>
          <h1 className="display-xl mt-3 text-balance md:mt-4">{b.name}.</h1>
          <p className="mt-5 max-w-2xl font-serif text-xl italic leading-snug text-foreground/80 sm:text-2xl md:mt-6 md:text-3xl">
            {b.intro}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-6 md:mt-12 md:px-10">
          <BreedImage src={b.image} alt={`${b.name} — reference photograph`} name={b.name} />
          <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
            Plate № {b.issueNo} — {b.name}{b.image ? ", reference photograph" : ""}
          </p>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-b border-ink/15">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-5 px-4 py-10 sm:px-6 md:grid-cols-4 md:gap-x-8 md:gap-y-6 md:px-10 md:py-12">
          {facts.map(([k, v]) => (
            <div key={k}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rust">{k}</p>
              <p className="mt-2 font-serif text-lg leading-tight md:text-xl">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN ARTICLE */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 md:grid md:grid-cols-12 md:gap-20 md:px-10 md:py-24">
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

          <div className="mt-16 border-y border-ink/30 py-8 md:mt-20 md:py-10">
            <p className="eyebrow text-rust">Field Notes</p>
            <h3 className="mt-3 font-serif text-2xl md:text-3xl">Three things you may not know.</h3>
            <ol className="mt-6 space-y-5 md:mt-8 md:space-y-6">
              {b.funFacts.map((f, i) => (
                <li key={i} className="flex gap-4 md:gap-6">
                  <span className="font-serif text-4xl leading-none text-rust md:text-5xl">{(i + 1).toString().padStart(2, "0")}</span>
                  <p className="text-pretty text-base leading-relaxed text-foreground/85 md:text-lg">{f}</p>
                </li>
              ))}
            </ol>
          </div>

          {b.referenceUrl && (
            <p className="mt-8 text-sm text-muted-foreground md:mt-10">
              Further reading:{" "}
              <a href={b.referenceUrl} target="_blank" rel="noopener noreferrer" className="border-b border-ink/40 hover:text-rust">
                {new URL(b.referenceUrl).hostname.replace(/^www\./, "")}
              </a>
            </p>
          )}
        </article>

        {/* SIDEBAR */}
        <aside className="mt-16 md:col-span-4 md:mt-0">
          <div className="space-y-10 md:sticky md:top-24">
            <div>
              <p className="eyebrow text-rust">Temperament</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.temperament.map((t) => (
                  <span key={t} className="border border-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] md:text-xs">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-rust">By the Numbers</p>
              <div className="mt-4">
                <StatBar label="Energy" value={b.energy} />
                <StatBar label="Affection" value={b.affection} />
                <StatBar label="Trainability" value={b.trainability} />
                <StatBar label="Grooming Needs" value={b.grooming} />
                <StatBar label="Shedding" value={b.shedding} />
                <StatBar label="Good w/ Kids" value={b.goodWithKids} />
              </div>
            </div>

            <div className="bg-ink p-6 text-cream">
              <p className="eyebrow text-gold">Editor's Note</p>
              <p className="mt-3 font-serif text-lg italic leading-snug md:text-xl">
                &ldquo;{b.tagline}&rdquo; — a {b.species} that rewards the prepared owner and humbles the sentimental one.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1400px] border-t border-ink/30 px-4 py-16 sm:px-6 md:px-10 md:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/30 pb-4">
            <p className="eyebrow">Continue Reading</p>
            <Link to={b.species === "dog" ? "/dogs" : "/cats"} className="text-xs font-semibold uppercase tracking-[0.22em] text-rust">
              All {b.species === "dog" ? "dogs" : "cats"} →
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-x-10">
            {related.map(r => <BreedCard key={r.slug} breed={r} />)}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-12 first:mt-0 md:mt-16">
      <div className="flex items-baseline gap-4">
        <p className="eyebrow text-rust">{eyebrow}</p>
        <span className="h-px flex-1 bg-ink/30" />
      </div>
      <h2 className="display-md mt-4">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
