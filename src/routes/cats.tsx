import { createFileRoute } from "@tanstack/react-router";
import { BreedCard } from "@/components/breed-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listBreeds } from "@/server/breeds";

export const Route = createFileRoute("/cats")({
  loader: () => listBreeds(),
  head: () => ({
    meta: [
      { title: "The Cat Index — Pelt & Paw" },
      { name: "description", content: "Every documented cat breed: ancestry, temperament, husbandry, and health." },
      { property: "og:title", content: "The Cat Index — Pelt & Paw" },
      { property: "og:description", content: "Every documented cat breed." },
    ],
  }),
  component: CatsPage,
});

function CatsPage() {
  const breeds = Route.useLoaderData();
  const cats = breeds.filter(b => b.species === "cat");
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-4">
          <div>
            <p className="eyebrow text-rust">Section II</p>
            <h1 className="display-xl mt-4">The Cat Index.</h1>
          </div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{cats.length} entries</p>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
          Every recognized feline lineage we have documented — from the lynx-eared frontier cats of Maine to a hairless mutation born in a 1966 Toronto living room.
        </p>
        <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((b, i) => (
            <div key={b.slug} className={i % 5 === 2 ? "md:translate-y-10" : ""}>
              <BreedCard breed={b} variant={i % 3 === 1 ? "tall" : "default"} />
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
