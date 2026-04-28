interface Props {
  label: string;
  value: number; // 1-5
}

export function StatBar({ label, value }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/15 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-5 ${i < value ? "bg-ink" : "bg-ink/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
