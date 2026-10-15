import { z } from "zod";
import { BaseItemSchema, ImageSchema, slugSchema } from "@pw/core";

export const GARMENTS = ["remera", "camisa", "buzo", "sweater", "campera", "pantalon", "vestido", "pollera"] as const;
export type Garment = (typeof GARMENTS)[number];

export const COLOR_FAMILIES = {
  negro: { label: "Negro", swatch: "#1F1F1F" },
  blanco: { label: "Blanco", swatch: "#F4F4F2" },
  gris: { label: "Gris", swatch: "#8D9196" },
  azul: { label: "Azul", swatch: "#2F4A6D" },
  verde: { label: "Verde", swatch: "#4E6B4A" },
  beige: { label: "Beige", swatch: "#CDBB9C" },
  marron: { label: "Marrón", swatch: "#6E4B34" },
  rojo: { label: "Rojo", swatch: "#9E2B25" },
  rosa: { label: "Rosa", swatch: "#D8A7A7" },
} as const;
export type ColorFamily = keyof typeof COLOR_FAMILIES;
const familyKeys = Object.keys(COLOR_FAMILIES) as [ColorFamily, ...ColorFamily[]];

/** Tabla de medidas que aplica a la prenda (ver sizeGuides.ts). */
export const SIZE_CHARTS = ["superior", "inferior", "vestido"] as const;

export const ColorSchema = z.object({
  id: slugSchema,
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  family: z.enum(familyKeys),
  /** Fotos de este color (relación 4:5, idealmente con modelo). Si está vacío se dibuja la ilustración. */
  images: z.array(ImageSchema).default([]),
});

export const VariantSchema = z.object({
  sku: z.string().regex(/^[A-Z0-9-]+$/, "SKU en mayúsculas, números y guiones"),
  color: slugSchema,
  size: z.string().min(1),
  stock: z.number().int().min(0),
});

export const ApparelProductSchema = BaseItemSchema.extend({
  garment: z.enum(GARMENTS),
  fit: z.string().min(1),
  material: z.string().min(1),
  care: z.array(z.string().min(1)).min(1),
  sizeChart: z.enum(SIZE_CHARTS),
  modelInfo: z.string().optional(),
  colors: z.array(ColorSchema).min(1),
  sizes: z.array(z.string().min(1)).min(1),
  variants: z.array(VariantSchema).min(1),
}).superRefine((p, ctx) => {
  const colorIds = new Set(p.colors.map((c) => c.id));
  const sizes = new Set(p.sizes);
  if (colorIds.size !== p.colors.length) {
    ctx.addIssue({ code: "custom", path: ["colors"], message: `${p.id}: hay colores con id repetido` });
  }
  const seen = new Set<string>();
  for (const [i, v] of p.variants.entries()) {
    if (!colorIds.has(v.color)) {
      ctx.addIssue({ code: "custom", path: ["variants", i, "color"], message: `${v.sku}: el color "${v.color}" no está en colors` });
    }
    if (!sizes.has(v.size)) {
      ctx.addIssue({ code: "custom", path: ["variants", i, "size"], message: `${v.sku}: el talle "${v.size}" no está en sizes` });
    }
    const combo = `${v.color}|${v.size}`;
    if (seen.has(combo)) {
      ctx.addIssue({ code: "custom", path: ["variants", i], message: `${v.sku}: combinación color/talle repetida` });
    }
    seen.add(combo);
  }
  for (const c of p.colors) {
    for (const s of p.sizes) {
      if (!seen.has(`${c.id}|${s}`)) {
        ctx.addIssue({ code: "custom", path: ["variants"], message: `${p.id}: falta la variante ${c.id} / ${s} (usá stock 0 si no hay)` });
      }
    }
  }
});

export type ApparelColor = z.infer<typeof ColorSchema>;
export type ApparelVariant = z.infer<typeof VariantSchema>;
export type ApparelProduct = z.infer<typeof ApparelProductSchema>;

/** Valida el catálogo completo, incluyendo unicidad global de id, slug y SKU. */
export const CatalogSchema = z.array(ApparelProductSchema).superRefine((products, ctx) => {
  const check = (values: string[], label: string) => {
    const seen = new Set<string>();
    for (const v of values) {
      if (seen.has(v)) ctx.addIssue({ code: "custom", message: `${label} repetido en el catálogo: ${v}` });
      seen.add(v);
    }
  };
  check(products.map((p) => p.id), "id");
  check(products.map((p) => p.slug), "slug");
  check(products.flatMap((p) => p.variants.map((v) => v.sku)), "SKU");
});
