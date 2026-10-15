import Image from "next/image";
import type { Product } from "@/lib/schema";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./cart/AddToCartButton";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.card}>
      <Image
        src={product.image.src}
        alt={product.image.alt}
        width={product.image.width}
        height={product.image.height}
        sizes="(min-width: 1024px) 26vw, (min-width: 640px) 40vw, 68vw"
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <p className={styles.description}>{product.description}</p>
        <AddToCartButton id={product.id} name={product.name} price={product.price} image={product.image.src} />
      </div>
    </article>
  );
}
