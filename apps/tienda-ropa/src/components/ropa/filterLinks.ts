import { filtersToSearchParams, type ApparelFilters } from "@pw/ropa";

/** Arma el href del catálogo con los filtros cambiados. Los filtros son links: funcionan sin JavaScript y se pueden compartir. */
export function catalogHref(f: ApparelFilters, change: Partial<ApparelFilters> = {}): string {
  const next = { ...f, ...change };
  const path = next.category ? `/tienda/${next.category}` : "/tienda";
  const qs = filtersToSearchParams(next).toString();
  return qs ? `${path}?${qs}` : path;
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}
