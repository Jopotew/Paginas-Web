"use client";

import type { ReactNode } from "react";

export interface VariantOption {
  value: string;
  label: string;
  /** Sin stock: se muestra tachado pero visible, para no esconder qué existe. */
  unavailable?: boolean;
  swatch?: string;
}

interface Props {
  name: string;
  legend: ReactNode;
  options: VariantOption[];
  value: string | null;
  onChange: (value: string) => void;
  variant: "swatch" | "button";
  invalid?: boolean;
  describedBy?: string;
}

/**
 * Selector genérico de variante (talle, color, sabor, edición...).
 * Usa radios nativos: teclado con flechas, anuncio de "seleccionado" y
 * formularios sin JS funcionan de fábrica. Vive en core porque cualquier
 * vertical con variantes lo reutiliza.
 */
export function VariantSelector({ name, legend, options, value, onChange, variant, invalid, describedBy }: Props) {
  return (
    <fieldset className={`variant variant--${variant}`} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
      <legend className="variant__legend">{legend}</legend>
      <div className="variant__options">
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <div key={o.value} className="variant__option">
              <input
                type="radio"
                id={id}
                name={name}
                value={o.value}
                checked={value === o.value}
                disabled={variant === "button" && o.unavailable}
                onChange={() => onChange(o.value)}
              />
              <label htmlFor={id} className={o.unavailable ? "is-unavailable" : undefined} title={o.unavailable ? `${o.label}: sin stock` : o.label}>
                {variant === "swatch" ? (
                  <>
                    <span className="variant__swatch" style={{ background: o.swatch }} />
                    <span className="visually-hidden">
                      {o.label}
                      {o.unavailable ? ", sin stock" : ""}
                    </span>
                  </>
                ) : (
                  <>
                    {o.label}
                    {o.unavailable ? <span className="visually-hidden">, sin stock</span> : null}
                  </>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
