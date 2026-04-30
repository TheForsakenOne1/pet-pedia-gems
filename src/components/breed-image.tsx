interface Props {
  src: string;
  alt: string;
  name: string;
  className?: string;
  /** sizing for img tag */
  width?: number;
  height?: number;
  /** loading hint */
  loading?: "eager" | "lazy";
  /** rendered when image is missing or fails to load */
  fallbackClassName?: string;
}

import { useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * Image wrapper that gracefully degrades to an editorial placeholder
 * (breed name on a textured ink background) when:
 *  - no src is provided
 *  - the network request fails
 *  - the bytes load but cannot be decoded
 */
export function BreedImage({
  src,
  alt,
  name,
  className = "h-full w-full object-cover",
  width,
  height,
  loading = "lazy",
  fallbackClassName = "",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-cream surface-onyx ${fallbackClassName}`}
      >
        <ImageOff className="h-6 w-6 text-champagne/50" aria-hidden />
        <p className="font-serif text-2xl italic leading-tight md:text-3xl">{name}</p>
        <p className="text-[10px] uppercase tracking-[0.28em] text-champagne/60">
          Plate unavailable
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
