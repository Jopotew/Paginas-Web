import { z } from "zod";
import type { Money } from "../money";
import type { ShippingOption } from "../schemas/site";

export const CustomerSchema = z.object({
  fullName: z.string().trim().min(3, "Ingresá tu nombre y apellido"),
  email: z.email("Revisá el email: falta la @ o el dominio"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{8,20}$/, "Ingresá un teléfono con código de área, por ejemplo 11 5555 5555"),
});

export const AddressSchema = z.object({
  street: z.string().trim().min(3, "Ingresá calle y número"),
  apartment: z.string().trim().max(40).optional().default(""),
  city: z.string().trim().min(2, "Ingresá la localidad"),
  province: z.string().trim().min(2, "Elegí la provincia"),
  postalCode: z.string().trim().regex(/^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/, "El código postal tiene 4 dígitos o el formato C1425ABC"),
});

export const CheckoutRequestSchema = z.object({
  customer: CustomerSchema,
  shippingOptionId: z.string().min(1, "Elegí cómo recibir el pedido"),
  address: AddressSchema.nullable(),
  notes: z.string().trim().max(500).optional().default(""),
  lines: z
    .array(z.object({ sku: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
    .min(1, "El carrito está vacío"),
});

export type CheckoutRequest = z.input<typeof CheckoutRequestSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Address = z.infer<typeof AddressSchema>;

/** Lo que el catálogo sabe de un SKU. El checkout nunca confía en precios que vengan del cliente. */
export interface SkuInfo {
  sku: string;
  itemId: string;
  slug: string;
  name: string;
  variantLabel: string;
  unitPrice: Money;
  stock: number;
}

export interface OrderLine {
  sku: string;
  itemId: string;
  slug: string;
  name: string;
  variantLabel: string;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
}

export type OrderStatus = "pendiente-de-pago";

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: Customer;
  shipping: { optionId: string; label: string; cost: Money; address: Address | null };
  notes: string;
  lines: OrderLine[];
  subtotal: Money;
  total: Money;
}

export type CheckoutResult =
  | { ok: true; order: Order }
  | { ok: false; fieldErrors: Record<string, string>; formError: string | null };

export interface CheckoutContext {
  resolveSku: (sku: string) => SkuInfo | null;
  shippingOptions: readonly ShippingOption[];
  freeShippingThreshold: Money | null;
  now?: () => Date;
  makeId?: () => string;
}

export function shippingCost(option: ShippingOption, subtotal: Money, freeThreshold: Money | null): Money {
  if (option.price === 0) return 0;
  if (freeThreshold !== null && subtotal >= freeThreshold) return 0;
  return option.price;
}

/** ID corto y legible para dictar por teléfono: sin 0/O ni 1/I. */
export function makeOrderId(random: () => number = Math.random): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < 6; i++) id += alphabet[Math.floor(random() * alphabet.length)];
  return id;
}

function flattenIssues(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/**
 * Valida el pedido, recalcula precios desde el catálogo y verifica stock.
 * Es pura: la persistencia y el cobro quedan afuera (ver payments/).
 */
export function buildOrder(input: unknown, ctx: CheckoutContext): CheckoutResult {
  const parsed = CheckoutRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: flattenIssues(parsed.error), formError: null };
  }
  const req = parsed.data;

  const option = ctx.shippingOptions.find((o) => o.id === req.shippingOptionId);
  if (!option) {
    return { ok: false, fieldErrors: { shippingOptionId: "Elegí cómo recibir el pedido" }, formError: null };
  }
  if (option.requiresAddress && !req.address) {
    return { ok: false, fieldErrors: { "address.street": "Ingresá la dirección de entrega" }, formError: null };
  }

  const merged = new Map<string, number>();
  for (const l of req.lines) merged.set(l.sku, (merged.get(l.sku) ?? 0) + l.quantity);

  const lines: OrderLine[] = [];
  const problems: string[] = [];
  for (const [sku, quantity] of merged) {
    const info = ctx.resolveSku(sku);
    if (!info) {
      problems.push(`Un producto del carrito ya no está disponible (${sku}). Quitalo para continuar.`);
      continue;
    }
    if (info.stock < quantity) {
      problems.push(
        info.stock === 0
          ? `${info.name} (${info.variantLabel}) se agotó. Quitalo del carrito para continuar.`
          : `De ${info.name} (${info.variantLabel}) quedan ${info.stock}. Bajá la cantidad para continuar.`,
      );
      continue;
    }
    lines.push({
      sku,
      itemId: info.itemId,
      slug: info.slug,
      name: info.name,
      variantLabel: info.variantLabel,
      unitPrice: info.unitPrice,
      quantity,
      lineTotal: info.unitPrice * quantity,
    });
  }
  if (problems.length > 0) {
    return { ok: false, fieldErrors: {}, formError: problems.join(" ") };
  }

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const cost = shippingCost(option, subtotal, ctx.freeShippingThreshold);
  const now = (ctx.now ?? (() => new Date()))();

  return {
    ok: true,
    order: {
      id: (ctx.makeId ?? makeOrderId)(),
      createdAt: now.toISOString(),
      status: "pendiente-de-pago",
      customer: req.customer,
      shipping: {
        optionId: option.id,
        label: option.label,
        cost,
        address: option.requiresAddress ? req.address : null,
      },
      notes: req.notes,
      lines,
      subtotal,
      total: subtotal + cost,
    },
  };
}
