export function BreedGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:gap-x-10 md:gap-y-20 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse flex-col">
          <div className={`rounded-[1rem] bg-ink/8 ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}`} />
          <div className="mt-5 h-6 w-3/4 rounded bg-ink/8" />
          <div className="mt-3 h-4 w-1/2 rounded bg-ink/8" />
          <div className="mt-3 h-3 w-full rounded bg-ink/8" />
          <div className="mt-1.5 h-3 w-5/6 rounded bg-ink/8" />
        </div>
      ))}
    </div>
  );
}

export function BreedDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
      <div className="animate-pulse">
        <div className="h-3 w-40 rounded bg-ink/8" />
        <div className="mt-8 h-12 w-2/3 rounded bg-ink/8 md:h-20" />
        <div className="mt-6 h-6 w-1/2 rounded bg-ink/8" />
        <div className="mt-12 aspect-[16/9] w-full rounded-[1.25rem] bg-ink/8 md:aspect-[21/9]" />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 rounded bg-ink/8" />
              <div className="mt-3 h-6 w-24 rounded bg-ink/8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
