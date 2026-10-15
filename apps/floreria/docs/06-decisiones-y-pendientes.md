# 06 · Decisiones y pendientes

Versión 0.1 · 2026-10-15

## Decisiones

**D-01 Pedido por WhatsApp en lugar de pago online.** Es como ya vende una florería de barrio, no requiere cuenta de Mercado Pago ni backend, y permite confirmar disponibilidad (las flores cambian día a día) antes de cobrar. Costo: el pedido no queda registrado en ningún sistema, solo en el chat.

**D-02 Sitio estático.** Sin servidor ni base de datos: hosting gratis, nada que mantener ni que se caiga. Costo: cambiar un precio requiere rebuild y deploy (segundos en Vercel/Netlify con deploy automático desde git).

**D-03 Contenido en JSON validado con Zod.** Mismo criterio que el resto de la plataforma: no construir panel de administración hasta que un cliente real lo justifique. El build falla ante datos inválidos en vez de publicar una página rota.

**D-04 Carrusel propio sobre `scroll-snap`.** Evita una dependencia (Swiper, Embla) para un caso simple. El deslizamiento táctil es el nativo del navegador. Si en el futuro se necesitan efectos (fade, loop infinito en mini slides), reevaluar Embla.

**D-05 Imágenes sin optimizar en build.** `next/image` necesita servidor para optimizar; con export estático se sirve el archivo tal cual. Las fotos se suben ya redimensionadas (ver guía 05).

**D-06 App independiente en `apps/floreria`.** Primera vertical con código en el repo. No se extrajo `core` todavía: se hará con la segunda vertical, cuando se vea qué se repite de verdad.

## Pendientes

Lo que necesita el local para salir a producción:

- Fotos reales del local y de cada producto.
- Nombre real, número de WhatsApp, dirección, horarios e Instagram.
- Catálogo real con precios.
- Política de envíos (zonas y costos) para el texto de `deliveryNote`.
- Dominio y hosting (Vercel o Netlify sirven tal cual).

Mejoras candidatas, en orden sugerido:

1. **Medir** con Lighthouse en el deploy con fotos reales, contra los objetivos de [03](03-arquitectura.md#rendimiento).
2. **Variantes de tamaño** (chico / mediano / grande) por producto, reutilizando la idea de `VariantSelector` de la plataforma.
3. **Mercado Pago** (Checkout Pro) cuando el volumen de pedidos justifique cobrar online. Requiere backend mínimo para crear la preferencia de pago.
4. **Costo de envío por zona** calculado en el carrito.
5. **Tests unitarios** de `cart.ts` y `whatsapp.ts` (son funciones puras, el costo es bajo).
