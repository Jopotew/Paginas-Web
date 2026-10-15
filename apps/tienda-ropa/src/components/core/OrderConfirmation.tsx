"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney, orderSummaryText, whatsappLink, type CurrencyConfig, type Order } from "@pw/core";
import { loadOrder } from "@/lib/orders";

interface Props {
  id: string;
  currency: CurrencyConfig;
  storeName: string;
  whatsapp: string | null;
  email: string;
  paymentInstructions: string;
}

export function OrderConfirmation({ id, currency, storeName, whatsapp, email, paymentInstructions }: Props) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => setOrder(loadOrder(id)), [id]);

  if (order === undefined) return <p className="muted">Buscando tu pedido…</p>;
  if (order === null) {
    return (
      <div className="empty">
        <h1 className="page-title">No encontramos el pedido {id} en este dispositivo</h1>
        <p>
          Si lo hiciste desde otro navegador, escribinos a <a href={`mailto:${email}`}>{email}</a> con el número de pedido y te ayudamos.
        </p>
        <div className="empty__actions">
          <Link href="/tienda" className="button button--primary">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const text = orderSummaryText(order, storeName, currency);
  const fmt = (n: number) => formatMoney(n, currency);

  return (
    <div className="confirmation">
      <p className="confirmation__check" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </p>
      <h1 className="page-title">Recibimos tu pedido</h1>
      <p className="confirmation__id">
        Número de pedido <strong>{order.id}</strong>
      </p>
      <p>{paymentInstructions}</p>

      {whatsapp ? (
        <a className="button button--primary" href={whatsappLink(whatsapp, text)} target="_blank" rel="noopener">
          Enviar el pedido por WhatsApp
        </a>
      ) : null}

      <section className="summary confirmation__summary" aria-labelledby="detalle">
        <h2 id="detalle" className="summary__title">
          Detalle
        </h2>
        <ul className="summary__lines">
          {order.lines.map((l) => (
            <li key={l.sku}>
              <span>
                {l.quantity} × {l.name}
                <span className="muted small block">{l.variantLabel}</span>
              </span>
              <span>{fmt(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="summary-row">
          <span>Subtotal</span>
          <span>{fmt(order.subtotal)}</span>
        </p>
        <p className="summary-row">
          <span>{order.shipping.label}</span>
          <span>{order.shipping.cost === 0 ? "Sin cargo" : fmt(order.shipping.cost)}</span>
        </p>
        <p className="summary-row summary-row--strong">
          <span>Total</span>
          <span>{fmt(order.total)}</span>
        </p>
        {order.shipping.address ? (
          <p className="muted small">
            Entrega en {order.shipping.address.street}
            {order.shipping.address.apartment ? ` ${order.shipping.address.apartment}` : ""}, {order.shipping.address.city}, {order.shipping.address.province}.
          </p>
        ) : null}
        <p className="muted small">
          Te escribimos a {order.customer.email} o al {order.customer.phone}.
        </p>
      </section>

      <Link href="/tienda" className="text-link">
        Seguir comprando
      </Link>
    </div>
  );
}
