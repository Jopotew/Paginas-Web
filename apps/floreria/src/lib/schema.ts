import { z } from "zod";

/**
 * Contrato de datos del sitio. Todo el contenido vive en /content/*.json y se
 * valida acá en tiempo de build: si un JSON está mal, el build falla con un
 * mensaje que dice qué campo corregir, en vez de publicar una página rota.
 */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá minúsculas, números y guiones (ej: rosas-rojas)");

export const ImageSchema = z.object({
  src: z.string().startsWith("/", "La ruta debe empezar con / (relativa a /public)"),
  alt: z.string().min(3, "Describí la imagen para lectores de pantalla"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const StoreSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Número en formato internacional sin "+", espacios ni guiones: 5491112345678 */
  whatsapp: z.string().regex(/^\d{10,15}$/, "Formato: código de país + área + número, solo dígitos"),
  instagram: z.string().optional(),
  address: z.string().min(1),
  mapsUrl: z.url().optional(),
  hours: z.array(z.object({ days: z.string(), time: z.string() })).min(1),
  deliveryNote: z.string().min(1),
  currency: z.literal("ARS"),
});

export const HeroSlideSchema = z.object({
  id: slug,
  title: z.string().min(1),
  text: z.string().optional(),
  image: ImageSchema,
  /** Ancla o ruta a la que lleva el botón del slide (ej: #rosas). */
  cta: z.object({ label: z.string(), href: z.string() }).optional(),
});

export const CategorySchema = z.object({
  id: slug,
  name: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int(),
});

export const ProductSchema = z.object({
  id: slug,
  name: z.string().min(1),
  categoryId: slug,
  /** Precio en pesos, sin decimales. */
  price: z.number().int().positive(),
  description: z.string().min(1),
  image: ImageSchema,
  available: z.boolean().default(true),
});

export type Image = z.infer<typeof ImageSchema>;
export type Store = z.infer<typeof StoreSchema>;
export type HeroSlide = z.infer<typeof HeroSlideSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
