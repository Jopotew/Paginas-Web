import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/core/OrderConfirmation";
import { currency, site } from "@/lib/content";

export const metadata: Metadata = { title: "Pedido recibido", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container narrow-page">
      <OrderConfirmation
        id={id.toUpperCase()}
        currency={currency}
        storeName={site.branding.name}
        whatsapp={site.contact.whatsapp ?? null}
        email={site.contact.email}
        paymentInstructions={site.payment.instructions}
      />
    </div>
  );
}
