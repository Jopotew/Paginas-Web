import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource/gloock/400.css";
import "@fontsource-variable/figtree";
import "./globals.css";
import { content } from "@/lib/content";
import { CartProvider } from "@/components/cart/CartProvider";

const { store, catalog } = content;

export const metadata: Metadata = {
  title: `${store.name} · Flores y ramos con envío en el día`,
  description: store.description,
  openGraph: { title: store.name, description: store.description, locale: "es_AR", type: "website" },
};

export const viewport: Viewport = { themeColor: "#1f3b2d" };

const productIds = catalog.flatMap((c) => c.products.map((p) => p.id));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <a href="#catalogo" className="skip-link">
          Ir al catálogo
        </a>
        <CartProvider productIds={productIds}>{children}</CartProvider>
      </body>
    </html>
  );
}
