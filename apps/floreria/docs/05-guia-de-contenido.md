# 05 · Guía de contenido

Versión 0.1 · 2026-10-15

Para quien mantiene el sitio. No hace falta tocar código.

## Reemplazar las imágenes provisorias por fotos

Las imágenes actuales son ilustraciones generadas por `scripts/generate-placeholders.ts` y dicen "Imagen provisoria".

1. Prepará la foto:
   - Productos: vertical 4:5, **800 × 1000 px**.
   - Portada: horizontal 16:9, **1600 × 900 px**.
   - Formato JPG o WebP, idealmente menos de 200 KB (portada) y 120 KB (productos). Squoosh.app sirve para esto.
2. Guardala en `public/img/productos/` o `public/img/hero/` con un nombre en minúsculas y guiones: `rosas-rojas-12.jpg`.
3. En el JSON correspondiente, cambiá `src`, y si el tamaño no es el recomendado, `width` y `height`. Revisá que `alt` describa la foto real.
4. Corré `npm run validate`.
5. Borrá el `.svg` viejo si ya no se usa.

## Cambiar un precio

En `content/products.json`, cambiá `price`. Número entero, sin puntos: `45000`, no `45.000`.

## Agregar un producto

Copiá un bloque existente en `content/products.json`, cambiá `id` (único, en minúsculas y guiones), `name`, `categoryId`, `price`, `description` e `image`.

## Ocultar un producto sin borrarlo

`"available": false`.

## Agregar un tipo de flor

Agregá una entrada en `content/categories.json` con `id`, `name`, `description` y `order`. Aparece cuando tenga al menos un producto disponible, con su propio mini slide y acceso en el menú.

## Cambiar los slides de portada

`content/hero.json`. El primer slide es el más importante: es lo primero que se ve y su foto define cuánto tarda en cargar la página.

## Cambiar WhatsApp, dirección u horarios

`content/store.json`.

## Antes de publicar

```bash
npm run validate
npm run build
```

Si algo está mal, el mensaje dice en qué archivo y en qué campo.
