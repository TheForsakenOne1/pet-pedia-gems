import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DisplayXL, DisplayLG, DisplayMD, Eyebrow, Prose } from "@/components/typography";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Masthead — Pelt & Paw" },
      { name: "description", content: "The people, principles, and process behind Pelt & Paw — an editorial almanac of the breeds that share our homes." },
      { property: "og:title", content: "Masthead — Pelt & Paw" },
      { property: "og:description", content: "Who makes the almanac, what we believe, and how each dossier is assembled." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const MASTHEAD: { role: string; name: string; note: string }[] = [
  { role: "Editor at Large", name: "M. Holloway", note: "Twenty-two years at the bench, two GSDs, one indifferent tortoise." },
  { role: "Veterinary Editor", name: "Dr. R. Okafor, DVM", note: "Small-animal internal medicine; writes the health sections." },
  { role: "Photography Director", name: "S. Lindqvist", note: "Natural light, no flash, no hair gel. Shoots on a 50mm." },
  { role: "Research Lead", name: "A. Tanaka", note: "Reads kennel-club studbooks for fun. Disputes them for sport." },
  { role: "Field Correspondent", name: "J. Mensah", note: "Travels for working-line stories. Files copy from kennels." },
  { role: "Copy Chief", name: "P. Dvořák", note: "Will fight you over the serial comma." },
];

const PRINCIPLES = [
  {
    n: "I",
    title: "Respect the animal first.",
    body: "We do not write breed pages to sell anything. We write them so an owner walks in clear-eyed about the next fifteen years.",
  },
  {
    n: "II",
    title: "No airbrushing — visual or editorial.",
    body: "Every photograph is unretouched natural light. Every health note names the conditions that cluster in the lineage.",
  },
  {
    n: "III",
    title: "Cite the studbooks, talk to the owners.",
    body: "Kennel-club records anchor the history. Long-form interviews with people who have lived a full breed lifespan anchor the truth.",
  },
  {
    n: "IV",
    title: "Publish only when the dossier is honest.",
    body: "We refuse to publish a breed page until it would survive a second reading by a veterinarian, a breeder, and a tired new owner at 11pm.",
  },
];

const PROCESS = [
  { step: "01", title: "Source", body: "Pull breed records from TheDogAPI and TheCatAPI. Cross-check against AKC, FCI, TICA, and CFA registries." },
  { step: "02", title: "Interview", body: "Two to four conversations with breeders or long-term owners. Veterinarian on call for the health pass." },
  { step: "03", title: "Photograph", body: "Subjects shot in their working environment. No studios, no props, no costumes." },
  { step: "04", title: "Write", body: "Editorial draft, technical review, copy edit, fact-check. Then it sits a week before publishing." },
  { step: "05", title: "Publish", body: "Live online the moment it clears the final read. Quarterly print follows in MMXXVII." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* MASTHEAD HERO */}
      <section className="border-b border-ink/20">
        <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 md:px-10 md:pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 text-[10px] uppercase tracking-[0.25em] text-foreground/60 md:text-xs">
            <span>Colophon · MMXXVI</span>
            <span className="text-rust">Inside the almanac</span>
          </div>
          <Eyebrow className="mt-8 !text-rust md:mt-10">The Masthead</Eyebrow>
          <DisplayXL className="mt-3 md:mt-4">
            How the<br />
            <span className="italic text-rust">almanac</span> is made.
          </DisplayXL>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-snug text-foreground/80 sm:text-2xl md:text-3xl">
            Pelt &amp; Paw is built by six people, one veterinarian on call, and a stack of pre-war kennel-club records.
            Here is who we are, what we believe, and how each dossier reaches you.
          </p>
        </div>

        {/* Stat strip */}
        <div className="mx-auto mt-10 grid max-w-[1400px] grid-cols-2 gap-y-6 border-t border-ink/15 px-4 py-8 sm:px-6 md:mt-16 md:grid-cols-4 md:px-10 md:py-10">
          {[
            ["≈ 270", "breeds documented"],
            ["6", "editorial staff"],
            ["1", "vet on call"],
            ["0", "AI-generated photographs"],
          ].map(([big, small]) => (
            <div key={small}>
              <p className="font-serif text-4xl leading-none md:text-6xl">{big}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="mx-auto max-w-[1400px] grid gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 md:gap-16 md:px-10 md:py-24">
        <div className="md:col-span-3">
          <Eyebrow className="!text-rust">Chapter I</Eyebrow>
          <DisplayMD as="h2" className="mt-3">An origin in argument.</DisplayMD>
        </div>
        <div className="md:col-span-9">
          <Prose dropCap>
            Pelt &amp; Paw began in a kitchen in Östermalm, over an argument neither of us has won. One editor — a lifelong working-dog person — believed any honest magazine about pets had to begin with the dog. The other — converted, late and reluctantly, to the cat — refused to publish anything that pretended one species mattered more than the other. The compromise was the magazine you are reading: a single, serious almanac for both, refusing to be saccharine, and trusting the reader to handle hard facts about lifespan, health, and temperament.
          </Prose>
          <p className="mt-6 text-pretty text-base leading-relaxed text-foreground/80 md:text-lg">
            The first issue, published as a 36-page broadsheet in February of MMXXVI, profiled four breeds and a single veterinary essay on hip dysplasia. We were embarrassed by half of it within a year. The current edition is the result of correcting those embarrassments, one breed at a time.
          </p>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="border-y border-ink/20 bg-ink text-cream">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <Eyebrow className="!text-gold">Editorial Principles</Eyebrow>
          <DisplayLG as="h2" className="mt-3">Four rules we will not bend.</DisplayLG>
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="border-t border-cream/15 pt-6">
                <p className="font-serif text-5xl leading-none italic text-gold md:text-6xl">{p.n}</p>
                <h3 className="mt-4 font-serif text-2xl leading-tight md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-cream/75 md:text-base">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="grid gap-6 border-b border-ink/30 pb-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow className="!text-rust">Chapter II</Eyebrow>
            <DisplayLG as="h2" className="mt-3">From query to dossier.</DisplayLG>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground md:col-span-4">
            Every breed page passes through five stages. Most take six to eight weeks; a few have taken six months.
          </p>
        </div>
        <ol className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-5">
          {PROCESS.map((s) => (
            <li key={s.step} className="border-t border-ink/30 pt-5">
              <p className="font-serif text-4xl leading-none text-rust md:text-5xl">{s.step}</p>
              <h3 className="mt-4 font-serif text-xl leading-tight md:text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* MASTHEAD ROSTER */}
      <section className="border-t border-ink/20 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <Eyebrow className="!text-rust">The Roster</Eyebrow>
          <DisplayLG as="h2" className="mt-3">Who actually makes it.</DisplayLG>
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
            {MASTHEAD.map((m) => (
              <article key={m.name} className="border-t border-ink/30 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rust">{m.role}</p>
                <h3 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">{m.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">{m.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28">
        <Eyebrow className="!text-rust">A House Saying</Eyebrow>
        <blockquote className="mt-5 font-serif text-3xl italic leading-snug text-balance md:mt-6 md:text-5xl">
          &ldquo;Write the page you would have wanted to read the night before you brought the animal home.&rdquo;
        </blockquote>
        <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:mt-6 md:text-xs">— pinned above the editor's desk</p>
      </section>

      {/* CTA */}
      <section className="border-t border-ink/20">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:gap-12 md:px-10 md:py-20">
          <div>
            <Eyebrow className="!text-rust">Start reading</Eyebrow>
            <DisplayMD as="h2" className="mt-3">Pick an index. Begin.</DisplayMD>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Each dossier runs deep — origin, anatomy, temperament, health, husbandry, and the things owners only learn by year three.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/dogs" className="btn-primary inline-flex items-center gap-3">
              The Canines →
            </Link>
            <Link to="/cats" className="btn-ghost inline-flex items-center gap-3">
              The Felines →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
