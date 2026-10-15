import { SiteConfigSchema, type CurrencyConfig, type SiteConfig } from "@pw/core";
import { CatalogSchema, buildSkuIndex, type ApparelProduct } from "@pw/ropa";
import rawProducts from "../../content/products.json";
import rawSite from "../../content/site.json";

/**
 * Los JSON de /content son la fuente de datos del MVP (sin base de datos ni panel).
 * Se validan al cargar: si alguien edita mal un archivo, el build falla con un
 * mensaje que dice qué campo está mal, en vez de romper una página en producción.
 */
function parseOrThrow<T>(label: string, result: { success: true; data: T } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } }): T {
  if (result.success) return result.data;
  const details = result.error.issues.map((i) => `  - ${i.path.join(".") || "(raíz)"}: ${i.message}`).join("\n");
  throw new Error(`content/${label} tiene errores:\n${details}`);
}

export const site: SiteConfig = parseOrThrow("site.json", SiteConfigSchema.safeParse(rawSite));
export const products: ApparelProduct[] = parseOrThrow("products.json", CatalogSchema.safeParse(rawProducts));

const categorySlugs = new Set(site.categories.map((c) => c.slug));
for (const p of products) {
  if (!categorySlugs.has(p.category)) {
    throw new Error(`content/products.json: ${p.id} usa la categoría "${p.category}", que no está en site.json`);
  }
}

export const currency: CurrencyConfig = site.currency;
export const skuIndex = buildSkuIndex(products);

export function getProduct(slug: string): ApparelProduct | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return site.categories.find((c) => c.slug === slug);
}

export function relatedProducts(product: ApparelProduct, limit = 4): ApparelProduct[] {
  const same = products.filter((p) => p.category === product.category && p.id !== product.id);
  const others = products.filter((p) => p.category !== product.category && p.featured);
  return [...same, ...others].slice(0, limit);
}
