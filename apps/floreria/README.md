# Florería — MVP

Tienda online para una florería de barrio: portada con slide de imágenes del local y de flores, catálogo con un mini slide por tipo de flor, carrito y pedido por WhatsApp.

Hecha con Next.js 16 (App Router), React 19, TypeScript estricto y Zod. Se publica como sitio estático: no necesita servidor ni base de datos.

## Requisitos

- Node.js 22.6 o superior (los scripts de `scripts/` usan `--experimental-strip-types`).

## Uso

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
npm run validate     # valida content/*.json y que existan las imágenes
npm run build        # genera el sitio estático en out/
npm run start        # sirve out/ localmente
npm run lint
npm run typecheck
```

## Estructura

```
content/            Datos del sitio (JSON editable a mano)
  store.json        Nombre, WhatsApp, dirección, horarios
  hero.json         Slides de la portada
  categories.json   Tipos de flores (cada uno es un mini slide)
  products.json     Productos
public/img/         Imágenes (hoy: ilustraciones provisorias)
scripts/            Validación de contenido y generador de placeholders
src/app/            Layout, página y estilos globales (tokens de diseño)
src/components/     Carrusel, secciones, carrito
src/lib/            Schemas Zod, carga de contenido, lógica de carrito y WhatsApp
docs/               Documentación del proyecto
```

## Documentación

1. [Visión y alcance](docs/01-vision-y-alcance.md)
2. [Requerimientos](docs/02-requerimientos.md)
3. [Arquitectura](docs/03-arquitectura.md)
4. [Modelo de datos](docs/04-modelo-de-datos.md)
5. [Guía de contenido](docs/05-guia-de-contenido.md): cómo cambiar fotos, productos y precios
6. [Decisiones y pendientes](docs/06-decisiones-y-pendientes.md)
