"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cartTotal, MAX_QTY } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, whatsappUrl, type OrderDetails } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";
import styles from "./cart.module.css";

const emptyDetails: OrderDetails = { name: "", delivery: "envio", address: "", date: "", cardMessage: "" };

export function CartDialog({ whatsapp, deliveryNote }: { whatsapp: string; deliveryNote: string }) {
  const { state, dispatch, isOpen, close } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [sent, setSent] = useState(false);

  // <dialog> nativo: trae foco atrapado, Escape y fondo inerte sin código extra.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const set = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) =>
    setDetails((d) => ({ ...d, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = buildOrderMessage(state, details);
    window.open(whatsappUrl(whatsapp, text), "_blank", "noopener");
    setSent(true);
  };

  const empty = state.lines.length === 0;
  // Fecha local en formato YYYY-MM-DD (toISOString usaría UTC y de noche daría "mañana").
  const today = new Date().toLocaleDateString("sv-SE");

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="cart-title"
      onClose={() => {
        close();
        setSent(false);
      }}
      onClick={(e) => {
        // Click en el fondo (fuera del panel) cierra.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 id="cart-title">Tu pedido</h2>
          <button type="button" className={styles.close} onClick={close} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {empty ? (
          <div className={styles.empty}>
            <p>Todavía no agregaste flores.</p>
            <button type="button" className={styles.secondary} onClick={close}>
              Ver el catálogo
            </button>
          </div>
        ) : sent ? (
          <div className={styles.empty}>
            <p>
              Abrimos WhatsApp con tu pedido. Cuando lo envíes, te confirmamos disponibilidad, costo de envío y forma de pago.
            </p>
            <div className={styles.row}>
              <button type="button" className={styles.secondary} onClick={() => setSent(false)}>
                Volver al pedido
              </button>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => {
                  dispatch({ type: "clear" });
                  setDetails(emptyDetails);
                  close();
                }}
              >
                Empezar un pedido nuevo
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit}>
            <ul className={styles.lines}>
              {state.lines.map((l) => (
                <li key={l.id} className={styles.line}>
                  <Image src={l.image} alt="" width={64} height={80} className={styles.thumb} />
                  <div className={styles.lineInfo}>
                    <span className={styles.lineName}>{l.name}</span>
                    <span className={styles.linePrice}>{formatPrice(l.price * l.qty)}</span>
                  </div>
                  <div className={styles.qty} role="group" aria-label={`Cantidad de ${l.name}`}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "setQty", id: l.id, qty: l.qty - 1 })}
                      aria-label={l.qty === 1 ? `Quitar ${l.name}` : "Uno menos"}
                    >
                      −
                    </button>
                    <span aria-live="polite">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "setQty", id: l.id, qty: l.qty + 1 })}
                      disabled={l.qty >= MAX_QTY}
                      aria-label="Uno más"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <p className={styles.total}>
              <span>Total productos</span>
              <strong>{formatPrice(cartTotal(state))}</strong>
            </p>

            <fieldset className={styles.fields}>
              <legend>Datos para el pedido</legend>
              <label>
                Tu nombre
                <input required autoComplete="name" value={details.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <div className={styles.radios} role="radiogroup" aria-label="Entrega">
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    checked={details.delivery === "envio"}
                    onChange={() => set("delivery", "envio")}
                  />
                  Envío a domicilio
                </label>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    checked={details.delivery === "retiro"}
                    onChange={() => set("delivery", "retiro")}
                  />
                  Retiro en el local
                </label>
              </div>
              {details.delivery === "envio" && (
                <label>
                  Dirección de entrega
                  <input
                    required
                    autoComplete="street-address"
                    value={details.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </label>
              )}
              <label>
                <span>
                  Para qué día <span className={styles.optional}>(opcional)</span>
                </span>
                <input type="date" min={today} value={details.date} onChange={(e) => set("date", e.target.value)} />
              </label>
              <label>
                <span>
                  Mensaje para la tarjeta <span className={styles.optional}>(opcional)</span>
                </span>
                <textarea
                  rows={2}
                  maxLength={240}
                  value={details.cardMessage}
                  onChange={(e) => set("cardMessage", e.target.value)}
                />
              </label>
            </fieldset>

            <p className={styles.note}>{deliveryNote}</p>

            <button type="submit" className={styles.primary}>
              Enviar pedido por WhatsApp
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
