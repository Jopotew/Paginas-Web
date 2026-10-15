# Páginas Web — plataforma de tiendas personalizables

Plataforma modular para generar tiendas online independientes por cliente a partir de un núcleo común. Cada rubro (vertical) es un módulo; cada cliente es un deploy con su propio contenido y branding.

**Vertical activo: Ropa.** El MVP es una tienda de indumentaria completa (catálogo, filtros, ficha de producto, bolsa y checkout) con una marca de ejemplo, *Trama*. No incluye pasarela de pago todavía: el pedido se confirma y el pago se coordina por WhatsApp o email (ver [roadmap](docs/06-roadmap.md)).

## Requisitos

- Node.js 20.9 o superior (probado con 22)
- pnpm 10 (`corepack enable` lo instala)

## Cómo correrlo

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Otros comandos, desde la raíz:

| Comando | Qué hace |
| --- | --- |
| `pnpm build` | Build de producción de la tienda |
| `pnpm start` | Sirve el build de producción |
| `pnpm test` | Tests unitarios de `core`, `ropa` y validación del contenido |
| `pnpm typecheck` | `tsc` en todos los paquetes |
| `pnpm validate:content` | Valida `content/*.json` contra los schemas |
| `pnpm check` | Las tres verificaciones anteriores juntas |

## Estructura

```
packages/
  core/            Lógica agnóstica de rubro: contratos de datos, branding, dinero,
                   carrito, catálogo (orden y búsqueda), checkout y pagos. Sin React.
  module-ropa/     Lo específico de indumentaria: variantes color × talle,
                   familias de color, filtros por facetas, guías de talles.
apps/
  tienda-ropa/     App Next.js (App Router) que arma la tienda con core + ropa.
    content/       site.json (marca, categorías, envíos, contacto) y products.json.
    src/components/core   Componentes reutilizables por cualquier vertical.
    src/components/ropa   Componentes que solo tienen sentido en ropa.
docs/              Investigación, visión, requisitos, arquitectura, datos,
                   design system y roadmap.
```

## Cambiar de marca o de catálogo

Todo lo que distingue a un cliente está en `apps/tienda-ropa/content/`:

- **`site.json`**: nombre, colores, tipografías, textos del inicio, categorías, opciones de envío, política de cambios, contacto e instrucciones de pago.
- **`products.json`**: productos con sus colores, talles y stock por variante.

Después de editar, `pnpm validate:content` dice exactamente qué campo está mal. El build también falla si el contenido no es válido, así que un error de tipeo nunca llega a producción. El detalle de cada campo está en [docs/04-modelo-de-datos.md](docs/04-modelo-de-datos.md).

## Documentación

0. [Investigación de referentes](docs/00-investigacion-referentes.md)
1. [Visión y alcance](docs/01-vision-y-alcance.md)
2. [Requisitos](docs/02-requisitos.md)
3. [Arquitectura](docs/03-arquitectura.md)
4. [Modelo de datos](docs/04-modelo-de-datos.md)
5. [Design system](docs/05-design-system.md)
6. [Roadmap](docs/06-roadmap.md)
7. [Qué falta definir para salir a producción](docs/07-pendientes.md)
