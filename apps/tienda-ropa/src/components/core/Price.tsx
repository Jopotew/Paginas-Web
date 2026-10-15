import { discountPercent, formatMoney, type CurrencyConfig } from "@pw/core";

export function Price({ price, compareAtPrice, currency, size = "md" }: { price: number; compareAtPrice: number | null; currency: CurrencyConfig; size?: "md" | "lg" }) {
  const off = discountPercent(price, compareAtPrice);
  return (
    <p className={`price price--${size}`}>
      <span className={off ? "price__now price__now--sale" : "price__now"}>{formatMoney(price, currency)}</span>
      {off && compareAtPrice ? (
        <>
          <s className="price__was">
            <span className="visually-hidden">Antes </span>
            {formatMoney(compareAtPrice, currency)}
          </s>
          <span className="price__off">{off}% menos</span>
        </>
      ) : null}
    </p>
  );
}
