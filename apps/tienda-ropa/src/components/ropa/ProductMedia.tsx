import type { ApparelColor, ApparelProduct } from "@pw/ropa";
import { GarmentArt } from "./GarmentArt";

/** Foto del color si existe; si no, la ilustración. Siempre en 4:5 para que la grilla no salte. */
export function ProductMedia({ product, color, priority = false }: { product: ApparelProduct; color: ApparelColor; priority?: boolean }) {
  const image = color.images[0];
  return (
    <div className="media-frame">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- las fotos pueden venir de cualquier host que configure la marca
        <img src={image.src} alt={image.alt} loading={priority ? "eager" : "lazy"} decoding="async" />
      ) : (
        <GarmentArt garment={product.garment} hex={color.hex} label={`${product.name} en ${color.name.toLowerCase()}`} />
      )}
    </div>
  );
}
