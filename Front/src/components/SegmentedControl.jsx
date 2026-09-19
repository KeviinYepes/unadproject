export default function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-surface-light p-1 dark:bg-surface-dark">
      {options.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            value === key
              ? "bg-white text-primary shadow-sm dark:bg-card-dark"
              : "text-text-secondary-light hover:text-primary dark:text-text-secondary-dark"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
