# 02 — Requisitos

**Versión:** 0.1 · **Fecha:** 2026-10-15

Estado: ✅ implementado en el MVP · ⏳ planificado (ver roadmap)

## Requisitos funcionales

### Catálogo

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-01 | Listar productos por categoría en rutas propias (`/tienda/<categoria>`) | ✅ |
| RF-02 | Filtrar por talle, color (familia), rango de precio y "solo con descuento" | ✅ |
| RF-03 | Talle y color se evalúan sobre la misma variante con stock (filtrar "M" + "azul" no muestra prendas que solo tienen M en negro) | ✅ |
| RF-04 | Ofrecer solo talles que tengan stock dentro de la categoría | ✅ |
| RF-05 | Ordenar por destacados, novedades, menor y mayor precio | ✅ |
| RF-06 | Los filtros viven en la URL: se pueden compartir y funcionan sin JavaScript | ✅ |
| RF-07 | Buscar por texto sin importar tildes ni plural; si el texto es una categoría, ir a la categoría | ✅ |
| RF-08 | Mostrar los colores de cada producto en la tarjeta, atenuando los agotados | ✅ |
| RF-09 | Inicio: carrusel "Lo más vendido" ordenado por unidades vendidas, sin tope de cantidad (crece con cada producto que suma ventas), sin productos agotados | ✅ |
| RF-09b | Inicio: cada categoría muestra imágenes de sus 3 productos más vendidos con stock | ✅ |

### Ficha de producto

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-10 | Elegir color; la imagen y la disponibilidad de talles se actualizan; el color queda en la URL | ✅ |
| RF-11 | Talles como botones; los agotados se ven tachados y no se pueden elegir | ✅ |
| RF-12 | No preseleccionar talle; si se intenta agregar sin talle, avisar y llevar el foco al selector | ✅ |
| RF-13 | Avisar "Quedan N" cuando el stock del talle es bajo (≤ 3) | ✅ |
| RF-14 | Guía de talles en centímetros, resaltando el talle elegido | ✅ |
| RF-15 | Material, cuidado, envíos y cambios a un clic | ✅ |
| RF-16 | Productos relacionados | ✅ |

### Bolsa

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-20 | Agregar una variante (SKU); si ya está, sumar cantidad | ✅ |
| RF-21 | No permitir cantidad mayor al stock conocido | ✅ |
| RF-22 | Persistir en el navegador y sincronizar entre pestañas | ✅ |
| RF-23 | Mostrar cuánto falta para el envío gratis | ✅ |

### Checkout y pedido

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-30 | Comprar sin crear cuenta | ✅ |
| RF-31 | Elegir retiro o envío; pedir dirección solo si el envío la requiere | ✅ |
| RF-32 | Recalcular precios y validar stock en el servidor | ✅ |
| RF-33 | Mostrar errores por campo, con foco en el primero, y limpiarlos al corregir | ✅ |
| RF-34 | Confirmación con número de pedido legible y link para enviarlo por WhatsApp | ✅ |
| RF-34b | Informar las formas de pago (link de Mercado Pago o efectivo en el local con 10 días de reserva) en inicio, checkout, confirmación y ayuda, desde `site.json` | ✅ |
| RF-35 | Persistir el pedido en el servidor y descontar stock | ⏳ Fase 1 |
| RF-36 | Generar el link de Mercado Pago automáticamente y actualizar el pedido al pagarse | ⏳ Fase 1 |
| RF-38 | Calcular "Lo más vendido" desde los pedidos en lugar de cargarlo a mano | ⏳ Fase 1 |
| RF-37 | Email de confirmación automático | ⏳ Fase 1 |

### Gestión (paneles)

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-40 | Panel de administrador: usuarios, ABM de productos, pedidos, exportación PDF/Excel, configuración | ⏳ Fase 2 |
| RF-41 | Panel de empleado: solo ABM de productos | ⏳ Fase 2 |

## Requisitos no funcionales

| ID | Requisito | Cómo se verifica |
| --- | --- | --- |
| RNF-01 | TypeScript estricto en todo el código (`strict`, `noUncheckedIndexedAccess`) | `npm run typecheck` |
| RNF-02 | El contenido se valida con Zod; un JSON inválido rompe el build con un mensaje claro | `npm run validate:content` y `next build` |
| RNF-03 | Las server actions validan toda entrada; nunca se confía en precios del cliente | Tests de `buildOrder` |
| RNF-04 | Accesibilidad: navegación por teclado, foco visible, diálogos nativos, controles de formulario con etiqueta, `prefers-reduced-motion` | Revisión manual; auditoría automática pendiente (ver roadmap) |
| RNF-05 | Responsive desde 360 px | Recorrido automatizado en 390 px y 1366 px |
| RNF-06 | Cambiar de marca sin tocar código | Todo el branding sale de `site.json` |
| RNF-07 | Rendimiento: medir antes de optimizar. Línea base y objetivos en [arquitectura § Rendimiento](03-arquitectura.md#rendimiento) | Medición documentada |
