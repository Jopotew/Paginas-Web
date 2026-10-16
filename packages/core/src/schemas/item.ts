import { z } from "zod";

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido: minúsculas, números y guiones");

export const ImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export type Image = z.infer<typeof ImageSchema>;

/**
 * Contrato mínimo que todo ítem vendible cumple, sea una prenda, un plato o un juego.
 * Los módulos de vertical extienden este schema; el core solo depende de estos campos.
 */
export const BaseItemSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  category: slugSchema,
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().nullable().default(null),
  tags: z.array(z.string()).default([]),
  /** Fecha ISO de alta; ordena "Novedades". */
  createdAt: z.iso.date(),
  featured: z.boolean().default(false),
  /**
   * Unidades vendidas; ordena "Lo más vendido". En el MVP se carga a mano;
   * cuando haya pedidos persistidos se calcula desde ellos (docs/06-roadmap.md).
   */
  unitsSold: z.number().int().min(0).default(0),
});

export type BaseItem = z.infer<typeof BaseItemSchema>;
