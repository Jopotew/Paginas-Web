import Link from "next/link";
import type { SiteConfig } from "@pw/core";
import { CartButton } from "./CartButton";

export function SiteHeader({ site }: { site: SiteConfig }) {
  return (
    <>
      {site.announcement ? <p className="announcement">{site.announcement}</p> : null}
      <header className="site-header">
        <div className="site-header__inner container">
          <details className="mobile-nav">
            <summary aria-label="Abrir el menú">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </summary>
            <nav aria-label="Categorías" className="mobile-nav__panel">
              <form action="/buscar" method="get" role="search" className="search">
                <label htmlFor="q-mobile" className="visually-hidden">
                  Buscar productos
                </label>
                <input id="q-mobile" name="q" type="search" placeholder="Buscar" autoComplete="off" enterKeyHint="search" />
                <button type="submit" aria-label="Buscar">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="6" />
                    <path d="M16 16l4 4" />
                  </svg>
                </button>
              </form>
              <ul>
                <li>
                  <Link href="/tienda">Ver todo</Link>
                </li>
                {site.categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/tienda/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <Link href="/" className="logo">
            {site.branding.logoText}
          </Link>

          <nav aria-label="Categorías" className="main-nav">
            <ul>
              {site.categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/tienda/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__tools">
            <form action="/buscar" method="get" role="search" className="search">
              <label htmlFor="q" className="visually-hidden">
                Buscar productos
              </label>
              <input id="q" name="q" type="search" placeholder="Buscar" autoComplete="off" enterKeyHint="search" />
              <button type="submit" aria-label="Buscar">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6" />
                  <path d="M16 16l4 4" />
                </svg>
              </button>
            </form>
            <CartButton />
          </div>
        </div>
      </header>
    </>
  );
}
