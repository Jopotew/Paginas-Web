import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { brandingToCssVars, cssVarsToString } from "@pw/core";
import { CartDrawer } from "@/components/core/CartDrawer";
import { CartProvider } from "@/components/core/CartProvider";
import { SiteFooter } from "@/components/core/SiteFooter";
import { SiteHeader } from "@/components/core/SiteHeader";
import { currency, site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: site.seo.title, template: `%s | ${site.branding.name}` },
  description: site.seo.description,
  openGraph: { siteName: site.branding.name, locale: site.locale.replace("-", "_"), type: "website" },
};

export const viewport: Viewport = {
  themeColor: site.branding.colors.background,
};

// El branding sale de site.json: cambiar de marca es editar ese archivo, no el CSS.
const brandVars = `:root{${cssVarsToString(brandingToCssVars(site.branding))}}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = site.branding.fonts.stylesheetUrl;
  return (
    <html lang={site.locale}>
      <head>
        {fonts ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fonts} />
          </>
        ) : null}
        <style>{brandVars}</style>
      </head>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider>
          <SiteHeader site={site} />
          <main id="contenido">{children}</main>
          <SiteFooter site={site} />
          <CartDrawer currency={currency} freeShippingThreshold={site.shipping.freeShippingThreshold} />
        </CartProvider>
      </body>
    </html>
  );
}
