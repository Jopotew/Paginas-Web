import { inPriceRange, normalizeText, parseSort, searchItems, type PriceRange, type SortKey } from "@pw/core";
import { COLOR_FAMILIES, type ApparelProduct, type ColorFamily } from "./schemas";

const LETTER_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/** Talles en letras primero (en orden lógico), después los numéricos de menor a mayor, al final "Único". */
export function compareSizes(a: string, b: string): number {
  const rank = (s: string): [number, number] => {
    const li = LETTER_SIZES.indexOf(s.toUpperCase());
    if (li >= 0) return [0, li];
    const n = Number(s);
    if (!Number.isNaN(n)) return [1, n];
    return [2, 0];
  };
  const [ga, va] = rank(a);
  const [gb, vb] = rank(b);
  return ga - gb || va - vb || a.localeCompare(b);
}

export const PRICE_RANGES: PriceRange[] = [
  { id: "hasta-30000", label: "Hasta $30.000", min: 0, max: 30000 },
  { id: "30000-60000", label: "$30.000 a $60.000", min: 30000, max: 60000 },
  { id: "60000-100000", label: "$60.000 a $100.000", min: 60000, max: 100000 },
  { id: "desde-100000", label: "Más de $100.000", min: 100000, max: null },
];

export interface ApparelFilters {
  category: string | null;
  sizes: string[];
  colors: ColorFamily[];
  price: string | null;
  onSale: boolean;
  q: string;
  sort: SortKey;
}

export const EMPTY_FILTERS: ApparelFilters = {
  category: null,
  sizes: [],
  colors: [],
  price: null,
  onSale: false,
  q: "",
  sort: "relevancia",
};

type Params = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined): string[] =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((s) => s.split(",")).map((s) => s.trim()).filter(Boolean);

const first = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v);

/** Lee filtros de la URL ignorando valores desconocidos: una URL vieja o editada a mano nunca rompe la página. */
export function parseFilters(params: Params, category: string | null = null): ApparelFilters {
  const price = first(params.precio);
  return {
    category,
    sizes: list(params.talle),
    colors: list(params.color).filter((c): c is ColorFamily => c in COLOR_FAMILIES),
    price: PRICE_RANGES.some((r) => r.id === price) ? price! : null,
    onSale: first(params.oferta) === "1",
    q: (first(params.q) ?? "").slice(0, 80),
    sort: parseSort(first(params.orden)),
  };
}

/** Inverso de parseFilters (sin la categoría, que va en la ruta). */
export function filtersToSearchParams(f: ApparelFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.sizes.length) sp.set("talle", f.sizes.join(","));
  if (f.colors.length) sp.set("color", f.colors.join(","));
  if (f.price) sp.set("precio", f.price);
  if (f.onSale) sp.set("oferta", "1");
  if (f.sort !== "relevancia") sp.set("orden", f.sort);
  return sp;
}

export function activeFilterCount(f: ApparelFilters): number {
  return f.sizes.length + f.colors.length + (f.price ? 1 : 0) + (f.onSale ? 1 : 0);
}

/**
 * Talle y color se evalúan sobre la misma variante con stock: si filtrás
 * "M" + "azul", solo aparece lo que existe en M y en azul a la vez. Así no se
 * muestran prendas que después resultan no estar en tu talle.
 */
export function matchesVariantFilters(p: ApparelProduct, sizes: string[], colors: ColorFamily[]): boolean {
  if (sizes.length === 0 && colors.length === 0) return true;
  const familyOf = new Map(p.colors.map((c) => [c.id, c.family]));
  return p.variants.some(
    (v) =>
      v.stock > 0 &&
      (sizes.length === 0 || sizes.includes(v.size)) &&
      (colors.length === 0 || colors.includes(familyOf.get(v.color)!)),
  );
}

export function filterProducts(products: readonly ApparelProduct[], f: ApparelFilters): ApparelProduct[] {
  const range = f.price ? PRICE_RANGES.find((r) => r.id === f.price) : undefined;
  const base = f.q
    ? searchItems(products, f.q, (p) => [p.material, p.fit, p.garment, ...p.colors.map((c) => c.name)].join(" "))
    : [...products];
  return base.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (!range || inPriceRange(p.price, range)) &&
      (!f.onSale || (p.compareAtPrice !== null && p.compareAtPrice > p.price)) &&
      matchesVariantFilters(p, f.sizes, f.colors),
  );
}

export interface FacetOptions {
  sizes: string[];
  colors: { family: ColorFamily; label: string; swatch: string }[];
}

/** Opciones disponibles dentro del alcance actual (categoría), para no ofrecer filtros que dan cero resultados. */
export function buildFacets(products: readonly ApparelProduct[]): FacetOptions {
  const sizes = new Set<string>();
  const families = new Set<ColorFamily>();
  for (const p of products) {
    for (const v of p.variants) {
      if (v.stock > 0) sizes.add(v.size);
    }
    for (const c of p.colors) families.add(c.family);
  }
  return {
    sizes: [...sizes].sort(compareSizes),
    colors: (Object.keys(COLOR_FAMILIES) as ColorFamily[])
      .filter((f) => families.has(f))
      .map((f) => ({ family: f, ...COLOR_FAMILIES[f] })),
  };
}

/** Si la búsqueda es exactamente una categoría ("camperas"), conviene llevar a esa categoría. */
export function categoryForQuery(q: string, categories: readonly { slug: string; name: string }[]): string | null {
  const n = normalizeText(q);
  if (!n) return null;
  const hit = categories.find((c) => {
    const name = normalizeText(c.name);
    return n === name || n === c.slug || n + "s" === name || n === name + "s";
  });
  return hit?.slug ?? null;
}
