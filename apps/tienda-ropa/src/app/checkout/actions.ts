"use server";

import { buildOrder, createManualProvider, type CheckoutResult, type PaymentStart } from "@pw/core";
import { site, skuIndex } from "@/lib/content";

export type PlaceOrderResult = Exclude<CheckoutResult, { ok: true }> | (Extract<CheckoutResult, { ok: true }> & { payment: PaymentStart });

const paymentProvider = createManualProvider(site.payment.instructions);

/**
 * Las server actions son endpoints públicos: todo lo que llega se valida con Zod
 * y los precios se toman del catálogo, nunca del navegador.
 *
 * MVP: el pedido no se persiste en el servidor (no hay base de datos). Se
 * registra en el log y el cliente lo confirma por WhatsApp/email. Ver
 * docs/06-roadmap.md, fase 1, para persistencia y Mercado Pago.
 */
export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const result = buildOrder(input, {
    resolveSku: (sku) => skuIndex.get(sku) ?? null,
    shippingOptions: site.shipping.options,
    freeShippingThreshold: site.shipping.freeShippingThreshold,
  });
  if (!result.ok) return result;

  const payment = await paymentProvider.start(result.order);
  console.info(`[pedido] ${result.order.id} ${result.order.total} ${result.order.lines.length} líneas`);
  return { ...result, payment };
}
