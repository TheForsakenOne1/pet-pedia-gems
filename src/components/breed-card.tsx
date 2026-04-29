import { Link } from "@tanstack/react-router";
import type { BreedSummary } from "@/types/breed";
import { BreedImage } from "@/components/breed-image";
import { highlight } from "@/lib/search";

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
        className="group relative col-span-full grid gap-8 overflow-hidden border-y border-ink/20 py-8 sm:py-10 md:grid-cols-12 md:gap-12 md:py-14"
      >
        <div className="relative md:col-span-7">
          <div className="aspect-[4/5] overflow-hidden bg-secondary md:aspect-[5/4]">
            <BreedImage
              src={breed.image}
              alt={breed.name}
              name={breed.name}
              width={1024}
              height={1280}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between md:col-span-5">
          <div>
            <p className="eyebrow text-rust">№ {breed.issueNo} — The Feature</p>
            <h2 className="display-lg mt-4 text-balance">{highlight(breed.name, tokens)}</h2>
            <p className="mt-3 font-serif text-xl italic text-muted-foreground sm:text-2xl">{highlight(breed.tagline, tokens)}</p>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-foreground/80">{highlight(breed.intro, tokens)}</p>
          </div>
          <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-foreground/60 md:mt-8 md:text-xs">
            <span>{breed.origin}</span>
            <span className="h-px flex-1 bg-ink/30" />
            <span className="text-rust">Read the dossier →</span>
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
      <div className={`relative overflow-hidden bg-secondary ${variant === "tall" ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
        <BreedImage
          src={breed.image}
          alt={breed.name}
          name={breed.name}
          width={1024}
          height={1280}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 bg-cream px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
          № {breed.issueNo}
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl leading-tight md:text-3xl">{highlight(breed.name, tokens)}</h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{breed.species}</span>
      </div>
      <p className="mt-1 font-serif text-base italic text-muted-foreground">{highlight(breed.tagline, tokens)}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/70">{highlight(breed.intro, tokens)}</p>
      {tokens.length > 0 && breed.temperament.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground/60">
          {breed.temperament.slice(0, 4).map((t) => (
            <span key={t} className="border border-ink/20 px-1.5 py-0.5">
              {highlight(t, tokens)}
            </span>
          ))}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rust">
        Read · {breed.origin.split(",")[0]} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
