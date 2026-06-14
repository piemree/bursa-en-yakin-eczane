import ilcelerData from "@/data/ilceler.json";
import mahallelerData from "@/data/mahalleler.json";
import { stripNobetciSuffix } from "./slug";
import type { Ilce, Mahalle, Scope } from "./types";

export const ilceler = ilcelerData as Ilce[];
export const mahalleler = mahallelerData as Mahalle[];

/** BEO nöbet bölgeleri aynı ilçeyi birden fazla satırda tutabiliyor; UI için tekilleştir. */
export function getUniqueIlceler(): Ilce[] {
  const seen = new Set<string>();
  return ilceler.filter((ilce) => {
    if (seen.has(ilce.id)) return false;
    seen.add(ilce.id);
    return true;
  });
}

const ilceBySlug = new Map(ilceler.map((ilce) => [ilce.slug, ilce]));
const ilceById = new Map(ilceler.map((ilce) => [ilce.id, ilce]));
const mahalleBySlug = new Map(mahalleler.map((mahalle) => [mahalle.slug, mahalle]));

export function resolveScopeFromSlug(rawSlug: string): Scope | null {
  const base = stripNobetciSuffix(rawSlug);

  const ilce =
    ilceBySlug.get(`${base}-nobetci-eczane`) ??
    ilceById.get(base) ??
    ilceler.find((item) => item.id === base);

  if (ilce) {
    return {
      type: "district",
      label: ilce.name,
      district: ilce.name,
    };
  }

  const mahalle =
    mahalleBySlug.get(`${base}-nobetci-eczane`) ??
    mahalleBySlug.get(rawSlug) ??
    mahalleler.find((item) => stripNobetciSuffix(item.slug) === base);

  if (mahalle) {
    return {
      type: "mahalle",
      label: mahalle.name.replace(/ Mahallesi$/i, ""),
      district: mahalle.district,
      mahalle,
    };
  }

  return null;
}

export function getAllStaticSlugs(): string[] {
  const ilceSlugs = ilceler.map((ilce) => ilce.slug);
  const mahalleSlugs = mahalleler.map((mahalle) => mahalle.slug);
  return [...new Set([...ilceSlugs, ...mahalleSlugs])];
}

export function getSearchItems() {
  return [
    ...ilceler.map((ilce) => ({
      type: "district" as const,
      label: ilce.name,
      subtitle: "İlçe",
      href: `/${ilce.slug}`,
      keywords: [ilce.name, ilce.dutyZone],
    })),
    ...mahalleler.map((mahalle) => ({
      type: "mahalle" as const,
      label: mahalle.name.replace(/ Mahallesi$/i, ""),
      subtitle: mahalle.district,
      href: `/${mahalle.slug}`,
      keywords: [mahalle.name, mahalle.district],
    })),
  ];
}
