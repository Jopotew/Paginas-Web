# 07 — Qué falta definir para salir a producción

**Versión:** 0.1 · **Fecha:** 2026-10-15

El MVP funciona con una marca y datos de ejemplo. Para convertirlo en la tienda de un cliente real hace falta lo siguiente. Lo que está marcado como **bloqueante** impide publicar.

## Contenido de la marca

- [ ] **Bloqueante — Fotos de producto.** Una por color como mínimo, relación 4:5, idealmente con modelo (es la recomendación más fuerte de la investigación). Se cargan en `colors[].images`.
- [ ] **Bloqueante — Catálogo real:** nombres, descripciones, precios, materiales, cuidados, talles y stock por variante.
- [ ] **Bloqueante — Tablas de medidas reales** por tipo de prenda (hoy son de referencia, en `packages/module-ropa/src/sizeGuides.ts`).
- [ ] Nombre, logo, colores y tipografías de la marca (`site.json → branding`).
- [ ] Textos del inicio y descripciones de categorías.

## Datos comerciales

- [ ] **Bloqueante — WhatsApp y email reales** (`site.json → contact`). Hoy hay un número de ejemplo.
- [ ] **Bloqueante — Costos de envío** por zona, tiempos de entrega y umbral de envío gratis.
- [ ] Política de cambios y devoluciones definitiva.
- [ ] Dirección y horario del local, si hay retiro.
- [ ] Datos legales para el pie: razón social, CUIT, y el botón de arrepentimiento si corresponde (consultar con un contador o abogado; no es asesoramiento legal).

## Infraestructura

- [ ] **Bloqueante — Dominio** y `siteUrl` en `site.json`.
- [ ] **Bloqueante — Hosting.** La app es Next.js estándar; corre en Vercel, Netlify o un servidor Node propio.
- [ ] Para la fase 1: cuenta de Mercado Pago del comercio (credenciales de producción y de prueba) y base de datos.

## Decisiones abiertas

- ¿Los pedidos llegan por WhatsApp, por email o por los dos?
- ¿Se reserva stock al confirmar el pedido o recién al pagar?
- ¿Hay precios distintos por transferencia (descuento) o por cuotas?
