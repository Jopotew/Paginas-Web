import type { Metadata } from "next";
import { formatMoney } from "@pw/core";
import { currency, site } from "@/lib/content";

export const metadata: Metadata = { title: "Ayuda", description: "Envíos, cambios y formas de pago." };

export default function HelpPage() {
  const threshold = site.shipping.freeShippingThreshold;
  return (
    <div className="container narrow-page prose">
      <h1 className="page-title">Ayuda</h1>

      <section id="envios">
        <h2>Envíos</h2>
        <ul>
          {site.shipping.options.map((o) => (
            <li key={o.id}>
              <strong>{o.label}</strong>: {o.price === 0 ? "sin cargo" : formatMoney(o.price, currency)}. {o.description}
            </li>
          ))}
        </ul>
        {threshold !== null ? <p>El envío a domicilio es gratis en compras desde {formatMoney(threshold, currency)}.</p> : null}
      </section>

      <section id="cambios">
        <h2>Cambios y devoluciones</h2>
        <p>{site.returnsPolicy}</p>
      </section>

      <section id="pagos">
        <h2>Formas de pago</h2>
        <ul>
          {site.payment.methods.map((m) => (
            <li key={m.id}>
              <strong>{m.label}</strong>: {m.description}
            </li>
          ))}
        </ul>
        <p>{site.payment.instructions}</p>
      </section>

      <section id="contacto">
        <h2>Contacto</h2>
        <p>
          Escribinos a <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          {site.contact.whatsapp ? (
            <>
              {" "}
              o por{" "}
              <a href={`https://wa.me/${site.contact.whatsapp}`} rel="noopener">
                WhatsApp
              </a>
            </>
          ) : null}
          .
        </p>
      </section>
    </div>
  );
}
