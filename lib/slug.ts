const TR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function normalizeText(value: string): string {
  return value
    .split("")
    .map((char) => TR_MAP[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/mahallesi/gi, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string): string {
  return normalizeText(value).replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function stripNobetciSuffix(slug: string): string {
  return slug
    .replace(/-nobetci-eczane$/i, "")
    .replace(/-nobetci$/i, "")
    .replace(/-eczane$/i, "");
}

export function toNobetciSlug(base: string): string {
  const clean = slugify(base);
  return `${clean}-nobetci-eczane`;
}
