import type { JSX } from "react";

/**
 * Tokenize a query into trimmed, lowercased, length>=2 tokens.
 */
export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
}

/**
 * True if every token in `q` matches anywhere in any of the haystack strings.
 * Partial substring match per token; tokens are AND-ed.
 */
export function matchesAll(haystack: string[], tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const joined = haystack.join(" \u0001 ").toLowerCase();
  return tokens.every((t) => joined.includes(t));
}

/**
 * Render a string with substring matches wrapped in <mark>. Case-insensitive,
 * supports multiple tokens, longest tokens first to avoid nested overlap.
 */
export function highlight(text: string, tokens: string[]): JSX.Element {
  if (!text || tokens.length === 0) return <>{text}</>;
  const sorted = Array.from(new Set(tokens))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "ig");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark key={i} className="bg-gold/40 px-0.5 text-ink">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
