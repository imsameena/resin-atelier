import { CUSTOMIZATION_FIELD_LABELS, type CustomizationFieldKey } from "@/lib/product-customization";
import { cn } from "@/lib/utils";

type CustomizationValues = Partial<Record<CustomizationFieldKey, string | null | undefined>> & {
  customNotes?: string | null;
};

const DISPLAY_ORDER: CustomizationFieldKey[] = [
  "customName",
  "customColor",
  "customGlitterColor",
  "customTasselColor",
  "customShape",
  "customFont",
  "customDecoration",
  "customMessage",
];

/** Renders whichever customization fields are actually set on an item — works for any product's field set. */
export function CustomizationSummary({
  values,
  variant = "inline",
  className,
}: {
  values: CustomizationValues;
  variant?: "inline" | "block";
  className?: string;
}) {
  const entries = DISPLAY_ORDER.filter((key) => values[key]).map((key) => ({
    key,
    label: CUSTOMIZATION_FIELD_LABELS[key],
    value: values[key] as string,
  }));

  if (entries.length === 0 && !values.customPhotoUrl && !values.customNotes) return null;

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-x-2 text-xs text-ink-400", className)}>
        {entries.map((e, i) => (
          <span key={e.key}>
            {i > 0 && "· "}
            {e.label}: <b className="text-ink-600">{e.value}</b>
          </span>
        ))}
        {values.customPhotoUrl && <span>· Photo attached</span>}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-1 rounded-lg bg-lavender-50/60 p-3 text-xs text-ink-600 sm:grid-cols-2", className)}>
      {entries.map((e) => (
        <span key={e.key}>
          <b>{e.label}:</b> {e.value}
        </span>
      ))}
      {values.customNotes && (
        <span className="sm:col-span-2">
          <b>Special Instructions:</b> {values.customNotes}
        </span>
      )}
      {values.customPhotoUrl && (
        <a href={values.customPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blush-600 underline sm:col-span-2">
          View uploaded photo
        </a>
      )}
      {entries.length === 0 && !values.customPhotoUrl && !values.customNotes && (
        <span className="text-ink-400">No customization requested</span>
      )}
    </div>
  );
}
