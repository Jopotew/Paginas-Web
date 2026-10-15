import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { searchItems, sortItems } from "@pw/core";
import { activeFilterCount, buildFacets, COLOR_FAMILIES, EMPTY_FILTERS, filterProducts, parseFilters, PRICE_RANGES } from "@pw/ropa";
import { SortSelect } from "@/components/core/SortSelect";
import { FilterPanel } from "@/components/ropa/FilterPanel";
import { FilterToggle } from "@/components/ropa/FilterToggle";
import { catalogHref, toggle } from "@/components/ropa/filterLinks";
import { ProductGrid } from "@/components/ropa/ProductCard";
import { currency, getCategory, products, site } from "@/lib/content";

type Props = {
  params: Promise<{ categoria?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return [{ categoria: [] }, ...site.categories.map((c) => ({ categoria: [c.slug] }))];
}

async function resolveCategory(params: Props["params"]) {
  const { categoria } = await params;
  if (!categoria || categoria.length === 0) return null;
  if (categoria.length > 1) notFound();
  const category = getCategory(categoria[0]!);
  if (!category) notFound();
  return category;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await resolveCategory(params);
  if (!category) return { title: "Toda la colección", alternates: { canonical: "/tienda" } };
  return { title: category.name, description: category.description, alternates: { canonical: `/tienda/${category.slug}` } };
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const category = await resolveCategory(params);
  const filters = parseFilters(await searchParams, category?.slug ?? null);

  // Las facetas se calculan sobre el alcance (categoría + búsqueda), no sobre los filtros ya aplicados.
  const scope = products.filter((p) => !filters.category || p.category === filters.category);
  const facets = buildFacets(filters.q ? searchItems(scope, filters.q) : scope);
  const results = sortItems(filterProducts(products, filters), filters.sort);
  const active = activeFilterCount(filters);

  const title = filters.q ? `Resultados para “${filters.q}”` : (category?.name ?? "Toda la colección");

  return (
    <div className="container catalog">
      <nav aria-label="Ruta" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          {category ? (
            <li>
              <Link href="/tienda">Tienda</Link>
            </li>
          ) : null}
          <li aria-current="page">{category?.name ?? "Tienda"}</li>
        </ol>
      </nav>

      <header className="catalog__head">
        <h1 className="page-title">{title}</h1>
        <p className="muted" aria-live="polite">
          {results.length} {results.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      <div className="catalog__layout">
        <aside aria-label="Filtros" className="catalog__aside">
          <FilterToggle activeCount={active}>
            <FilterPanel filters={filters} facets={facets} categories={site.categories} />
          </FilterToggle>
        </aside>

        <section className="catalog__results" aria-label="Productos">
          <div className="catalog__toolbar">
            {active > 0 || filters.q ? (
              <ul className="active-filters" aria-label="Filtros aplicados">
                {filters.q ? (
                  <li>
                    <Link href={catalogHref(filters, { q: "" })} className="active-chip" aria-label={`Quitar búsqueda ${filters.q}`}>
                      “{filters.q}” <span aria-hidden="true">×</span>
                    </Link>
                  </li>
                ) : null}
                {filters.sizes.map((s) => (
                  <li key={s}>
                    <Link href={catalogHref(filters, { sizes: toggle(filters.sizes, s) })} className="active-chip" aria-label={`Quitar talle ${s}`} scroll={false}>
                      Talle {s} <span aria-hidden="true">×</span>
                    </Link>
                  </li>
                ))}
                {filters.colors.map((c) => (
                  <li key={c}>
                    <Link href={catalogHref(filters, { colors: toggle(filters.colors, c) })} className="active-chip" aria-label={`Quitar color ${COLOR_FAMILIES[c].label}`} scroll={false}>
                      {COLOR_FAMILIES[c].label} <span aria-hidden="true">×</span>
                    </Link>
                  </li>
                ))}
                {filters.price ? (
                  <li>
                    <Link href={catalogHref(filters, { price: null })} className="active-chip" aria-label="Quitar filtro de precio" scroll={false}>
                      {PRICE_RANGES.find((r) => r.id === filters.price)?.label} <span aria-hidden="true">×</span>
                    </Link>
                  </li>
                ) : null}
                {filters.onSale ? (
                  <li>
                    <Link href={catalogHref(filters, { onSale: false })} className="active-chip" aria-label="Quitar filtro de descuento" scroll={false}>
                      Con descuento <span aria-hidden="true">×</span>
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link href={catalogHref({ ...EMPTY_FILTERS, category: filters.category, sort: filters.sort })} className="text-link" scroll={false}>
                    Borrar filtros
                  </Link>
                </li>
              </ul>
            ) : (
              <span />
            )}
            <Suspense fallback={null}>
              <SortSelect value={filters.sort} />
            </Suspense>
          </div>

          {results.length > 0 ? (
            <ProductGrid products={results} currency={currency} preferFamilies={filters.colors} />
          ) : (
            <div className="empty">
              <h2>No hay productos con esos filtros</h2>
              <p>Probá quitar algún talle o color, o mirá toda la colección.</p>
              <div className="empty__actions">
                <Link href={catalogHref({ ...EMPTY_FILTERS, category: filters.category })} className="button button--primary">
                  Borrar filtros
                </Link>
                <Link href="/tienda" className="button button--ghost">
                  Ver toda la colección
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
