/**
 * Los montos se guardan como enteros en la unidad mínima que usa la tienda.
 * Para ARS el MVP usa pesos enteros (sin centavos), que es como se publican
 * los precios en la práctica. Si un vertical necesita centavos, se cambia
 * `fractionDigits` en la config de moneda, no el tipo.
 */
export type Money = number;

export interface CurrencyConfig {
  code: string;
  locale: string;
  fractionDigits: number;
}

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: "ARS",
  locale: "es-AR",
  fractionDigits: 0,
};

const formatterCache = new Map<string, Intl.NumberFormat>();

export function formatMoney(amount: Money, currency: CurrencyConfig = DEFAULT_CURRENCY): string {
  const key = `${currency.locale}|${currency.code}|${currency.fractionDigits}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.fractionDigits,
      maximumFractionDigits: currency.fractionDigits,
    });
    formatterCache.set(key, formatter);
  }
  return formatter.format(amount / 10 ** currency.fractionDigits);
}

/** Porcentaje de descuento redondeado hacia abajo, o null si no hay descuento real. */
export function discountPercent(price: Money, compareAtPrice?: Money | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.floor(((compareAtPrice - price) / compareAtPrice) * 100);
}
