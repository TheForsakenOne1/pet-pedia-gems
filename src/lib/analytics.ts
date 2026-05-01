/**
 * Lightweight analytics shim.
 *
 * Forwards events to whatever provider is mounted on the page:
 *   - window.dataLayer.push (GTM)
 *   - window.plausible (Plausible)
 *   - window.posthog.capture (PostHog)
 *
 * Falls back to a console.debug + an in-memory ring buffer (readable from
 * window.__analytics for debugging) when nothing is mounted. Safe to call
 * during SSR — all browser access is guarded.
 */

export type AnalyticsEvent =
  | {
      name: "search_submit";
      props: { surface: "dogs" | "cats"; query: string; results: number; filters: string[] };
    }
  | {
      name: "filter_toggle";
      props: {
        surface: "dogs" | "cats";
        tag: string;
        action: "add" | "remove";
        active_filters: string[];
        results: number;
      };
    }
  | {
      name: "filters_clear_all";
      props: { surface: "dogs" | "cats"; cleared_query: string; cleared_filters: string[] };
    }
  | {
      name: "empty_results";
      props: { surface: "dogs" | "cats"; query: string; filters: string[] };
    }
  | {
      name: "breed_card_click";
      props: { surface: "dogs" | "cats" | "home"; slug: string; query: string; filters: string[] };
    }
  | {
      name: "chip_sort_change";
      props: { surface: "dogs" | "cats"; sort: "relevance" | "count" | "alpha"; query: string };
    }
  | {
      name: "results_load_more";
      props: { surface: "dogs" | "cats"; page: number; page_size: number; loaded: number; total: number };
    }
  | {
      name: "results_page_view";
      props: { surface: "dogs" | "cats"; page: number; page_size: number; visible: number; total: number };
    }
  | {
      name: "breed_page_view";
      props: { surface: "dogs" | "cats" | "direct"; slug: string; species: "dog" | "cat"; query: string; filters: string[] };
    };

type WindowWithAnalytics = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void;
  posthog?: { capture: (name: string, props?: Record<string, unknown>) => void };
  __analytics?: Array<{ ts: number; name: string; props: Record<string, unknown> }>;
};

export function track<E extends AnalyticsEvent>(event: E["name"], props: Extract<AnalyticsEvent, { name: E["name"] }>["props"]): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithAnalytics;

  try {
    w.dataLayer?.push({ event, ...props });
    w.plausible?.(event, { props: props as Record<string, unknown> });
    w.posthog?.capture(event, props as Record<string, unknown>);
  } catch {
    // never let analytics break the UI
  }

  // Always log to a buffer so we can verify wiring even before a provider is mounted
  w.__analytics = w.__analytics || [];
  w.__analytics.push({ ts: Date.now(), name: event, props: props as Record<string, unknown> });
  if (w.__analytics.length > 200) w.__analytics.shift();

  if (typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, props);
  }
}
