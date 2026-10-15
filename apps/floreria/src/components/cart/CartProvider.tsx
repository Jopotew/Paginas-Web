"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { cartReducer, emptyCart, parseStoredCart, type CartAction, type CartState } from "@/lib/cart";

const STORAGE_KEY = "floreria.cart.v1";

type CartContextValue = {
  state: CartState;
  dispatch: (a: CartAction) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ productIds, children }: { productIds: string[]; children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart);
  const [isOpen, setOpen] = useState(false);
  const hydrated = useRef(false);

  // El carrito se recupera después del primer render para no romper la hidratación.
  // Se descartan productos que ya no existen en el catálogo.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Navegación privada o almacenamiento bloqueado: el carrito vive solo en memoria.
    }
    dispatch({ type: "hydrate", state: parseStoredCart(raw, new Set(productIds)) });
    hydrated.current = true;
  }, [productIds]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ídem: sin persistencia, el carrito sigue funcionando.
    }
  }, [state]);

  const value = useMemo(
    () => ({ state, dispatch, isOpen, open: () => setOpen(true), close: () => setOpen(false) }),
    [state, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
