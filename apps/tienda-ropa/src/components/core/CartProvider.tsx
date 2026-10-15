"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { cartItemCount, cartReducer, cartSubtotal, EMPTY_CART, parseStoredCart, type CartAction, type CartState } from "@pw/core";

const STORAGE_KEY = "pw:cart:v1";

interface CartContextValue {
  state: CartState;
  /** false hasta leer localStorage; evita mostrar "0" y después saltar al número real. */
  ready: boolean;
  count: number;
  subtotal: number;
  dispatch: (action: CartAction) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const skipNextWrite = useRef(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Navegación privada o storage bloqueado: el carrito funciona en memoria.
    }
    skipNextWrite.current = true;
    dispatch({ type: "replace", state: parseStoredCart(stored) });
    setReady(true);

    // Mantiene sincronizadas varias pestañas abiertas.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      skipNextWrite.current = true;
      dispatch({ type: "replace", state: parseStoredCart(e.newValue) });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Sin storage disponible: no se persiste, pero la compra en curso sigue.
    }
  }, [state, ready]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({ state, ready, count: cartItemCount(state), subtotal: cartSubtotal(state), dispatch, drawerOpen, openDrawer, closeDrawer }),
    [state, ready, drawerOpen, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart se usa dentro de <CartProvider>");
  return ctx;
}
