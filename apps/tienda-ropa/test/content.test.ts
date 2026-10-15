import { describe, expect, it } from "vitest";

/**
 * Valida los JSON de /content. Corre en CI y con `npm run validate:content`
 * después de editar productos o la configuración de la tienda.
 */
describe("contenido de la tienda", () => {
  it("site.json y products.json cumplen los schemas", async () => {
    const content = await import("../src/lib/content");
    expect(content.products.length).toBeGreaterThan(0);
    expect(content.site.categories.length).toBeGreaterThan(0);
  });

  it("cada categoría tiene al menos un producto", async () => {
    const { products, site } = await import("../src/lib/content");
    for (const c of site.categories) {
      expect(products.some((p) => p.category === c.slug), `categoría vacía: ${c.slug}`).toBe(true);
    }
  });
});
