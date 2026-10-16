# 05 — Design system

**Versión:** 0.1 · **Fecha:** 2026-10-15

## Dirección visual

Serif editorial para títulos y sans utilitaria para todo lo demás, acento azul denim, imágenes de producto en 4:5. La tienda tiene un solo gesto fuerte: el panel del inicio con textura de tejido (trama sobre urdimbre en azul denim) donde se apoyan tres prendas. El resto de la interfaz queda quieta y ordenada para que el producto sea lo que se mira.

Principios:
- **El producto manda.** Fondos neutros fríos, sin degradados ni sombras decorativas en la grilla.
- **Estados inequívocos.** Seleccionado = sólido y de alto contraste; agotado = tachado y atenuado, pero visible.
- **Texto que dice lo que pasa.** Botones con verbo ("Agregar a la bolsa", "Confirmar pedido"), errores que explican cómo corregir.
- **Un solo movimiento no pedido**: la entrada escalonada de las prendas del hero. El resto de la animación responde a acciones (abrir la bolsa). Todo se desactiva con `prefers-reduced-motion`.

## Tokens de color

Se definen en `site.json → branding.colors` y llegan al CSS como `--color-*`.

| Token | Valor (Trama) | Uso |
| --- | --- | --- |
| `background` | `#FFFFFF` | Fondo de página |
| `surface` | `#F4F5F6` | Fondo de imágenes, resúmenes, footer |
| `surfaceSunken` | `#E9ECEF` | Barras de progreso, botones deshabilitados |
| `text` | `#1D2127` | Texto y estados seleccionados |
| `textMuted` | `#5E656D` | Texto secundario |
| `border` | `#D9DDE1` | Bordes y separadores |
| `accent` | `#2F4A6D` | Azul denim: botón principal, hero |
| `accentHover` | `#233A57` | Hover del principal |
| `accentContrast` | `#FFFFFF` | Texto sobre acento |
| `accentSoft` | `#E4EAF1` | Barra de anuncios, filtros activos |
| `sale` | `#A6291F` | Precio rebajado, errores, stock bajo |
| `success` | `#2E6A47` | Confirmación del pedido |
| `focus` | `#4C7BC4` | Anillo de foco |

## Tipografía

| Rol | Familia | Uso |
| --- | --- | --- |
| Display | Newsreader 400/500 (fallback Georgia) | Logo, hero, títulos de página y sección, nombres de categoría |
| Texto | Public Sans 400/500/600 (fallback system-ui) | Todo lo demás, incluidos los nombres de producto en las tarjetas |

Escala: 13 · 16 · 18 · 22 · 28 · 28–40 (fluido) · 42–76 px (hero, fluido). Interlineado 1,55 en texto y 1,02 a 1,15 en títulos.

## Espaciado, radios y layout

- Escala de espaciado: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 px (`--space-1` a `--space-8`).
- Radios desde `branding.radius`: controles 2 px, superficies 4 px. Casi rectos, a propósito: es ropa, no una app.
- Contenedor máximo 1320 px; margen lateral 16 px en mobile y 32 px desde 768 px.
- Grilla de producto: 2 columnas en mobile, 3 desde 700 px, 4 desde 1100 px (3 en el catálogo con barra lateral).
- Controles táctiles de al menos 44 px.

## Componentes

**Core** (genéricos, `components/core`): `SiteHeader`, `SiteFooter`, `CartProvider`, `CartButton`, `CartDrawer`, `CartLines`, `CartPageView`, `FreeShippingNote`, `Price`, `SortSelect`, `VariantSelector`, `CheckoutForm`, `OrderConfirmation`.

`Slider` (carrusel genérico, en core porque sirve para cualquier lista de productos).

**Ropa** (`components/ropa`): `GarmentArt`, `ProductMedia`, `ProductCard` / `ProductGrid`, `FilterPanel`, `FilterToggle`, `ProductView`, `SizeGuideDialog`.

Notas de los componentes clave:

- **`VariantSelector`** — radios nativos estilizados (teclado con flechas y anuncio de estado gratis). Dos variantes: `button` (talles, grilla) y `swatch` (colores, círculos de 32 px con anillo al seleccionar). Opciones sin stock: en `button` quedan deshabilitadas y tachadas; en `swatch` se pueden elegir (para ver la prenda) pero se atenúan y el botón principal indica "Sin stock en …".
- **`CartDrawer` y `SizeGuideDialog`** — `<dialog>` nativo con `showModal()`: foco atrapado, Escape y fondo inerte sin librerías. Clic en el fondo cierra.
- **`Slider`** — scroll horizontal nativo con snap, sin autoplay. Se ven 2,2 ítems en mobile, 3 desde 700 px y 4 desde 1100 px. Botones anterior/siguiente desde 700 px, que se deshabilitan en los extremos y desaparecen si todo entra; en touch se desliza con el dedo. Recibe los `<li>` ya renderizados en el servidor, así que solo agrega la lógica de los botones al JS.
- **Índice de categorías** — cada fila lleva nombre, descripción, cantidad de modelos y las 3 más vendidas de la categoría como miniaturas 4:5 decorativas (toda la fila es un solo link).
- **`FilterPanel`** — cada opción es un link. Orden: talle (grilla abierta), color, precio y descuento, categoría.
- **`GarmentArt`** — SVG 400×500 por tipo de prenda, relleno con el hex del color y fondo con ese color mezclado al 14 % sobre `surface`.

## Accesibilidad

- Link "Saltar al contenido", foco visible con `--color-focus`.
- Todos los campos con `<label>`; errores enlazados con `aria-describedby` y `aria-invalid`.
- Contador de resultados con `aria-live`; mensajes de stock y error en la ficha también.
- Precio tachado anunciado como "Antes $…".
- Pendiente: auditoría automatizada (axe) y revisión con lector de pantalla real.
