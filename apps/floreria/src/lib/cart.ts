/** Lo mínimo del producto que necesita el carrito. Se guarda en el navegador. */
export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "add"; item: Omit<CartLine, "qty"> }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

export const MAX_QTY = 20;

export const emptyCart: CartState = { lines: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.id === action.item.id);
      if (existing) {
        return cartReducer(state, { type: "setQty", id: existing.id, qty: existing.qty + 1 });
      }
      return { lines: [...state.lines, { ...action.item, qty: 1 }] };
    }
    case "setQty": {
      const qty = Math.min(MAX_QTY, Math.floor(action.qty));
      if (qty <= 0) return cartReducer(state, { type: "remove", id: action.id });
      return { lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty } : l)) };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return emptyCart;
    case "hydrate":
      return action.state;
  }
}

export const cartCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (s: CartState) => s.lines.reduce((n, l) => n + l.qty * l.price, 0);

/** Lee lo guardado sin confiar en su forma: puede venir de una versión vieja o estar corrupto. */
export function parseStoredCart(raw: string | null, validIds: Set<string>): CartState {
  if (!raw) return emptyCart;
  try {
    const data = JSON.parse(raw) as { lines?: unknown };
    if (!Array.isArray(data.lines)) return emptyCart;
    const lines = data.lines.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof l.id === "string" &&
        validIds.has(l.id) &&
        typeof l.name === "string" &&
        typeof l.price === "number" &&
        typeof l.image === "string" &&
        Number.isInteger(l.qty) &&
        l.qty > 0,
    );
    return { lines };
  } catch {
    return emptyCart;
  }
}
