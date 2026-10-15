"use client";

import Link from "next/link";
import { formatMoney, type CartLine, type CurrencyConfig } from "@pw/core";
import type { Garment } from "@pw/ropa";
import { GarmentArt } from "../ropa/GarmentArt";
import { useCart } from "./CartProvider";

export function CartLines({ currency, onNavigate }: { currency: CurrencyConfig; onNavigate?: () => void }) {
  const { state, dispatch } = useCart();
  return (
    <ul className="lines">
      {state.lines.map((line) => (
        <li key={line.sku} className="line">
          <Link href={`/producto/${line.slug}${line.meta.color ? `?color=${line.meta.color}` : ""}`} className="line__thumb" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
            <LineThumb line={line} />
          </Link>
          <div className="line__body">
            <Link href={`/producto/${line.slug}${line.meta.color ? `?color=${line.meta.color}` : ""}`} className="line__name" onClick={onNavigate}>
              {line.name}
            </Link>
            <p className="line__variant">{line.variantLabel}</p>
            <div className="line__actions">
              <div className="stepper" role="group" aria-label={`Cantidad de ${line.name}`}>
                <button type="button" onClick={() => dispatch({ type: "setQuantity", sku: line.sku, quantity: line.quantity - 1 })} aria-label="Restar una unidad">
                  −
                </button>
                <output aria-live="polite">{line.quantity}</output>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "setQuantity", sku: line.sku, quantity: line.quantity + 1 })}
                  disabled={line.quantity >= line.maxQuantity}
                  aria-label="Sumar una unidad"
                >
                  +
                </button>
              </div>
              <button type="button" className="link-button" onClick={() => dispatch({ type: "remove", sku: line.sku })}>
                Quitar
              </button>
            </div>
            {line.quantity >= line.maxQuantity ? <p className="line__note">No hay más stock de este talle.</p> : null}
          </div>
          <p className="line__total">{formatMoney(line.unitPrice * line.quantity, currency)}</p>
        </li>
      ))}
    </ul>
  );
}

function LineThumb({ line }: { line: CartLine }) {
  if (line.meta.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={line.meta.image} alt="" />;
  }
  return <GarmentArt garment={(line.meta.garment as Garment) ?? "remera"} hex={line.meta.hex ?? "#999999"} label="" decorative />;
}
