import { z } from "zod";
// Extensión .ts explícita: este módulo también lo ejecuta Node directo (scripts/validate-content.ts).
import {
  CategorySchema,
  HeroSlideSchema,
  ProductSchema,
  StoreSchema,
  type Category,
  type HeroSlide,
  type Product,
  type Store,
} from "./schema.ts";

export type RawContent = { store: unknown; hero: unknown; categories: unknown; products: unknown };

export type CategoryWithProducts = Category & { products: Product[] };

export type Content = {
  store: Store;
  heroSlides: HeroSlide[];
  /** Categorías ordenadas con sus productos disponibles. Las vacías se omiten. */
  catalog: CategoryWithProducts[];
};

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`content/${file} no es válido:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function validateContent(raw: RawContent): Content {
  const store = parse(StoreSchema, raw.store, "store.json");
  const heroSlides = parse(z.array(HeroSlideSchema).min(1), raw.hero, "hero.json");
  const categories = parse(z.array(CategorySchema).min(1), raw.categories, "categories.json");
  const products = parse(z.array(ProductSchema), raw.products, "products.json");

  const catIds = new Set(categories.map((c) => c.id));
  const seen = new Set<string>();
  for (const p of products) {
    if (!catIds.has(p.categoryId)) {
      throw new Error(`content/products.json: "${p.id}" apunta a la categoría "${p.categoryId}", que no existe`);
    }
    if (seen.has(p.id)) throw new Error(`content/products.json: el id "${p.id}" está repetido`);
    seen.add(p.id);
  }

  const catalog = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ ...c, products: products.filter((p) => p.categoryId === c.id && p.available) }))
    .filter((c) => c.products.length > 0);

  return { store, heroSlides, catalog };
}
