import { createFileRoute } from "@tanstack/react-router";
import { BreedCard } from "@/components/breed-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listBreeds } from "@/server/breeds";

export const Route = createFileRoute("/dogs")({
  loader: () => listBreeds(),
  head: () => ({
    meta: [
      { title: "The Dog Index — Pelt & Paw" },
      { name: "description", content: "Every documented dog breed: history, temperament, care, and health, written for serious owners." },
      { property: "og:title", content: "The Dog Index — Pelt & Paw" },
      { property: "og:description", content: "Every documented dog breed." },
    ],
  }),
  component: DogsPage,
});

function DogsPage() {
  const breeds = Route.useLoaderData();
  const dogs = breeds.filter(b => b.species === "dog");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-4">
          <div>
            <p className="eyebrow text-rust">Section I</p>
            <h1 className="display-xl mt-4">The Dog Index.</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{dogs.length} entries</p>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
          A complete working list of canine pedigrees — from gundogs to giants. Each entry runs deep: origin, anatomy, temperament, hard health truths, and the care a fifteen-year companion deserves.
        </p>
        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {dogs.map((b, i) => (
            <div key={b.slug} className={i % 5 === 1 ? "md:translate-y-10" : ""}>
              <BreedCard breed={b} variant={i % 3 === 0 ? "tall" : "default"} />
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
