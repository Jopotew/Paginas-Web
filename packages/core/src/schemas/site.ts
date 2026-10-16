import { z } from "zod";
import { BrandingSchema } from "./branding";

export const ShippingOptionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().min(0),
  /** Si es true, el checkout pide dirección. */
  requiresAddress: z.boolean(),
});

export type ShippingOption = z.infer<typeof ShippingOptionSchema>;

export const CategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
});

export type Category = z.infer<typeof CategorySchema>;

export const SiteConfigSchema = z.object({
  vertical: z.string().min(1),
  siteUrl: z.url(),
  locale: z.string().min(2),
  currency: z.object({
    code: z.string().length(3),
    locale: z.string().min(2),
    fractionDigits: z.number().int().min(0).max(3),
  }),
  branding: BrandingSchema,
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(170),
  }),
  hero: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().startsWith("/"),
  }),
  announcement: z.string().optional(),
  categories: z.array(CategorySchema).min(1),
  shipping: z.object({
    options: z.array(ShippingOptionSchema).min(1),
    /** Subtotal desde el cual el envío a domicilio es gratis. null = nunca. */
    freeShippingThreshold: z.number().int().min(0).nullable(),
  }),
  returnsPolicy: z.string().min(1),
  contact: z.object({
    email: z.email(),
    /** Número en formato internacional sin "+" ni espacios, para wa.me. */
    whatsapp: z.string().regex(/^\d{8,15}$/).optional(),
    address: z.string().optional(),
    instagram: z.string().optional(),
  }),
  payment: z.object({
    provider: z.enum(["manual"]),
    /** Formas de pago que ve el cliente (inicio, checkout y ayuda). Solo informativas en el MVP. */
    methods: z
      .array(
        z.object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          label: z.string().min(1),
          description: z.string().min(1),
        }),
      )
      .min(1),
    /** Qué pasa después de confirmar el pedido. */
    instructions: z.string().min(1),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
