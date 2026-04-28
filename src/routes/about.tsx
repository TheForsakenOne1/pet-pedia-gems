import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Pelt & Paw" },
      { name: "description", content: "About the editorial almanac of dog and cat breeds." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-24 md:px-10">
        <p className="eyebrow text-rust">Colophon</p>
        <h1 className="display-lg mt-3">About the Almanac.</h1>
        <p className="body-serif mt-10 drop-cap">
          Pelt &amp; Paw began as an argument. Two editors — one a lifelong dog person, one a reluctant convert to the cat — could not agree on which animal deserved the better magazine. The compromise: build one for both, refuse the saccharine, and trust the reader.
        </p>
        <p className="mt-6 text-pretty text-base leading-relaxed text-foreground/80">
          Every dossier is researched against breed-club studbooks, peer-reviewed veterinary literature, and the unvarnished testimony of owners who have lived a full breed lifespan. We photograph our subjects in natural light. We do not airbrush.
        </p>
        <p className="mt-6 text-pretty text-base leading-relaxed text-foreground/80">
          We publish quarterly in print and continuously here. New breeds are added as we finish them — never before.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
