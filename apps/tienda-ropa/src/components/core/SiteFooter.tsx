import Link from "next/link";
import type { SiteConfig } from "@pw/core";

export function SiteFooter({ site }: { site: SiteConfig }) {
  const { contact } = site;
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="logo logo--footer">{site.branding.logoText}</p>
          <p className="muted">{site.branding.tagline}</p>
        </div>
        <nav aria-label="Categorías">
          <h2 className="footer-title">Comprar</h2>
          <ul>
            {site.categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/tienda/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="footer-title">Ayuda</h2>
          <ul>
            <li>
              <Link href="/ayuda#envios">Envíos</Link>
            </li>
            <li>
              <Link href="/ayuda#cambios">Cambios y devoluciones</Link>
            </li>
            <li>
              <Link href="/ayuda#pagos">Formas de pago</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title">Contacto</h2>
          <ul>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            {contact.whatsapp ? (
              <li>
                <a href={`https://wa.me/${contact.whatsapp}`} rel="noopener">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {contact.instagram ? (
              <li>
                <a href={`https://instagram.com/${contact.instagram}`} rel="noopener">
                  Instagram
                </a>
              </li>
            ) : null}
            {contact.address ? <li className="muted">{contact.address}</li> : null}
          </ul>
        </div>
      </div>
      <p className="container small muted site-footer__legal">
        © {new Date().getFullYear()} {site.branding.name}. Precios en pesos argentinos con IVA incluido.
      </p>
    </footer>
  );
}
