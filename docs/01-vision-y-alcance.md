# 01 — Visión y alcance

**Versión:** 0.1 · **Fecha:** 2026-10-15 · **Estado:** MVP vertical Ropa implementado

## Problema

Comercios chicos y medianos necesitan una tienda online propia, con su marca, sin pagar una plataforma por suscripción ni depender de un desarrollo a medida por cada cliente.

## Visión

Un núcleo común ("canvas en blanco") del que salen tiendas independientes por rubro. Cambiar de marca es editar contenido y tokens de diseño, no código. Cada rubro aporta solo lo que le es propio: en ropa, talles y colores; en gastronomía, opciones y agregados; en juegos de mesa, ediciones e idiomas.

## Objetivo del MVP

Probar la arquitectura con **un** vertical terminado y bien hecho antes de sumar clientes u otros rubros. El MVP debe permitir a una persona encontrar una prenda en su talle, entender cuánto cuesta con el envío y dejar un pedido confirmado.

## Dentro del alcance (MVP)

- Inicio con presentación de la marca, carrusel de lo más vendido, categorías con sus tres productos más vendidos, novedades y formas de envío, cambio y pago.
- Catálogo por categoría con filtros de talle, color, precio y descuento, orden y búsqueda.
- Ficha de producto con selector de color y talle con stock por variante, guía de talles, material, cuidado, envíos y cambios.
- Bolsa persistente en el navegador (panel lateral y página).
- Checkout como invitado con opciones de envío, envío gratis por umbral y validación en servidor de precios y stock.
- Confirmación del pedido con link para enviarlo por WhatsApp.
- Branding, categorías, envíos, contacto y textos configurables desde `site.json`.
- SEO básico: metadatos por página, sitemap, robots y datos estructurados de producto.

## Fuera del alcance (MVP)

| Excluido | Por qué | Cuándo entra |
| --- | --- | --- |
| Integración con la API de Mercado Pago | Requiere cuenta del comercio, persistencia y webhooks. En el MVP la tienda envía el link de pago a mano, o el cliente paga en efectivo al retirar (con 10 días de reserva) | Fase 1 del roadmap |
| Base de datos y persistencia de pedidos | Sin clientes reales, el JSON alcanza y no tiene costo | Fase 1 |
| Panel de administrador y de empleado | No se construyen herramientas de carga hasta tener a quién dárselas | Fase 2 |
| Cuentas de cliente | El checkout como invitado convierte mejor; las cuentas no son necesarias para comprar | Fase 3, si se pide |
| Otros verticales | Primero se prueba uno completo | Fase 4 |
| Integración con correo/logística | Depende del acuerdo comercial de cada cliente | Por cliente |

## Criterios de éxito del MVP

- Una persona puede ir de la home a un pedido confirmado en mobile y escritorio sin ayuda (verificado con un recorrido automatizado de punta a punta).
- Cambiar nombre, colores y catálogo no requiere tocar código.
- Un JSON con errores no llega a producción: el build falla con un mensaje que señala el campo.
- El checkout nunca confía en precios ni stock enviados por el navegador.
