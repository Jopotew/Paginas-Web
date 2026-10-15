import type { Money } from "../money";

/**
 * Una línea del carrito es una variante concreta (SKU), no un producto.
 * `meta` lo usa cada vertical para lo que necesite mostrar (color, talle, etc.)
 * sin que el core conozca esos conceptos.
 */
export interface CartLine {
  sku: string;
  itemId: string;
  slug: string;
  name: string;
  variantLabel: string;
  unitPrice: Money;
  quantity: number;
  /** Stock conocido al momento de agregar. El servidor lo revalida en el checkout. */
  maxQuantity: number;
  meta: Record<string, string>;
}

export interface CartState {
  lines: CartLine[];
}

export type CartAction =
  | { type: "add"; line: Omit<CartLine, "quantity">; quantity?: number }
  | { type: "setQuantity"; sku: string; quantity: number }
  | { type: "remove"; sku: string }
  | { type: "clear" }
  | { type: "replace"; state: CartState };

export const EMPTY_CART: CartState = { lines: [] };

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const qty = Math.max(1, Math.floor(action.quantity ?? 1));
      const existing = state.lines.find((l) => l.sku === action.line.sku);
      if (existing) {
        const quantity = clamp(existing.quantity + qty, 1, action.line.maxQuantity);
        return {
          lines: state.lines.map((l) =>
            l.sku === action.line.sku ? { ...l, ...action.line, quantity } : l,
          ),
        };
      }
      if (action.line.maxQuantity < 1) return state;
      return {
        lines: [...state.lines, { ...action.line, quantity: clamp(qty, 1, action.line.maxQuantity) }],
      };
    }
    case "setQuantity": {
      if (action.quantity < 1) {
        return { lines: state.lines.filter((l) => l.sku !== action.sku) };
      }
      return {
        lines: state.lines.map((l) =>
          l.sku === action.sku ? { ...l, quantity: clamp(Math.floor(action.quantity), 1, l.maxQuantity) } : l,
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.sku !== action.sku) };
    case "clear":
      return EMPTY_CART;
    case "replace":
      return action.state;
  }
}

export function cartItemCount(state: CartState): number {
  return state.lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartSubtotal(state: CartState): Money {
  return state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

/** Parseo defensivo de lo guardado en localStorage: ante cualquier forma inesperada, carrito vacío. */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return EMPTY_CART;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || !Array.isArray((data as CartState).lines)) return EMPTY_CART;
    const lines = (data as CartState).lines.filter(
      (l): l is CartLine =>
        !!l &&
        typeof l.sku === "string" &&
        typeof l.name === "string" &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0 &&
        Number.isInteger(l.unitPrice),
    );
    return { lines };
  } catch {
    return EMPTY_CART;
  }
}
