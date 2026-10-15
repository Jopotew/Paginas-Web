"use client";

import { useCart } from "./CartProvider";

export function CartButton() {
  const { count, ready, openDrawer } = useCart();
  return (
    <button type="button" className="cart-button" onClick={openDrawer} aria-label={ready ? `Abrir la bolsa, ${count} ${count === 1 ? "prenda" : "prendas"}` : "Abrir la bolsa"}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14l-1.2 12H6.2L5 8z" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      </svg>
      <span className="cart-button__label">Bolsa</span>
      {ready && count > 0 ? <span className="cart-button__count">{count}</span> : null}
    </button>
  );
}
