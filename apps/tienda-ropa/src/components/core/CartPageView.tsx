"use client";

import Link from "next/link";
import { formatMoney, type CurrencyConfig } from "@pw/core";
import { CartLines } from "./CartLines";
import { useCart } from "./CartProvider";
import { FreeShippingNote } from "./FreeShippingNote";

export function CartPageView({ currency, freeShippingThreshold }: { currency: CurrencyConfig; freeShippingThreshold: number | null }) {
  const { state, ready, subtotal } = useCart();
  if (!ready) return <p className="muted">Cargando tu bolsa…</p>;
  if (state.lines.length === 0) {
    return (
      <div className="empty">
        <h2>Tu bolsa está vacía</h2>
        <p>Cuando agregues prendas, las vas a ver acá.</p>
        <div className="empty__actions">
          <Link href="/tienda" className="button button--primary">
            Ver la colección
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="cart-page">
      <div>
        <FreeShippingNote subtotal={subtotal} threshold={freeShippingThreshold} currency={currency} />
        <CartLines currency={currency} />
      </div>
      <aside className="summary" aria-label="Resumen">
        <p className="summary-row summary-row--strong">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </p>
        <p className="muted small">El envío se calcula en el siguiente paso.</p>
        <Link href="/checkout" className="button button--primary button--block">
          Finalizar compra
        </Link>
        <Link href="/tienda" className="button button--ghost button--block">
          Seguir comprando
        </Link>
      </aside>
    </div>
  );
}
