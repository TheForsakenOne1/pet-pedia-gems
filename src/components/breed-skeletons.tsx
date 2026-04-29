export function BreedGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse flex-col">
          <div className={`bg-ink/10 ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-[4/5]"}`} />
          <div className="mt-5 h-6 w-3/4 bg-ink/10" />
          <div className="mt-3 h-4 w-1/2 bg-ink/10" />
          <div className="mt-3 h-3 w-full bg-ink/10" />
          <div className="mt-1 h-3 w-5/6 bg-ink/10" />
        </div>
      ))}
    </div>
  );
}

export function BreedDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
      <div className="animate-pulse">
        <div className="h-3 w-40 bg-ink/10" />
        <div className="mt-8 h-12 w-2/3 bg-ink/10 md:h-20" />
        <div className="mt-6 h-6 w-1/2 bg-ink/10" />
        <div className="mt-12 aspect-[16/9] w-full bg-ink/10 md:aspect-[21/9]" />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-ink/10" />
              <div className="mt-3 h-6 w-24 bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
