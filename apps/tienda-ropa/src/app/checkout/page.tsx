import type { Metadata } from "next";
import { CheckoutForm } from "@/components/core/CheckoutForm";
import { currency, site } from "@/lib/content";
import { placeOrder } from "./actions";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="container narrow-page">
      <h1 className="page-title">Finalizar compra</h1>
      <CheckoutForm
        currency={currency}
        shippingOptions={site.shipping.options}
        freeShippingThreshold={site.shipping.freeShippingThreshold}
        paymentMethods={site.payment.methods}
        paymentInstructions={site.payment.instructions}
        placeOrder={placeOrder}
      />
    </div>
  );
}
