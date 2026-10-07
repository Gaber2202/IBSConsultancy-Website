'use client';

type Option = [string, string];

export function OptionGrid({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: Option[];
  value: string | string[] | undefined;
  onChange: (id: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map(([id, label]) => {
        const selected = multi
          ? Array.isArray(value) && value.includes(id)
          : value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(id)}
            className={`rounded-2xl border px-4 py-4 text-start text-sm font-medium transition-all ${
              selected
                ? 'border-steel-500 bg-steel-50 text-ink-900 shadow-soft ring-1 ring-steel-500/30'
                : 'border-ink-100 bg-white text-ink-600 hover:border-ink-300 hover:text-ink-900'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
