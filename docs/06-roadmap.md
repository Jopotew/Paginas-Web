# 06 — Roadmap

**Versión:** 0.1 · **Fecha:** 2026-10-15

Cada fase entra cuando la anterior está en uso, no antes. El orden responde a lo que falta para vender de verdad.

## Fase 0 — MVP vertical Ropa ✅

Lo que está en la branch `Ropa`: catálogo, filtros, ficha, bolsa, checkout como invitado, confirmación por WhatsApp, branding configurable, SEO básico, tests de la lógica y validación del contenido.

## Fase 1 — Vender online

1. **Persistencia de pedidos.** Base de datos (propuesta: Postgres gestionado, por ejemplo Supabase o Neon) con tablas `orders`, `order_lines` y `stock`. `placeOrder` guarda el pedido y descuenta stock en una transacción.
2. **Mercado Pago (Checkout Pro).** Nueva implementación de `PaymentProvider` que crea una preferencia y devuelve `{ kind: "redirect", url }`. Webhook para actualizar el estado del pedido (`pendiente-de-pago` → `pagado` / `rechazado`). El checkout no cambia: ya recalcula todo en servidor.
3. **Email de confirmación** al cliente y aviso al comercio.
4. **Rate limiting** de la server action de checkout.
5. **Primer deploy y medición real:** Lighthouse y Web Vitals (LCP, INP, CLS) en mobile con red 4G. Con esos números se decide si hace falta optimizar algo (ver [arquitectura § Rendimiento](03-arquitectura.md#rendimiento)).

## Fase 2 — Paneles de gestión

Con la base de datos de la fase 1, los productos pasan del JSON a la DB.

- **Administrador:** usuarios y empleados, ABM de productos con variantes, pedidos con filtro por estado, exportación a PDF y Excel, configuración de la tienda (lo que hoy es `site.json`).
- **Empleado:** solo ABM de productos y stock.
- Autenticación con roles; las rutas `/admin` fuera del bundle de la tienda.
- Subida de fotos por color (almacenamiento de objetos, recorte a 4:5).

## Fase 3 — Experiencia de compra

- Galería con varias fotos por color y zoom.
- Puntaje de calce en reseñas ("chico / justo / grande").
- Aviso de reposición de talle agotado.
- Cuentas de cliente opcionales (historial de pedidos), solo si los comercios lo piden.
- Búsqueda con índice si el catálogo supera algunos miles de productos.

## Fase 4 — Otros verticales

- Extraer `components/core` a `packages/ui`.
- Módulo Gastronomía (opciones y agregados como variantes) y módulo Juegos de mesa (edición, idioma).
- Plantilla para crear un cliente nuevo: copiar `apps/tienda-<vertical>`, editar `content/`, desplegar.
