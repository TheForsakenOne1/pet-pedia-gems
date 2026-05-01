import { Link } from "@tanstack/react-router";
import type { BreedSummary } from "@/types/breed";
import { BreedImage } from "@/components/breed-image";
import { highlight } from "@/lib/search";
import { DisplayLG, Eyebrow } from "@/components/typography";

interface Props {
  breed: BreedSummary;
  variant?: "default" | "feature" | "tall";
  /** Active search tokens — when provided, matches in title/tagline/intro are highlighted */
  tokens?: string[];
}

export function BreedCard({ breed, variant = "default", tokens = [] }: Props) {
  if (variant === "feature") {
    return (
      <Link
        to="/breed/$slug"
        params={{ slug: breed.slug }}
        className="group relative col-span-full grid gap-8 overflow-hidden py-10 md:grid-cols-12 md:gap-14 md:py-16"
      >
        <div className="relative md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-secondary md:aspect-[5/4]">
            <BreedImage
              src={breed.image}
              alt={breed.name}
              name={breed.name}
              width={1024}
              height={1280}
              className="h-full w-full object-cover transition duration-[1200ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-cream/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" /> Cover Subject
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between md:col-span-5">
          <div>
            <Eyebrow>№ {breed.issueNo} — The Feature</Eyebrow>
            <DisplayLG as="h2" className="mt-5">{highlight(breed.name, tokens)}</DisplayLG>
            <p className="mt-4 font-serif text-2xl italic leading-snug text-foreground/70 sm:text-[1.65rem]">
              {highlight(breed.tagline, tokens)}
            </p>
            <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-foreground/75">
              {highlight(breed.intro, tokens)}
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-foreground/55 md:mt-10">
            <span>{breed.origin}</span>
            <span className="h-px flex-1 bg-ink/15" />
            <span className="font-semibold text-brass transition group-hover:text-ink">Read the dossier →</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/breed/$slug"
      params={{ slug: breed.slug }}
      className="group flex flex-col"
    >
      <div
        className={`relative overflow-hidden rounded-[1rem] bg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.10)] transition-all duration-500 group-hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_24px_48px_-18px_rgba(0,0,0,0.18)] group-hover:-translate-y-1 ${
          variant === "tall" ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <BreedImage
          src={breed.image}
          alt={breed.name}
          name={breed.name}
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition duration-[1100ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur">
          <span className="h-1 w-1 rounded-full bg-brass" /> № {breed.issueNo}
        </span>
        <span className="absolute bottom-3.5 left-3.5 translate-y-2 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          Read dossier →
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[1.65rem] leading-tight tracking-tight md:text-[1.85rem]">
          {highlight(breed.name, tokens)}
        </h3>
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {breed.species === "dog" ? "Canine" : "Feline"}
        </span>
      </div>
      <p className="mt-1.5 font-serif text-base italic leading-snug text-foreground/60">
        {highlight(breed.tagline, tokens)}
      </p>
      <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-foreground/65">
        {highlight(breed.intro, tokens)}
      </p>

      {tokens.length > 0 && breed.temperament.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground/55">
          {breed.temperament.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full border border-ink/15 px-2 py-0.5">
              {highlight(t, tokens)}
            </span>
          ))}
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-brass">
        {breed.origin.split(",")[0]} <span className="h-px w-6 bg-brass/50" />
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
