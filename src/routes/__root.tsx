import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-rust">Error № 404</p>
        <h1 className="display-lg mt-3">A missing dossier.</h1>
        <p className="mt-4 text-base text-muted-foreground">
          The page you sought has wandered off the leash.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-xs font-semibold uppercase tracking-[0.22em] hover:text-rust"
          >
            Back to the index →
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pelt & Paw — An Editorial Almanac of Dogs & Cats" },
      { name: "description", content: "Long-form, photographed dossiers on the breeds that share our homes." },
      { name: "author", content: "Pelt & Paw" },
      { property: "og:title", content: "Pelt & Paw — An Editorial Almanac" },
      { property: "og:description", content: "Long-form, photographed dossiers on dog and cat breeds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
