/**
 * Valida content/*.json y verifica que existan las imágenes referenciadas.
 * Pensado para correr después de editar el contenido, antes de hacer build.
 *
 * Uso: npm run validate
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateContent } from "../src/lib/validate.ts";

const root = join(import.meta.dirname, "..");
const read = (file: string): unknown => JSON.parse(readFileSync(join(root, "content", file), "utf8"));

try {
  const content = validateContent({
    store: read("store.json"),
    hero: read("hero.json"),
    categories: read("categories.json"),
    products: read("products.json"),
  });

  const images = [
    ...content.heroSlides.map((s) => s.image.src),
    ...content.catalog.flatMap((c) => c.products.map((p) => p.image.src)),
  ];
  const missing = images.filter((src) => !existsSync(join(root, "public", src)));
  if (missing.length > 0) {
    throw new Error(`Faltan estas imágenes en public/:\n${missing.map((m) => `  - ${m}`).join("\n")}`);
  }

  const total = content.catalog.reduce((n, c) => n + c.products.length, 0);
  console.log(`Contenido OK: ${content.heroSlides.length} slides, ${content.catalog.length} categorías, ${total} productos visibles.`);
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
