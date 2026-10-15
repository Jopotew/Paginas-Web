"use client";

import { cartCount } from "@/lib/cart";
import { useCart } from "./CartProvider";
import styles from "./cart.module.css";

export function CartButton() {
  const { state, open } = useCart();
  const count = cartCount(state);
  return (
    <button type="button" className={styles.cartButton} onClick={open} aria-haspopup="dialog">
      Tu pedido
      <span className={styles.badge} aria-label={`${count} ${count === 1 ? "producto" : "productos"}`}>
        {count}
      </span>
    </button>
  );
}
