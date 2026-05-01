# Typography Contract

All page and component edits MUST go through the typography primitives in
`src/components/typography.tsx`. Do **not** paste the raw utility classes
(`eyebrow`, `display-xl`, `display-lg`, `display-md`, `body-serif`,
`drop-cap`) onto arbitrary elements.

ESLint enforces this with `design-system/no-raw-typography-classes` (see
`eslint.config.js`). The rule fails CI if a `className` string contains any
of those tokens outside `src/components/typography.tsx`.

## Mapping (legacy class → component)

| Raw class       | Component                          | Notes                                    |
| --------------- | ---------------------------------- | ---------------------------------------- |
| `eyebrow`       | `<Eyebrow tone="brass\|champagne\|muted">` | Polymorphic via `as`              |
| `display-xl`    | `<DisplayXL>`                      | Defaults to `<h1>`                       |
| `display-lg`    | `<DisplayLG>`                      | Defaults to `<h2>`                       |
| `display-md`    | `<DisplayMD>`                      | Defaults to `<h3>`                       |
| `body-serif`    | `<Prose dropCap?>`                 | Long-form serif body                     |
| `drop-cap`      | `<Prose dropCap>`                  | Use the prop, not the class              |
| smaller serif H | `<Heading>`                        | Sidebar / module titles                  |
| short label     | `<MicroLabel>` / `<EyebrowPill>`   | Counts, badges                            |
| body paragraph  | `<Body size="sm\|base\|lg\|xl" tone="default\|muted\|subtle\|cream">` | |
| italic lede     | `<Lede>`                           | Sub-headline                              |
| pull quote      | `<PullQuote>`                      |                                          |

## Codemod (one-off)

For bulk migrations, run `rg` to find offenders, then convert by hand —
imports, `as` overrides, and `tone` choices need a human eye:

```bash
rg -n --glob '!src/components/typography.tsx' \
   --glob '!src/styles.css' \
   '\b(eyebrow|display-(xl|lg|md)|body-serif|drop-cap)\b' src
```

For each hit:
1. Add `import { … } from "@/components/typography";` (group with existing).
2. Replace the element + `className` with the component, preserving any
   non-typographic classes via the component's `className` prop.
3. If the original tag was semantically meaningful (e.g. `<h2>` inside an
   `<article>`), pass it via `as`: `<DisplayLG as="h2">`.

## Why a rule, not a convention

- Typography decisions (weight, optical-size, tracking) live in one place
  and can evolve without grepping the codebase.
- Components carry tone variants and accessibility defaults the raw class
  can't express.
- The lint failure is the fastest feedback loop — caught before review.
