import Link from "next/link";
import { formatMoney, rankBySales, sortItems } from "@pw/core";
import { defaultColor, isSoldOut } from "@pw/ropa";
import { Slider } from "@/components/core/Slider";
import { ProductCard, ProductGrid } from "@/components/ropa/ProductCard";
import { GarmentArt } from "@/components/ropa/GarmentArt";
import { ProductMedia } from "@/components/ropa/ProductMedia";
import { currency, products, site } from "@/lib/content";

/** Cuántas miniaturas lleva cada categoría. */
const CATEGORY_THUMBS = 3;

export default function HomePage() {
  const available = products.filter((p) => !isSoldOut(p));
  // Sin tope: cada producto que suma ventas entra al carrusel.
  const bestSellers = rankBySales(available).filter((p) => p.unitsSold > 0);
  const newest = sortItems(available, "novedades").slice(0, 4);
  // Tres prendas para la composición del hero: las más vendidas de categorías distintas.
  const heroPieces = bestSellers.filter((p, i, arr) => arr.findIndex((q) => q.category === p.category) === i).slice(0, 3);
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

      {bestSellers.length > 0 ? (
        <Slider
          id="mas-vendido"
          title="Lo más vendido"
          action={
            <Link href="/tienda" className="text-link">
              Ver todo
            </Link>
          }
        >
          {bestSellers.map((p, i) => (
            <li key={p.id} className="slider__item">
              <ProductCard product={p} currency={currency} priority={i < 4} />
            </li>
          ))}
        </Slider>
      ) : null}

      <section className="container section" aria-labelledby="categorias">
        <h2 id="categorias" className="section__title">
          Categorías
        </h2>
        <ul className="category-index">
          {site.categories.map((c) => {
            const inCategory = products.filter((p) => p.category === c.slug);
            const top = rankBySales(inCategory.filter((p) => !isSoldOut(p))).slice(0, CATEGORY_THUMBS);
            return (
              <li key={c.slug}>
                <Link href={`/tienda/${c.slug}`}>
                  <span className="category-index__name">{c.name}</span>
                  <span className="category-index__text">
                    <span className="category-index__desc">{c.description}</span>
                    <span className="category-index__count">
                      {inCategory.length} {inCategory.length === 1 ? "modelo" : "modelos"}
                    </span>
                  </span>
                  {top.length > 0 ? (
                    <span className="category-index__thumbs">
                      {top.map((p) => (
                        <span key={p.id} className="category-index__thumb">
                          <ProductMedia product={p} color={defaultColor(p)} decorative />
                        </span>
                      ))}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
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
          <ul className="services__list">
            {site.payment.methods.map((m) => (
              <li key={m.id}>
                <strong>{m.label}.</strong> {m.description}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
