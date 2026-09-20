export default function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-subtle p-1">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            value === key
              ? "bg-surface text-brand-ink shadow-sm"
              : "text-fg-muted hover:text-brand-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
