# 04 — Modelo de datos

**Versión:** 0.1 · **Fecha:** 2026-10-15

Los schemas viven en código y son la fuente de verdad; este documento los explica. Si hay diferencia, manda el código:

- `packages/core/src/schemas/` — `BaseItemSchema`, `SiteConfigSchema`, `BrandingSchema`
- `packages/core/src/checkout/checkout.ts` — `CheckoutRequestSchema`, `Order`
- `packages/module-ropa/src/schemas.ts` — `ApparelProductSchema`, `CatalogSchema`

## Montos

Todos los montos son **enteros** en la unidad mínima de la moneda configurada. Para ARS el MVP usa pesos sin centavos (`fractionDigits: 0`), como se publican los precios. Nunca se usan decimales de punto flotante para dinero.

## Producto de ropa (`products.json`)

Cada elemento del array es un producto:

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | string | Único en el catálogo |
| `slug` | string | Único; minúsculas y guiones. Es la URL: `/producto/<slug>` |
| `name` | string | |
| `category` | slug | Tiene que existir en `site.json → categories` |
| `garment` | enum | `remera`, `camisa`, `buzo`, `sweater`, `campera`, `pantalon`, `vestido`, `pollera`. Define la ilustración |
| `description` | string | |
| `price` | entero > 0 | |
| `compareAtPrice` | entero o `null` | Precio anterior. Si es mayor que `price`, se muestra como oferta |
| `fit` | string | "Regular", "Oversize", "Slim"… |
| `material` | string | |
| `care` | string[] | Al menos una instrucción |
| `sizeChart` | enum | `superior`, `inferior` o `vestido`: qué tabla de medidas mostrar |
| `tags` | string[] | Se usan en la búsqueda |
| `createdAt` | fecha ISO | Ordena "Novedades" |
| `featured` | boolean | Aparece primero en el orden "Destacados" del catálogo y en productos relacionados |
| `unitsSold` | entero ≥ 0 | Unidades vendidas. Ordena el carrusel "Lo más vendido" y las 3 imágenes de cada categoría. Por defecto 0 (no aparece en el carrusel). Las cifras del ejemplo son inventadas |
| `colors` | Color[] | Ver abajo |
| `sizes` | string[] | En el orden en que se muestran |
| `variants` | Variante[] | Una por cada combinación color × talle |

**Color**

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | slug | Único dentro del producto. Va en la URL: `?color=<id>` |
| `name` | string | Nombre comercial: "Índigo", "Gris melange" |
| `hex` | `#RRGGBB` | Color del swatch y de la ilustración |
| `family` | enum | `negro`, `blanco`, `gris`, `azul`, `verde`, `beige`, `marron`, `rojo`, `rosa`. Es lo que filtra |
| `images` | `{src, alt}[]` | Fotos de ese color, relación 4:5. Opcional |

**Variante**

| Campo | Tipo | Notas |
| --- | --- | --- |
| `sku` | string | Único en todo el catálogo; mayúsculas, números y guiones |
| `color` | slug | Debe existir en `colors` |
| `size` | string | Debe existir en `sizes` |
| `stock` | entero ≥ 0 | 0 = agotado (se muestra tachado) |

**Reglas que valida el schema** (y que hacen fallar el build si no se cumplen):
- Cada combinación color × talle existe exactamente una vez. Si una combinación no se fabrica, se carga con `stock: 0`; así la grilla de talles es igual para todos los colores.
- `id`, `slug` y `sku` no se repiten en el catálogo.
- La categoría de cada producto existe en `site.json`.

Convención de SKU usada en el ejemplo: `TR-<modelo>-<color>-<talle>`, por ejemplo `TR-PAN01-IND-40`. Es solo una convención; el schema no la exige.

## Configuración de la tienda (`site.json`)

| Bloque | Qué define |
| --- | --- |
| `branding` | Nombre, tagline, texto del logo, 13 tokens de color, fuentes (con URL de hoja de estilos opcional) y radios. Cubre todos los tokens del [design system](05-design-system.md) |
| `seo` | Título y descripción por defecto (máx. 170 caracteres) |
| `hero` | Título, texto y botón del inicio |
| `announcement` | Barra superior opcional |
| `categories` | `slug`, nombre y descripción. El orden es el del menú |
| `shipping.options` | `id`, nombre, descripción, `price` y `requiresAddress` |
| `shipping.freeShippingThreshold` | Subtotal desde el que el envío a domicilio es gratis, o `null` |
| `returnsPolicy` | Texto de cambios |
| `contact` | Email, WhatsApp (formato internacional sin `+`), dirección, Instagram |
| `payment` | Proveedor (`manual`), `methods` (formas de pago con `id`, `label` y `description`, se muestran en inicio, checkout y ayuda) e `instructions` (qué pasa después de confirmar) |
| `currency` | Código ISO, locale y decimales |

## Carrito (navegador)

Se guarda en `localStorage` bajo `pw:cart:v1`. Cada línea es un SKU con cantidad, precio al momento de agregar, tope de stock y un `meta` libre (en ropa: id de color, hex, tipo de prenda, foto). El precio guardado es solo para mostrar; el servidor lo recalcula al confirmar. Si lo guardado está corrupto, se descarta y la bolsa arranca vacía.

## Pedido

`buildOrder` devuelve:

```ts
interface Order {
  id: string;              // 6 caracteres sin 0/O/1/I, fácil de dictar
  createdAt: string;       // ISO
  status: "pendiente-de-pago";
  customer: { fullName; email; phone };
  shipping: { optionId; label; cost; address | null };
  notes: string;
  lines: { sku; itemId; slug; name; variantLabel; unitPrice; quantity; lineTotal }[];
  subtotal: number;
  total: number;
}
```

En el MVP el pedido no se guarda en el servidor: se registra en el log y el navegador conserva una copia (`pw:orders:v1`, últimos 20) para mostrar la confirmación. Persistirlo es la primera tarea de la fase 1.
