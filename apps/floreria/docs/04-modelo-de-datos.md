# 04 · Modelo de datos

Versión 0.1 · 2026-10-15

Fuente de verdad: `src/lib/schema.ts`. Este documento la resume.

## Image

Usada por slides y productos.

- `src`: ruta dentro de `public/`, empieza con `/` (ej: `/img/productos/rosas.jpg`).
- `alt`: descripción para lectores de pantalla, mínimo 3 caracteres.
- `width`, `height`: tamaño real del archivo en píxeles. Evitan saltos de diseño mientras carga.

## Store (`content/store.json`)

- `name`, `tagline`, `description`: textos del local. `description` también se usa para buscadores.
- `whatsapp`: número internacional, solo dígitos. Argentina celular: `549` + área sin 0 + número sin 15. Ej: `5491123456789`.
- `instagram` (opcional): usuario sin @.
- `address`, `mapsUrl` (opcional).
- `hours`: lista de `{ days, time }`.
- `deliveryNote`: texto sobre envíos que se muestra en el carrito.
- `currency`: por ahora solo `"ARS"`.

## HeroSlide (`content/hero.json`)

Lista con al menos un elemento.

- `id`: slug único.
- `title`, `text` (opcional).
- `image`: Image. Proporción recomendada 16:9.
- `cta` (opcional): `{ label, href }`. `href` suele ser un ancla a una categoría (`#rosas`) o `#como-pedir`.

## Category (`content/categories.json`)

- `id`: slug. Es también el ancla de la sección (`#rosas`).
- `name`, `description`.
- `order`: número; las categorías se muestran de menor a mayor.

Una categoría sin productos disponibles no se muestra.

## Product (`content/products.json`)

- `id`: slug único.
- `name`, `description`.
- `categoryId`: debe coincidir con el `id` de una categoría.
- `price`: entero en pesos, sin puntos ni decimales (`45000`).
- `image`: Image. Proporción 4:5.
- `available`: `false` lo oculta sin borrarlo. Por defecto `true`.

## Reglas que se validan además del schema

- Cada `categoryId` existe en `categories.json`.
- No hay ids de producto repetidos.
- `npm run validate` además verifica que cada imagen referenciada exista en `public/`.

## Carrito (navegador)

Clave `floreria.cart.v1` en `localStorage`. Guarda `{ lines: [{ id, name, price, image, qty }] }`. Al cargar, se descartan líneas con forma inválida o con productos que ya no están en el catálogo. Si se cambia la forma de este objeto, subir la versión de la clave.
