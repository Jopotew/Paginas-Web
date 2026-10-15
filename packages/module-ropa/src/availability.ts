import type { SkuInfo } from "@pw/core";
import type { ApparelColor, ApparelProduct } from "./schemas";

/** Por debajo de este stock se avisa "quedan pocas". */
export const LOW_STOCK_THRESHOLD = 3;

export function findVariant(product: ApparelProduct, colorId: string, size: string) {
  return product.variants.find((v) => v.color === colorId && v.size === size);
}

export function sizesForColor(product: ApparelProduct, colorId: string): { size: string; stock: number; sku: string | null }[] {
  return product.sizes.map((size) => {
    const v = findVariant(product, colorId, size);
    return { size, stock: v?.stock ?? 0, sku: v?.sku ?? null };
  });
}

export function colorStock(product: ApparelProduct, colorId: string): number {
  return product.variants.filter((v) => v.color === colorId).reduce((n, v) => n + v.stock, 0);
}

export function totalStock(product: ApparelProduct): number {
  return product.variants.reduce((n, v) => n + v.stock, 0);
}

export function isSoldOut(product: ApparelProduct): boolean {
  return totalStock(product) === 0;
}

/** Color a mostrar por defecto: el pedido si existe, si no el primero con stock, si no el primero. */
export function defaultColor(product: ApparelProduct, preferred?: string | null): ApparelColor {
  const first = product.colors[0]!;
  if (preferred) {
    const match = product.colors.find((c) => c.id === preferred);
    if (match) return match;
  }
  return product.colors.find((c) => colorStock(product, c.id) > 0) ?? first;
}

export function variantLabel(color: ApparelColor, size: string): string {
  return `${color.name}, talle ${size}`;
}

/** Índice SKU → info de catálogo, usado por el checkout para no confiar en precios del cliente. */
export function buildSkuIndex(products: readonly ApparelProduct[]): Map<string, SkuInfo> {
  const index = new Map<string, SkuInfo>();
  for (const p of products) {
    for (const v of p.variants) {
      const color = p.colors.find((c) => c.id === v.color);
      if (!color) continue;
      index.set(v.sku, {
        sku: v.sku,
        itemId: p.id,
        slug: p.slug,
        name: p.name,
        variantLabel: variantLabel(color, v.size),
        unitPrice: p.price,
        stock: v.stock,
      });
    }
  }
  return index;
}
