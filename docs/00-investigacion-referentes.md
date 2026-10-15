# 00 — Investigación de referentes

**Versión:** 0.1 · **Fecha:** 2026-10-15

Antes de diseñar se revisaron análisis publicados de tiendas de moda grandes y la investigación de usabilidad de Baymard Institute sobre e-commerce de indumentaria. El objetivo no fue copiar una estética sino tomar decisiones de interacción con respaldo.

> Alcance de esta investigación: se basa en auditorías y estudios publicados (enlazados abajo), no en tests de usuario propios. Cuando haya tráfico real, las decisiones marcadas como "a validar" se confirman con datos de la tienda.

## Qué hacen bien las tiendas de referencia

**Zara** (según la auditoría de UXmatters y críticas de diseño publicadas):
- Grilla de producto limpia, con imagen protagonista y poco texto.
- Bolsa concisa: cambiar cantidad y quitar sin salir de la vista.
- Búsqueda con foco inmediato y resultados en la misma página.

**Uniqlo, COS, Everlane** (patrones observables y comunes en el rubro):
- Navegación por categorías de prenda, no por colecciones abstractas.
- Ficha con selector de color visual (swatches) y talles como botones.
- Información de material y cuidado a un clic, no escondida.

## Qué hacen mal (y evitamos)

La auditoría de Zara documenta problemas concretos que el MVP evita a propósito:

| Problema observado | Decisión en el MVP |
| --- | --- |
| Slider en el inicio que distrae y carga cognitivamente | Hero estático con un solo mensaje y un solo botón |
| Los colores disponibles no se ven en el listado | Puntos de color en cada tarjeta, atenuados si el color está agotado |
| Sin opciones de orden por precio o novedad | Orden por destacados, novedades, menor y mayor precio |
| Botón de filtros chico y difícil de ver | Filtros siempre visibles en escritorio; en mobile, botón ancho con contador |
| Talles escondidos en un acordeón en la ficha | Talles como botones visibles bajo el color |
| Íconos ambiguos (un "+" que parece agregar al carrito) | Botones con texto que dice lo que hacen |
| Checkout sin botón de volver | Desde el checkout siempre se puede ir a la bolsa y al resto de la tienda |

## Recomendaciones de Baymard aplicadas

1. **Talles como botones, no desplegable.** Los desplegables ocultan opciones y se pasan por alto. → `VariantSelector` con radios estilizados.
2. **Estado seleccionado con contraste alto.** Indicadores sutiles (un anillo tenue) hacían dudar a los usuarios. → Talle elegido en negro sólido con texto blanco.
3. **Mostrar la disponibilidad por talle.** Descubrir tarde que no hay tu talle frustra. → Talles sin stock visibles pero tachados, por color.
4. **No preseleccionar talle.** Evita compras en un talle que nadie eligió. → Sin talle por defecto; si se intenta agregar, aviso y foco en el selector.
5. **Filtro de talle arriba y abierto.** En el estudio, un 39 % de los participantes descubrió recién en la ficha que el producto no estaba en su talle. → Talle es el primer grupo de filtros, abierto, como grilla de botones.
6. **Búsquedas de categoría llevan a la categoría.** Buscar "camperas" debería mostrar la categoría con sus filtros. → `/buscar` redirige a `/tienda/camperas` cuando el texto coincide con una categoría.
7. **Guía de talles junto al selector**, con medidas y cómo medirse. → Diálogo "Guía de talles" al lado de la leyenda del talle.
8. **Fotos con modelo real.** Mejor que maniquí o fondo neutro. → El modelo de datos soporta fotos por color; mientras no existan se dibuja una ilustración (ver [pendientes](07-pendientes.md)).

## Checkout

- **Compra como invitado.** Obligar a crear cuenta es una de las causas de abandono más citadas en los estudios de checkout de Baymard. → No hay cuentas en el MVP; se piden solo nombre, email, teléfono y, si hay envío, dirección.
- **Costo de envío visible antes de confirmar.** → Cada opción muestra su costo; el resumen se actualiza al elegir, y se avisa cuánto falta para el envío gratis desde la bolsa.
- **Errores junto al campo y en lenguaje concreto.** → Mensajes como "El código postal tiene 4 dígitos o el formato C1425ABC", foco al primer error, y el error desaparece al corregir el campo.

## Pendiente de validar con datos reales

- Si los clientes usan el filtro de color por familia ("Azul") o preferirían el nombre exacto ("Índigo").
- Si conviene mostrar "Quedan N" desde 3 unidades o desde otro umbral.
- Si el umbral de envío gratis mueve el ticket promedio.

## Fuentes

- [Usability audit of the Zara web site — UXmatters](https://www.uxmatters.com/mt/archives/2023/09/usability-audit-of-the-zara-web-site.php)
- [Design Critique: Zara Website — Pratt IXD](https://ixd.prattsi.org/2023/09/design-critique-zara-website/)
- [5 apparel UX best practices — Baymard](https://baymard.com/blog/apparel-5-best-practices)
- [Use buttons for size selection — Baymard](https://baymard.com/blog/use-buttons-for-size-selection)
- [Put the size filter near the top — Baymard](https://baymard.com/blog/apparel-put-size-filter-near-top-and-expand-for-sidebar-filtering)
- [Ecommerce filter UI best practices — Baymard](https://baymard.com/blog/ecommerce-filter-ui)
- [How forcing sign-ups drives down sales (serie Baymard) — Amazon Pay](https://pay.amazon.com/blog/the-baymard-report-series-how-forcing-sign-ups-drives-down-sales)
