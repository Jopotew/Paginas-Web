import type { Garment } from "@pw/ropa";

/**
 * Ilustración plana de la prenda en el color de la variante. Es el reemplazo
 * de la foto mientras la tienda no tenga fotografía propia: cuando un color
 * tiene `images`, se muestra la foto y esto no se usa.
 */
const SHAPES: Record<Garment, { body: string; details: string[] }> = {
  remera: {
    body: "M150 110 Q200 142 250 110 L322 136 L366 214 L322 236 L300 212 L300 404 L100 404 L100 212 L78 236 L34 214 L78 136 Z",
    details: ["M150 110 Q200 160 250 110", "M300 212 L300 404", "M100 212 L100 404"],
  },
  camisa: {
    body: "M156 96 L200 124 L244 96 L314 120 L352 400 L312 406 L292 218 L292 412 L108 412 L108 218 L88 406 L48 400 L86 120 Z",
    details: ["M156 96 L178 146 L200 124", "M244 96 L222 146 L200 124", "M200 124 L200 412", "M120 176 L162 176 L162 214 L120 214 Z"],
  },
  buzo: {
    body: "M142 122 L258 122 L320 142 L354 396 L314 402 L294 222 L294 408 L106 408 L106 222 L86 402 L46 396 L80 142 Z",
    details: ["M150 128 Q150 54 200 54 Q250 54 250 128 Q200 154 150 128 Z", "M138 318 L262 318 L278 384 L122 384 Z", "M106 392 L294 392", "M190 140 L186 200", "M210 140 L214 200"],
  },
  sweater: {
    body: "M150 112 Q200 138 250 112 L318 136 L354 396 L314 402 L294 220 L294 408 L106 408 L106 220 L86 402 L46 396 L82 136 Z",
    details: ["M150 112 Q200 152 250 112", "M106 390 L294 390", "M48 384 L86 388", "M352 384 L314 388", "M200 160 L200 380"],
  },
  campera: {
    body: "M150 94 L250 94 L318 120 L354 400 L314 406 L294 218 L294 414 L106 414 L106 218 L86 406 L46 400 L82 120 Z",
    details: ["M150 94 L176 150 L200 128 L224 150 L250 94", "M200 128 L200 414", "M122 190 L172 190 L172 236 L122 236 Z", "M228 190 L278 190 L278 236 L228 236 Z", "M106 396 L294 396"],
  },
  pantalon: {
    body: "M128 78 L272 78 L290 432 L216 432 L200 176 L184 432 L110 432 Z",
    details: ["M128 102 L272 102", "M150 102 Q158 136 132 146", "M250 102 Q242 136 268 146", "M200 102 L200 176"],
  },
  vestido: {
    body: "M164 56 L176 56 L184 108 L216 108 L224 56 L236 56 L248 150 L232 206 L312 440 L88 440 L168 206 L152 150 Z",
    details: ["M168 206 L232 206", "M200 206 L188 440", "M200 206 L244 440"],
  },
  pollera: {
    body: "M140 92 L260 92 L330 430 L70 430 Z",
    details: ["M140 116 L260 116", "M170 116 L130 430", "M200 116 L200 430", "M230 116 L270 430", "M155 116 L100 430", "M245 116 L300 430"],
  },
};

interface Props {
  garment: Garment;
  hex: string;
  label: string;
  /** Las ilustraciones decorativas (miniaturas junto al nombre) no se anuncian dos veces. */
  decorative?: boolean;
}

export function GarmentArt({ garment, hex, label, decorative = false }: Props) {
  const shape = SHAPES[garment];
  const stroke = `color-mix(in srgb, ${hex} 62%, #000)`;
  return (
    <svg
      viewBox="0 0 400 500"
      className="garment-art"
      style={{ background: `color-mix(in srgb, ${hex} 14%, var(--color-surface))` }}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      focusable="false"
    >
      <path d={shape.body} fill={hex} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      {shape.details.map((d) => (
        <path key={d} d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
      ))}
    </svg>
  );
}
