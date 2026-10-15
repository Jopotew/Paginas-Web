"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useRef, useState, type ReactNode } from "react";
import type { CurrencyConfig } from "@pw/core";
import { colorStock, LOW_STOCK_THRESHOLD, sizesForColor, variantLabel, type ApparelProduct } from "@pw/ropa";
import { useCart } from "../core/CartProvider";
import { VariantSelector } from "../core/VariantSelector";
import { ProductMedia } from "./ProductMedia";
import { SizeGuideDialog } from "./SizeGuideDialog";

interface Props {
  product: ApparelProduct;
  currency: CurrencyConfig;
  initialColorId: string;
  /** Precio, breadcrumbs y bloques de texto vienen renderizados del servidor. */
  header: ReactNode;
  details: ReactNode;
}

export function ProductView({ product, initialColorId, header, details }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { dispatch, openDrawer } = useCart();
  const [colorId, setColorId] = useState(initialColorId);
  // Sin talle preseleccionado: evita compras en un talle que nadie eligió.
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const errorId = useId();

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]!;
  const sizes = sizesForColor(product, color.id);
  const selected = sizes.find((s) => s.size === size) ?? null;
  const soldOutColor = colorStock(product, color.id) === 0;

  function chooseColor(id: string) {
    setColorId(id);
    setError(null);
    // Si el talle elegido no existe en el nuevo color, se limpia en vez de cambiarlo en silencio.
    const stillAvailable = size && sizesForColor(product, id).some((s) => s.size === size && s.stock > 0);
    if (!stillAvailable) setSize(null);
    const firstId = product.colors[0]?.id;
    router.replace(id === firstId ? pathname : `${pathname}?color=${id}`, { scroll: false });
  }

  function addToBag() {
    if (!selected || !selected.sku) {
      setError("Elegí un talle para agregar a la bolsa.");
      sizeGroupRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    dispatch({
      type: "add",
      line: {
        sku: selected.sku,
        itemId: product.id,
        slug: product.slug,
        name: product.name,
        variantLabel: variantLabel(color, selected.size),
        unitPrice: product.price,
        maxQuantity: selected.stock,
        meta: { color: color.id, hex: color.hex, garment: product.garment, ...(color.images[0] ? { image: color.images[0].src } : {}) },
      },
    });
    openDrawer();
  }

  return (
    <div className="pdp">
      <div className="pdp__media">
        <ProductMedia product={product} color={color} priority />
      </div>

      <div className="pdp__info">
        {header}

        <VariantSelector
          name="color"
          variant="swatch"
          legend={
            <>
              Color: <strong>{color.name}</strong>
            </>
          }
          value={color.id}
          onChange={chooseColor}
          options={product.colors.map((c) => ({ value: c.id, label: c.name, swatch: c.hex, unavailable: colorStock(product, c.id) === 0 }))}
        />

        <div ref={sizeGroupRef}>
          <VariantSelector
            name="talle"
            variant="button"
            legend={
              <span className="variant__legend-row">
                <span>
                  Talle{selected ? <>: <strong>{selected.size}</strong></> : null}
                </span>
                <SizeGuideDialog chart={product.sizeChart} highlight={size} />
              </span>
            }
            value={size}
            onChange={(s) => {
              setSize(s);
              setError(null);
            }}
            options={sizes.map((s) => ({ value: s.size, label: s.size, unavailable: s.stock === 0 }))}
            invalid={!!error}
            describedBy={error ? errorId : undefined}
          />
        </div>

        <div className="pdp__status" aria-live="polite">
          {error ? (
            <p id={errorId} className="form-error">
              {error}
            </p>
          ) : selected && selected.stock <= LOW_STOCK_THRESHOLD ? (
            <p className="low-stock">{selected.stock === 1 ? "Queda 1 en este talle." : `Quedan ${selected.stock} en este talle.`}</p>
          ) : null}
        </div>

        <button type="button" className="button button--primary button--block button--large" onClick={addToBag} disabled={soldOutColor}>
          {soldOutColor ? `Sin stock en ${color.name.toLowerCase()}` : "Agregar a la bolsa"}
        </button>

        {details}
      </div>
    </div>
  );
}
