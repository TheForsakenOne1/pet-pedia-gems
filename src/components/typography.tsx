import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Typography primitives — Fraunces (serif) + Inter Tight (sans).
 * Use these across the site for consistent rhythm, weights, and tracking.
 */

type AsProp<T extends React.ElementType> = { as?: T };
type PolymorphicProps<T extends React.ElementType, P = unknown> = AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof AsProp<T> | keyof P> &
  P;

interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

/* ───────────── Display & Headings ───────────── */

export function DisplayXL<T extends React.ElementType = "h1">({
  as,
  className,
  ...rest
}: PolymorphicProps<T, BaseProps>) {
  const Cmp = (as || "h1") as React.ElementType;
  return <Cmp className={cn("display-xl text-balance", className)} {...rest} />;
}

export function DisplayLG<T extends React.ElementType = "h2">({
  as,
  className,
  ...rest
}: PolymorphicProps<T, BaseProps>) {
  const Cmp = (as || "h2") as React.ElementType;
  return <Cmp className={cn("display-lg text-balance", className)} {...rest} />;
}

export function DisplayMD<T extends React.ElementType = "h3">({
  as,
  className,
  ...rest
}: PolymorphicProps<T, BaseProps>) {
  const Cmp = (as || "h3") as React.ElementType;
  return <Cmp className={cn("display-md text-balance", className)} {...rest} />;
}

/** Smaller serif heading for sidebar / module titles */
export function Heading<T extends React.ElementType = "h3">({
  as,
  className,
  ...rest
}: PolymorphicProps<T, BaseProps>) {
  const Cmp = (as || "h3") as React.ElementType;
  return (
    <Cmp
      className={cn(
        "font-serif text-[1.65rem] leading-tight tracking-tight md:text-[1.85rem]",
        className,
      )}
      {...rest}
    />
  );
}

/* ───────────── Eyebrow / Labels ───────────── */

interface EyebrowOwnProps extends BaseProps {
  /** Accent color: brass (default), champagne (for dark surfaces), or muted */
  tone?: "brass" | "champagne" | "muted";
}

export function Eyebrow<T extends React.ElementType = "p">({
  as,
  tone = "brass",
  className,
  ...rest
}: PolymorphicProps<T, EyebrowOwnProps>) {
  const Cmp = (as || "p") as React.ElementType;
  const toneClass =
    tone === "champagne"
      ? "text-champagne"
      : tone === "muted"
      ? "text-muted-foreground"
      : "text-brass";
  return (
    <Cmp
      className={cn(
        "font-sans text-[0.68rem] font-medium uppercase tracking-[0.28em]",
        toneClass,
        className,
      )}
      {...rest}
    />
  );
}

/** Eyebrow rendered inside a hairline pill — used for hero badges */
export function EyebrowPill({ className, children, ...rest }: BaseProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-ink/12 bg-cream/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/70 backdrop-blur",
        className,
      )}
      {...rest}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass" />
      {children}
    </span>
  );
}

/* ───────────── Body Copy ───────────── */

interface BodyProps extends BaseProps {
  size?: "sm" | "base" | "lg" | "xl";
  tone?: "default" | "muted" | "subtle" | "cream";
}

const BODY_SIZES = {
  sm: "text-[13.5px] leading-relaxed",
  base: "text-[15px] leading-relaxed",
  lg: "text-base leading-relaxed md:text-[1.15rem]",
  xl: "text-base leading-relaxed sm:text-lg md:text-[1.2rem]",
} as const;

const BODY_TONES = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  subtle: "text-foreground/70",
  cream: "text-cream/75",
} as const;

export function Body<T extends React.ElementType = "p">({
  as,
  size = "base",
  tone = "subtle",
  className,
  ...rest
}: PolymorphicProps<T, BodyProps>) {
  const Cmp = (as || "p") as React.ElementType;
  return (
    <Cmp
      className={cn(BODY_SIZES[size], BODY_TONES[tone], "text-pretty", className)}
      {...rest}
    />
  );
}

/** Italic serif lede used under major headings */
export function Lede({ className, ...rest }: BaseProps & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-serif text-[1.4rem] italic leading-snug text-foreground/72 sm:text-2xl md:text-[1.85rem]",
        className,
      )}
      {...rest}
    />
  );
}

/** Long-form serif body used inside articles */
export function Prose({ className, dropCap = false, ...rest }: BaseProps & { dropCap?: boolean } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("body-serif", dropCap && "drop-cap", className)} {...rest} />
  );
}

/** Pull quote */
export function PullQuote({ className, ...rest }: BaseProps & React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "font-serif text-[1.85rem] italic leading-[1.15] tracking-tight text-balance sm:text-4xl md:text-[3.25rem]",
        className,
      )}
      {...rest}
    />
  );
}

/* ───────────── Micro labels ───────────── */

export function MicroLabel({ className, ...rest }: BaseProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-[10px] uppercase tracking-[0.26em] text-muted-foreground",
        className,
      )}
      {...rest}
    />
  );
}
