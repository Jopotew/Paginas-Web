"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import styles from "./cart.module.css";

type Props = { id: string; name: string; price: number; image: string };

export function AddToCartButton(props: Props) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      className={styles.add}
      data-added={added || undefined}
      onClick={() => {
        dispatch({ type: "add", item: props });
        setAdded(true);
      }}
    >
      <span aria-live="polite">{added ? "Agregado al pedido" : "Agregar al pedido"}</span>
    </button>
  );
}
