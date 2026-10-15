import { formatMoney, type CurrencyConfig } from "@pw/core";

export function FreeShippingNote({ subtotal, threshold, currency }: { subtotal: number; threshold: number | null; currency: CurrencyConfig }) {
  if (threshold === null || subtotal === 0) return null;
  const missing = threshold - subtotal;
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  return (
    <div className="free-ship">
      <p>
        {missing > 0 ? (
          <>
            Te faltan <strong>{formatMoney(missing, currency)}</strong> para el envío gratis.
          </>
        ) : (
          <>Tu pedido tiene envío gratis a domicilio.</>
        )}
      </p>
      <div className="free-ship__bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
