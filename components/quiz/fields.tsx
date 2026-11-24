"use client";

const inputBase =
  "block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-lg tabular-nums dark:border-zinc-700 dark:bg-zinc-950 disabled:opacity-70";
const inputClass = `mt-1 ${inputBase}`;

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

/** Camp per a enters: obre el teclat numèric al mòbil. */
export function NumberField(props: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        className={inputClass}
      />
    </label>
  );
}

/** Camp per a nombres decimals (coma o punt), amb la unitat a la dreta. */
export function DecimalField(props: FieldProps & { unit?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      <span className="relative mt-1 block">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={props.disabled}
          className={`${inputBase} ${props.unit ? "pr-10" : ""}`}
        />
        {props.unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
            {props.unit}
          </span>
        )}
      </span>
    </label>
  );
}

export function TextField(props: FieldProps & { placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{props.label}</span>
      <input
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
        className={inputClass}
      />
    </label>
  );
}

/** Grup de botons per triar una opció. */
export function ChoiceField<T extends string>(props: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
  disabled: boolean;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{props.label}</legend>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {props.options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={props.value === o.value}
            disabled={props.disabled}
            onClick={() => props.onChange(o.value)}
            className={`rounded-lg border px-3 py-2.5 font-medium ${
              props.value === o.value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-zinc-300 dark:border-zinc-700"
            } disabled:opacity-70`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
