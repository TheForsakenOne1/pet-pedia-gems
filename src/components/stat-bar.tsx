interface Props {
  label: string;
  value: number; // 1-5
}

export function StatBar({ label, value }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/10 py-3 last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${i < value ? "bg-ink" : "bg-ink/12"}`}
          />
        ))}
      </div>
    </div>
  );
}
