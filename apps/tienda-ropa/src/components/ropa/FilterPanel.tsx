import Link from "next/link";
import type { Category } from "@pw/core";
import { PRICE_RANGES, type ApparelFilters, type FacetOptions } from "@pw/ropa";
import { catalogHref, toggle } from "./filterLinks";

/**
 * Orden de los grupos según la investigación (docs/00-investigacion-referentes.md):
 * el talle va primero y abierto, porque es lo que más descarta prendas.
 */
export function FilterPanel({ filters, facets, categories }: { filters: ApparelFilters; facets: FacetOptions; categories: Category[] }) {
  return (
    <div className="filters">
      {facets.sizes.length > 0 ? (
        <fieldset className="filters__group">
          <legend>Talle</legend>
          <ul className="size-grid">
            {facets.sizes.map((s) => {
              const on = filters.sizes.includes(s);
              return (
                <li key={s}>
                  <Link
                    href={catalogHref(filters, { sizes: toggle(filters.sizes, s) })}
                    className={on ? "chip-toggle is-on" : "chip-toggle"}
                    aria-label={`Talle ${s}${on ? ", seleccionado" : ""}`}
                    scroll={false}
                    replace
                  >
                    {s}
                  </Link>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : null}

      <fieldset className="filters__group">
        <legend>Color</legend>
        <ul className="swatch-list">
          {facets.colors.map((c) => {
            const on = filters.colors.includes(c.family);
            return (
              <li key={c.family}>
                <Link
                  href={catalogHref(filters, { colors: toggle(filters.colors, c.family) })}
                  className={on ? "swatch-link is-on" : "swatch-link"}
                  aria-label={`${c.label}${on ? ", seleccionado" : ""}`}
                  scroll={false}
                  replace
                >
                  <span className="swatch-link__dot" style={{ background: c.swatch }} />
                  <span>{c.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="filters__group">
        <legend>Precio</legend>
        <ul className="option-list">
          {PRICE_RANGES.map((r) => {
            const on = filters.price === r.id;
            return (
              <li key={r.id}>
                <Link href={catalogHref(filters, { price: on ? null : r.id })} className={on ? "option-link is-on" : "option-link"} aria-label={`${r.label}${on ? ", seleccionado" : ""}`} scroll={false} replace>
                  {r.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href={catalogHref(filters, { onSale: !filters.onSale })} className={filters.onSale ? "option-link is-on" : "option-link"} aria-label={`Solo con descuento${filters.onSale ? ", seleccionado" : ""}`} scroll={false} replace>
              Solo con descuento
            </Link>
          </li>
        </ul>
      </fieldset>

      <fieldset className="filters__group">
        <legend>Categoría</legend>
        <ul className="option-list">
          <li>
            <Link href={catalogHref(filters, { category: null })} className={!filters.category ? "option-link is-on" : "option-link"}>
              Todas
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={catalogHref(filters, { category: c.slug })} className={filters.category === c.slug ? "option-link is-on" : "option-link"}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
