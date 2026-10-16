import { formatMoney, type CurrencyConfig } from "../money";
import type { Order } from "../checkout/checkout";

/**
 * Punto de extensión para cobrar. El MVP solo trae `manual`: la tienda manda a
 * mano el link de Mercado Pago o el cliente paga en efectivo al retirar. La
 * integración con la API de Mercado Pago se agrega como otra implementación de
 * esta interfaz sin tocar el checkout (docs/06-roadmap.md).
 */
export interface PaymentProvider {
  id: string;
  /** Qué hacer después de confirmar el pedido. */
  start(order: Order): Promise<PaymentStart>;
}

export type PaymentStart =
  | { kind: "instructions"; message: string }
  | { kind: "redirect"; url: string };

export function createManualProvider(instructions: string): PaymentProvider {
  return {
    id: "manual",
    async start() {
      return { kind: "instructions", message: instructions };
    },
  };
}

/** Texto del pedido listo para mandar por WhatsApp o email. */
export function orderSummaryText(order: Order, storeName: string, currency: CurrencyConfig): string {
  const fmt = (n: number) => formatMoney(n, currency);
  const lines = order.lines.map((l) => `• ${l.quantity} × ${l.name} (${l.variantLabel}) — ${fmt(l.lineTotal)}`);
  const address = order.shipping.address
    ? `${order.shipping.address.street}${order.shipping.address.apartment ? ` ${order.shipping.address.apartment}` : ""}, ${order.shipping.address.city}, ${order.shipping.address.province} (${order.shipping.address.postalCode})`
    : null;
  return [
    `Hola ${storeName}, hice el pedido ${order.id}.`,
    "",
    ...lines,
    "",
    `Subtotal: ${fmt(order.subtotal)}`,
    `${order.shipping.label}: ${order.shipping.cost === 0 ? "sin cargo" : fmt(order.shipping.cost)}`,
    `Total: ${fmt(order.total)}`,
    "",
    `A nombre de ${order.customer.fullName}, ${order.customer.phone}.`,
    ...(address ? [`Entregar en ${address}.`] : []),
    ...(order.notes ? [`Nota: ${order.notes}`] : []),
  ].join("\n");
}

export function whatsappLink(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
