import type { Metadata } from "next";
import { CartPageView } from "@/components/core/CartPageView";
import { currency, site } from "@/lib/content";

export const metadata: Metadata = { title: "Tu bolsa", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container narrow-page">
      <h1 className="page-title">Tu bolsa</h1>
      <CartPageView currency={currency} freeShippingThreshold={site.shipping.freeShippingThreshold} />
    </div>
  );
}
