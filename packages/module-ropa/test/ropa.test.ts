import { describe, expect, it } from "vitest";
import {
  ApparelProductSchema,
  buildFacets,
  categoryForQuery,
  compareSizes,
  defaultColor,
  EMPTY_FILTERS,
  filterProducts,
  filtersToSearchParams,
  parseFilters,
  sizesForColor,
  type ApparelProduct,
} from "../src";

function product(overrides: Partial<ApparelProduct> & Pick<ApparelProduct, "id" | "variants">): ApparelProduct {
  return ApparelProductSchema.parse({
    slug: overrides.id,
    name: "Prenda",
    description: "Desc",
    category: "remeras",
    price: 20000,
    garment: "remera",
    fit: "Regular",
    material: "Algodón",
    care: ["Lavar"],
    sizeChart: "superior",
    createdAt: "2026-01-01",
    colors: [
      { id: "negro", name: "Negro", hex: "#222222", family: "negro" },
      { id: "azul", name: "Azul", hex: "#223355", family: "azul" },
    ],
    sizes: ["S", "M"],
    ...overrides,
  });
}

const v = (color: string, size: string, stock: number) => ({ sku: `X-${color}-${size}`.toUpperCase(), color, size, stock });

// p1: azul M agotado. p2: todo con stock.
const p1 = product({ id: "p1", variants: [v("negro", "S", 2), v("negro", "M", 1), v("azul", "S", 3), v("azul", "M", 0)] });
const p2 = product({ id: "p2", price: 80000, compareAtPrice: 90000, category: "camisas", variants: [v("negro", "S", 1), v("negro", "M", 1), v("azul", "S", 1), v("azul", "M", 1)] });

describe("schema", () => {
  it("exige todas las combinaciones color × talle", () => {
    const r = ApparelProductSchema.safeParse({ ...p1, variants: p1.variants.slice(0, 3) });
    expect(r.success).toBe(false);
  });
  it("rechaza variantes con colores que no existen", () => {
    const r = ApparelProductSchema.safeParse({ ...p1, variants: [...p1.variants, v("rojo", "S", 1)] });
    expect(r.success).toBe(false);
  });
});

describe("filtros", () => {
  it("talle y color se evalúan sobre la misma variante con stock", () => {
    const f = { ...EMPTY_FILTERS, sizes: ["M"], colors: ["azul" as const] };
    expect(filterProducts([p1, p2], f).map((p) => p.id)).toEqual(["p2"]);
  });
  it("filtra por categoría, precio y oferta", () => {
    expect(filterProducts([p1, p2], { ...EMPTY_FILTERS, category: "camisas" }).map((p) => p.id)).toEqual(["p2"]);
    expect(filterProducts([p1, p2], { ...EMPTY_FILTERS, price: "hasta-30000" }).map((p) => p.id)).toEqual(["p1"]);
    expect(filterProducts([p1, p2], { ...EMPTY_FILTERS, onSale: true }).map((p) => p.id)).toEqual(["p2"]);
  });
  it("ignora valores desconocidos en la URL", () => {
    const f = parseFilters({ color: "azul,fucsia", precio: "gratis", orden: "random", talle: ["S", "M"] });
    expect(f.colors).toEqual(["azul"]);
    expect(f.price).toBeNull();
    expect(f.sort).toBe("relevancia");
    expect(f.sizes).toEqual(["S", "M"]);
  });
  it("la URL ida y vuelta conserva los filtros", () => {
    const f = { ...EMPTY_FILTERS, sizes: ["M"], colors: ["azul" as const], price: "30000-60000", onSale: true, sort: "precio-asc" as const, q: "lino" };
    const sp = filtersToSearchParams(f);
    expect(parseFilters(Object.fromEntries(sp))).toEqual(f);
  });
});

describe("talles y disponibilidad", () => {
  it("ordena letras y números", () => {
    expect(["XL", "40", "S", "Único", "36", "M"].sort(compareSizes)).toEqual(["S", "M", "XL", "36", "40", "Único"]);
  });
  it("informa stock por talle del color elegido", () => {
    expect(sizesForColor(p1, "azul").map((s) => s.stock)).toEqual([3, 0]);
  });
  it("el color por defecto es el primero con stock", () => {
    const p = product({ id: "p3", variants: [v("negro", "S", 0), v("negro", "M", 0), v("azul", "S", 1), v("azul", "M", 0)] });
    expect(defaultColor(p).id).toBe("azul");
    expect(defaultColor(p, "negro").id).toBe("negro");
  });
  it("las facetas solo ofrecen talles con stock", () => {
    const p = product({ id: "p4", variants: [v("negro", "S", 0), v("negro", "M", 1), v("azul", "S", 0), v("azul", "M", 0)] });
    expect(buildFacets([p]).sizes).toEqual(["M"]);
  });
  it("una búsqueda que es una categoría lleva a la categoría", () => {
    const cats = [{ slug: "camperas", name: "Camperas" }, { slug: "buzos-y-sweaters", name: "Buzos y sweaters" }];
    expect(categoryForQuery("Campera", cats)).toBe("camperas");
    expect(categoryForQuery("buzos y sweaters", cats)).toBe("buzos-y-sweaters");
    expect(categoryForQuery("campera roja", cats)).toBeNull();
  });
});
