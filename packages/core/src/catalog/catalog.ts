import type { BaseItem } from "../schemas/item";

export type SortKey = "relevancia" | "novedades" | "precio-asc" | "precio-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Destacados" },
  { value: "novedades", label: "Novedades" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
];

export function parseSort(value: string | undefined | null): SortKey {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "relevancia";
}

/** Orden estable: ante empate conserva el orden del archivo de datos. */
export function sortItems<T extends BaseItem>(items: readonly T[], sort: SortKey): T[] {
  const indexed = items.map((item, i) => ({ item, i }));
  const byIndex = (a: { i: number }, b: { i: number }) => a.i - b.i;
  const cmp: Record<SortKey, (a: { item: T; i: number }, b: { item: T; i: number }) => number> = {
    relevancia: (a, b) => Number(b.item.featured) - Number(a.item.featured) || byIndex(a, b),
    novedades: (a, b) => b.item.createdAt.localeCompare(a.item.createdAt) || byIndex(a, b),
    "precio-asc": (a, b) => a.item.price - b.item.price || byIndex(a, b),
    "precio-desc": (a, b) => b.item.price - a.item.price || byIndex(a, b),
  };
  return indexed.sort(cmp[sort]).map((x) => x.item);
}

/** De más a menos vendido. Orden estable: ante empate conserva el orden del archivo. */
export function rankBySales<T extends BaseItem>(items: readonly T[]): T[] {
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => b.item.unitsSold - a.item.unitsSold || a.i - b.i)
    .map((x) => x.item);
}

/** Minúsculas y sin tildes, para que "camperas" encuentre "Campera" y "algodon" encuentre "algodón". */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/**
 * Búsqueda por términos: un ítem coincide si todos los términos aparecen en
 * nombre, descripción, categoría o tags. Suficiente para catálogos de cientos
 * de productos; con miles conviene un índice (ver docs/06-roadmap.md).
 */
export function searchItems<T extends BaseItem>(items: readonly T[], query: string, extraText?: (item: T) => string): T[] {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...items];
  return items.filter((item) => {
    const haystack = normalizeText(
      [item.name, item.description, item.category, ...item.tags, extraText?.(item) ?? ""].join(" "),
    );
    return terms.every((t) => haystack.includes(t) || (t.endsWith("s") && haystack.includes(t.slice(0, -1))));
  });
}

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number | null;
}

export function inPriceRange(price: number, range: PriceRange): boolean {
  return price >= range.min && (range.max === null || price < range.max);
}
