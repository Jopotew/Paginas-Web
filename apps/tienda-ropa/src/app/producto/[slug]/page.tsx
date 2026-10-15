import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMoney } from "@pw/core";
import { defaultColor, totalStock } from "@pw/ropa";
import { Price } from "@/components/core/Price";
import { ProductGrid } from "@/components/ropa/ProductCard";
import { ProductView } from "@/components/ropa/ProductView";
import { currency, getCategory, getProduct, products, relatedProducts, site } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: { title: product.name, description: product.description, type: "website" },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const sp = await searchParams;
  const requested = Array.isArray(sp.color) ? sp.color[0] : sp.color;
  const color = defaultColor(product, requested);
  const category = getCategory(product.category);
  const threshold = site.shipping.freeShippingThreshold;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: site.branding.name },
    material: product.material,
    offers: {
      "@type": "Offer",
      url: `${site.siteUrl}/producto/${product.slug}`,
      priceCurrency: currency.code,
      price: product.price,
      availability: totalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Ruta" className="breadcrumb">
        <ol>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          {category ? (
            <li>
              <Link href={`/tienda/${category.slug}`}>{category.name}</Link>
            </li>
          ) : null}
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <ProductView
        key={product.id}
        product={product}
        currency={currency}
        initialColorId={color.id}
        header={
          <header className="pdp__head">
            <h1 className="pdp__title">{product.name}</h1>
            <Price price={product.price} compareAtPrice={product.compareAtPrice} currency={currency} size="lg" />
            <p className="muted small">Calce {product.fit.toLowerCase()}</p>
          </header>
        }
        details={
          <>
            <ul className="pdp__perks">
              <li>{threshold !== null ? `Envío gratis a domicilio desde ${formatMoney(threshold, currency)}.` : "Envíos a todo el país."}</li>
              <li>Cambio sin cargo durante 30 días.</li>
            </ul>
            <div className="accordion">
              <details open>
                <summary>Descripción</summary>
                <p>{product.description}</p>
              </details>
              <details>
                <summary>Material y cuidado</summary>
                <p>{product.material}</p>
                <ul className="plain-list">
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </details>
              <details>
                <summary>Envíos y cambios</summary>
                <ul className="plain-list">
                  {site.shipping.options.map((o) => (
                    <li key={o.id}>
                      <strong>{o.label}</strong>: {o.price === 0 ? "sin cargo" : formatMoney(o.price, currency)}. {o.description}
                    </li>
                  ))}
                </ul>
                <p>{site.returnsPolicy}</p>
              </details>
            </div>
          </>
        }
      />

      <section className="section" aria-labelledby="relacionados">
        <h2 id="relacionados" className="section__title">
          También te puede gustar
        </h2>
        <ProductGrid products={relatedProducts(product)} currency={currency} />
      </section>
    </div>
  );
}
