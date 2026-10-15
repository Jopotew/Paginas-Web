import Link from "next/link";
import { formatMoney, sortItems } from "@pw/core";
import { defaultColor, isSoldOut } from "@pw/ropa";
import { ProductGrid } from "@/components/ropa/ProductCard";
import { GarmentArt } from "@/components/ropa/GarmentArt";
import { currency, products, site } from "@/lib/content";

export default function HomePage() {
  const available = products.filter((p) => !isSoldOut(p));
  const allFeatured = available.filter((p) => p.featured);
  // Filas completas de 4: una fila a medias se ve como un error de carga.
  const featured = allFeatured.slice(0, Math.max(4, Math.floor(allFeatured.length / 4) * 4));
  const shown = new Set(featured.map((p) => p.id));
  const newest = sortItems(available.filter((p) => !shown.has(p.id)), "novedades").slice(0, 4);
  // Tres prendas para la composición del hero: las destacadas de categorías distintas.
  const heroPieces = allFeatured.filter((p, i, arr) => arr.findIndex((q) => q.category === p.category) === i).slice(0, 3);
  const threshold = site.shipping.freeShippingThreshold;

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">{site.hero.title}</h1>
            <p className="hero__body">{site.hero.body}</p>
            <Link href={site.hero.ctaHref} className="button button--primary">
              {site.hero.ctaLabel}
            </Link>
          </div>
          <div className="hero__weave" aria-hidden="true">
            {heroPieces.map((p, i) => (
              <div key={p.id} className={`hero__piece hero__piece--${i + 1}`}>
                <GarmentArt garment={p.garment} hex={defaultColor(p).hex} label="" decorative />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="categorias">
        <h2 id="categorias" className="section__title">
          Categorías
        </h2>
        <ul className="category-index">
          {site.categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <li key={c.slug}>
                <Link href={`/tienda/${c.slug}`}>
                  <span className="category-index__name">{c.name}</span>
                  <span className="category-index__desc">{c.description}</span>
                  <span className="category-index__count">{count} {count === 1 ? "modelo" : "modelos"}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container section" aria-labelledby="destacados">
        <div className="section__head">
          <h2 id="destacados" className="section__title">
            Lo que más se lleva
          </h2>
          <Link href="/tienda" className="text-link">
            Ver todo
          </Link>
        </div>
        <ProductGrid products={featured} currency={currency} />
      </section>

      <section className="container section" aria-labelledby="novedades">
        <div className="section__head">
          <h2 id="novedades" className="section__title">
            Recién llegado
          </h2>
          <Link href="/tienda?orden=novedades" className="text-link">
            Ver novedades
          </Link>
        </div>
        <ProductGrid products={newest} currency={currency} />
      </section>

      <section className="container section services" aria-label="Envíos, cambios y pagos">
        <div>
          <h2>Envíos</h2>
          <p>
            A todo el país.{" "}
            {threshold !== null ? <>Gratis a domicilio desde {formatMoney(threshold, currency)}.</> : null} También podés retirar en el local.
          </p>
        </div>
        <div>
          <h2>Cambios</h2>
          <p>{site.returnsPolicy}</p>
        </div>
        <div>
          <h2>Pagos</h2>
          <p>Transferencia bancaria o efectivo al retirar. Confirmamos cada pedido por WhatsApp o email.</p>
        </div>
      </section>
    </>
  );
}
