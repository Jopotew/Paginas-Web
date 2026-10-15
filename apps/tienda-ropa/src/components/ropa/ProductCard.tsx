import Link from "next/link";
import type { CurrencyConfig } from "@pw/core";
import { colorStock, defaultColor, isSoldOut, type ApparelProduct, type ColorFamily } from "@pw/ropa";
import { Price } from "../core/Price";
import { ProductMedia } from "./ProductMedia";

interface Props {
  product: ApparelProduct;
  currency: CurrencyConfig;
  /** Si se filtró por color, la tarjeta muestra ese color de entrada. */
  preferFamilies?: ColorFamily[];
  priority?: boolean;
}

export function ProductCard({ product, currency, preferFamilies = [], priority }: Props) {
  const preferred = product.colors.find((c) => preferFamilies.includes(c.family) && colorStock(product, c.id) > 0);
  const color = defaultColor(product, preferred?.id);
  const soldOut = isSoldOut(product);
  const href = color.id === product.colors[0]?.id ? `/producto/${product.slug}` : `/producto/${product.slug}?color=${color.id}`;

  return (
    <article className="card">
      <Link href={href} className="card__link">
        <ProductMedia product={product} color={color} priority={priority ?? false} />
        {soldOut ? <span className="card__flag">Agotado</span> : null}
        <h3 className="card__name">{product.name}</h3>
      </Link>
      <Price price={product.price} compareAtPrice={product.compareAtPrice} currency={currency} />
      {product.colors.length > 1 ? (
        <ul className="card__swatches" aria-label={`${product.colors.length} colores`}>
          {product.colors.map((c) => (
            <li key={c.id} title={c.name} style={{ background: c.hex }} className={colorStock(product, c.id) === 0 ? "is-out" : undefined}>
              <span className="visually-hidden">{c.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="card__meta">{product.colors[0]?.name}</p>
      )}
    </article>
  );
}

export function ProductGrid({ products, currency, preferFamilies }: { products: ApparelProduct[]; currency: CurrencyConfig; preferFamilies?: ColorFamily[] }) {
  return (
    <ul className="grid">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} currency={currency} preferFamilies={preferFamilies ?? []} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
