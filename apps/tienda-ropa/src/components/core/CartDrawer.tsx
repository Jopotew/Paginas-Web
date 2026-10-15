"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatMoney, type CurrencyConfig } from "@pw/core";
import { useCart } from "./CartProvider";
import { CartLines } from "./CartLines";
import { FreeShippingNote } from "./FreeShippingNote";

/** Panel lateral con <dialog> nativo: foco atrapado, Escape para cerrar y fondo inerte sin librerías. */
export function CartDrawer({ currency, freeShippingThreshold }: { currency: CurrencyConfig; freeShippingThreshold: number | null }) {
  const { state, count, subtotal, drawerOpen, closeDrawer } = useCart();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (drawerOpen && !dialog.open) dialog.showModal();
    if (!drawerOpen && dialog.open) dialog.close();
  }, [drawerOpen]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="drawer-title"
      onClose={closeDrawer}
      onClick={(e) => {
        if (e.target === ref.current) closeDrawer();
      }}
    >
      <div className="drawer__panel">
        <header className="drawer__head">
          <h2 id="drawer-title">Tu bolsa {count > 0 ? <span className="muted">({count})</span> : null}</h2>
          <button type="button" className="icon-button" onClick={closeDrawer} aria-label="Cerrar la bolsa">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>
        {state.lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Tu bolsa está vacía.</p>
            <Link href="/tienda" className="button button--secondary" onClick={closeDrawer}>
              Ver la colección
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <FreeShippingNote subtotal={subtotal} threshold={freeShippingThreshold} currency={currency} />
              <CartLines currency={currency} onNavigate={closeDrawer} />
            </div>
            <footer className="drawer__foot">
              <p className="summary-row summary-row--strong">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal, currency)}</span>
              </p>
              <p className="muted small">El envío se calcula en el siguiente paso.</p>
              <Link href="/checkout" className="button button--primary button--block" onClick={closeDrawer}>
                Finalizar compra
              </Link>
              <Link href="/carrito" className="button button--ghost button--block" onClick={closeDrawer}>
                Ver la bolsa completa
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
