export type CustomizationFieldKey =
  | "customName"
  | "customColor"
  | "customGlitterColor"
  | "customTasselColor"
  | "customShape"
  | "customFont"
  | "customDecoration"
  | "customMessage"
  | "customPhotoUrl";

type BaseField = {
  key: CustomizationFieldKey;
  label: string;
  required?: boolean;
};

export type CustomizationFieldDef =
  | (BaseField & { type: "text"; placeholder?: string; maxLength?: number })
  | (BaseField & { type: "textarea"; placeholder?: string; maxLength?: number })
  | (BaseField & { type: "select"; options: string[] })
  | (BaseField & { type: "photo" });

/**
 * Exact customization fields per product, keyed by product slug. Each of the
 * five current products has its own specific set of fields — this is not a
 * generic/admin-configurable system, it mirrors the fixed spec for this catalog.
 */
export const PRODUCT_CUSTOMIZATION_FIELDS: Record<string, CustomizationFieldDef[]> = {
  "resin-alphabet-keychain": [
    { key: "customName", type: "text", label: "Alphabet / Letter", placeholder: "e.g. A", maxLength: 3, required: true },
    { key: "customGlitterColor", type: "select", label: "Glitter Color", options: ["Gold", "Silver", "Rose Gold", "Rainbow", "None"], required: true },
    { key: "customTasselColor", type: "select", label: "Tassel Color", options: ["Blush Pink", "Lavender", "Gold", "Ivory", "Black"], required: true },
  ],
  "resin-bookmark": [
    { key: "customName", type: "text", label: "Name", placeholder: "e.g. Ananya", maxLength: 30 },
    { key: "customColor", type: "select", label: "Flower Color", options: ["Pink", "Purple", "Yellow", "White", "Mixed"], required: true },
    { key: "customMessage", type: "textarea", label: "Custom Message", placeholder: "A short message (optional)", maxLength: 150 },
  ],
  "photo-keychain": [
    { key: "customPhotoUrl", type: "photo", label: "Upload Photo", required: true },
    { key: "customName", type: "text", label: "Name", placeholder: "e.g. Ananya", maxLength: 30 },
    { key: "customShape", type: "select", label: "Shape", options: ["Heart", "Round", "Rectangle"], required: true },
  ],
  "resin-name-stand": [
    { key: "customName", type: "text", label: "Name", placeholder: "e.g. Ananya", maxLength: 30, required: true },
    { key: "customFont", type: "select", label: "Font Style", options: ["Elegant Script", "Classic Serif", "Modern Sans", "Bold Block"], required: true },
    { key: "customColor", type: "select", label: "Resin Color", options: ["Clear", "Ivory Gold", "Blush Pink", "Lavender"], required: true },
    { key: "customDecoration", type: "select", label: "Decoration", options: ["Flowers", "Gold Flakes", "Butterflies", "None"] },
  ],
  "resin-photo-coaster": [
    { key: "customPhotoUrl", type: "photo", label: "Upload Photo", required: true },
    { key: "customShape", type: "select", label: "Shape", options: ["Square", "Round"], required: true },
    { key: "customMessage", type: "text", label: "Custom Text", placeholder: "e.g. Est. 2024", maxLength: 40 },
  ],
};

export function getCustomizationFields(slug: string): CustomizationFieldDef[] {
  return PRODUCT_CUSTOMIZATION_FIELDS[slug] || [];
}

export const CUSTOMIZATION_FIELD_LABELS: Record<CustomizationFieldKey, string> = {
  customName: "Name / Letter",
  customColor: "Color",
  customGlitterColor: "Glitter Color",
  customTasselColor: "Tassel Color",
  customShape: "Shape",
  customFont: "Font Style",
  customDecoration: "Decoration",
  customMessage: "Message / Text",
  customPhotoUrl: "Uploaded Photo",
};
