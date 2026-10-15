"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent, type InputHTMLAttributes } from "react";
import { formatMoney, shippingCost, type CurrencyConfig, type ShippingOption } from "@pw/core";
import type { PlaceOrderResult } from "@/app/checkout/actions";
import { saveOrder } from "@/lib/orders";
import { useCart } from "./CartProvider";

const PROVINCES = [
  "Ciudad de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
  "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe",
  "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

interface Props {
  currency: CurrencyConfig;
  shippingOptions: ShippingOption[];
  freeShippingThreshold: number | null;
  paymentInstructions: string;
  placeOrder: (input: unknown) => Promise<PlaceOrderResult>;
}

/**
 * Compra como invitado en una sola página: sin cuenta obligatoria, que es una
 * de las causas más citadas de abandono (docs/00-investigacion-referentes.md).
 */
export function CheckoutForm({ currency, shippingOptions, freeShippingThreshold, paymentInstructions, placeOrder }: Props) {
  const router = useRouter();
  const { state, ready, subtotal, dispatch } = useCart();
  const [optionId, setOptionId] = useState<string>(shippingOptions[0]!.id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const option = shippingOptions.find((o) => o.id === optionId) ?? shippingOptions[0]!;
  const shipping = shippingCost(option, subtotal, freeShippingThreshold);

  if (!ready) return <p className="muted">Cargando tu bolsa…</p>;
  if (state.lines.length === 0) {
    return (
      <div className="empty">
        <h2>No hay nada para comprar todavía</h2>
        <p>Agregá prendas a la bolsa y volvé acá para terminar la compra.</p>
        <div className="empty__actions">
          <Link href="/tienda" className="button button--primary">
            Ver la colección
          </Link>
        </div>
      </div>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "");
    const input = {
      customer: { fullName: get("fullName"), email: get("email"), phone: get("phone") },
      shippingOptionId: optionId,
      address: option.requiresAddress
        ? { street: get("street"), apartment: get("apartment"), city: get("city"), province: get("province"), postalCode: get("postalCode") }
        : null,
      notes: get("notes"),
      lines: state.lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
    };
    setFormError(null);
    startTransition(async () => {
      let result: PlaceOrderResult;
      try {
        result = await placeOrder(input);
      } catch {
        setFormError("No pudimos enviar el pedido. Revisá tu conexión y volvé a intentar; tu bolsa sigue guardada.");
        return;
      }
      if (!result.ok) {
        setErrors(result.fieldErrors);
        setFormError(result.formError);
        // Lleva el foco al primer campo con error para que se vea y se pueda corregir.
        requestAnimationFrame(() => {
          const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
          (first ?? formRef.current?.querySelector<HTMLElement>(".form-alert"))?.focus();
        });
        return;
      }
      saveOrder(result.order);
      dispatch({ type: "clear" });
      router.push(`/pedido/${result.order.id}`);
    });
  }

  /** `group` es el objeto del schema al que pertenece el campo ("customer" o "address"), para ubicar su error. */
  const field = (group: "customer" | "address", name: string, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => {
    const err = errors[`${group}.${name}`];
    const id = `f-${name}`;
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <input id={id} name={name} aria-invalid={err ? true : undefined} aria-describedby={err ? `${id}-err` : undefined} {...props} />
        {err ? (
          <p id={`${id}-err`} className="field__error">
            {err}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      className="checkout"
      onSubmit={onSubmit}
      noValidate
      onInput={(e) => {
        // El error de un campo desaparece apenas se lo corrige, no recién al reenviar.
        const name = (e.target as HTMLInputElement).name;
        setErrors((prev) => {
          const keys = Object.keys(prev).filter((k) => k.endsWith(`.${name}`));
          if (keys.length === 0) return prev;
          const next = { ...prev };
          for (const k of keys) delete next[k];
          return next;
        });
      }}
    >
      <div className="checkout__main">
        {formError ? (
          <div className="form-alert" role="alert" tabIndex={-1}>
            {formError}{" "}
            <Link href="/carrito" className="text-link">
              Revisar la bolsa
            </Link>
          </div>
        ) : null}

        <fieldset className="checkout__section">
          <legend>Tus datos</legend>
          {field("customer", "fullName", "Nombre y apellido", { autoComplete: "name", required: true })}
          <div className="field-row">
            {field("customer", "email", "Email", { type: "email", autoComplete: "email", inputMode: "email", required: true })}
            {field("customer", "phone", "Teléfono", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "11 5555 5555", required: true })}
          </div>
          <p className="muted small">Te escribimos a este email o teléfono para confirmar el pedido.</p>
        </fieldset>

        <fieldset className="checkout__section">
          <legend>Cómo lo recibís</legend>
          <div className="radio-cards">
            {shippingOptions.map((o) => {
              const cost = shippingCost(o, subtotal, freeShippingThreshold);
              return (
                <label key={o.id} className={o.id === optionId ? "radio-card is-on" : "radio-card"}>
                  <input type="radio" name="shippingOptionId" value={o.id} checked={o.id === optionId} onChange={() => setOptionId(o.id)} />
                  <span className="radio-card__text">
                    <span className="radio-card__title">{o.label}</span>
                    <span className="muted small">{o.description}</span>
                  </span>
                  <span className="radio-card__price">{cost === 0 ? "Sin cargo" : formatMoney(cost, currency)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {option.requiresAddress ? (
          <fieldset className="checkout__section">
            <legend>Dirección de entrega</legend>
            {field("address", "street", "Calle y número", { autoComplete: "address-line1", required: true })}
            <div className="field-row">
              {field("address", "apartment", "Piso y depto. (opcional)", { autoComplete: "address-line2" })}
              {field("address", "postalCode", "Código postal", { autoComplete: "postal-code", inputMode: "text", required: true })}
            </div>
            <div className="field-row">
              {field("address", "city", "Localidad", { autoComplete: "address-level2", required: true })}
              <div className="field">
                <label htmlFor="f-province">Provincia</label>
                <select id="f-province" name="province" autoComplete="address-level1" defaultValue="" aria-invalid={errors["address.province"] ? true : undefined}>
                  <option value="" disabled>
                    Elegí una
                  </option>
                  {PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {errors["address.province"] ? <p className="field__error">{errors["address.province"]}</p> : null}
              </div>
            </div>
          </fieldset>
        ) : null}

        <fieldset className="checkout__section">
          <legend>Pago</legend>
          <p>{paymentInstructions}</p>
          <div className="field">
            <label htmlFor="f-notes">Nota para la tienda (opcional)</label>
            <textarea id="f-notes" name="notes" rows={3} maxLength={500} placeholder="Por ejemplo, un horario para recibir el envío" />
          </div>
        </fieldset>
      </div>

      <aside className="summary checkout__summary" aria-label="Resumen del pedido">
        <h2 className="summary__title">Tu pedido</h2>
        <ul className="summary__lines">
          {state.lines.map((l) => (
            <li key={l.sku}>
              <span>
                {l.quantity} × {l.name}
                <span className="muted small block">{l.variantLabel}</span>
              </span>
              <span>{formatMoney(l.unitPrice * l.quantity, currency)}</span>
            </li>
          ))}
        </ul>
        <p className="summary-row">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, currency)}</span>
        </p>
        <p className="summary-row">
          <span>Envío</span>
          <span>{shipping === 0 ? "Sin cargo" : formatMoney(shipping, currency)}</span>
        </p>
        <p className="summary-row summary-row--strong">
          <span>Total</span>
          <span>{formatMoney(subtotal + shipping, currency)}</span>
        </p>
        <button type="submit" className="button button--primary button--block button--large" disabled={pending}>
          {pending ? "Enviando pedido…" : "Confirmar pedido"}
        </button>
        <p className="muted small">Todavía no se cobra nada: te contactamos para coordinar el pago.</p>
      </aside>
    </form>
  );
}
