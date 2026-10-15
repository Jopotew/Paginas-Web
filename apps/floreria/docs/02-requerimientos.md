# 02 · Requerimientos

Versión 0.1 · 2026-10-15

## Funcionales

**RF-01 Slide de portada.** La portada muestra un carrusel a todo el ancho con imágenes del local y de flores. Cada slide tiene título, texto opcional y botón opcional que lleva a una sección. Avanza solo cada 6 segundos.

**RF-02 Mini slides por tipo de flor.** Cada categoría (ramos, rosas, tulipanes, girasoles, plantas) tiene su sección con nombre, descripción y un carrusel de productos con varios visibles a la vez y flechas.

**RF-03 Producto.** Cada producto muestra foto (proporción 4:5), nombre, precio en pesos, descripción y botón "Agregar al pedido".

**RF-04 Carrito.** El cliente puede agregar, sumar, restar y quitar productos. Ve el total. El carrito se conserva al recargar la página. Si un producto deja de existir en el catálogo, se descarta del carrito guardado.

**RF-05 Pedido por WhatsApp.** El carrito pide nombre (obligatorio), envío o retiro, dirección (obligatoria si es envío), fecha y mensaje de tarjeta (opcionales). Al enviar, se abre WhatsApp con el pedido escrito para el número del local.

**RF-06 Información del local.** Dirección con enlace a mapas, horarios, enlace a WhatsApp e Instagram.

**RF-07 Navegación.** El encabezado queda fijo y tiene accesos directos a cada tipo de flor y al carrito.

**RF-08 Contenido editable.** Todo el contenido (textos, precios, imágenes, slides) sale de archivos JSON. Si un archivo es inválido, el build falla con un mensaje que indica qué corregir.

## No funcionales

**RNF-01 Mobile primero.** Funciona desde 320 px de ancho sin desplazamiento horizontal de la página.

**RNF-02 Accesibilidad.**
- Carruseles operables con teclado (flechas izquierda/derecha) y con botones de 44 px como mínimo.
- El slide de portada se puede pausar, y no avanza solo si el usuario tiene activado "reducir movimiento", ni mientras el mouse o el foco están sobre él.
- Imágenes con texto alternativo obligatorio (lo exige el schema).
- Foco visible en todos los elementos interactivos.

**RNF-03 Rendimiento.** Ver objetivos en [03 · Arquitectura](03-arquitectura.md#rendimiento). Ninguno está medido todavía en un deploy real.

**RNF-04 Costo de hosting.** Sitio estático, sin servidor.

**RNF-05 Sin dependencias pesadas.** El carrusel y el carrito están hechos sin librerías externas.
