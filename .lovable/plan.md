
# Fruterías Lya — Web de catálogo y pedidos

Web para Fruterías Lya SL con catálogo de frutas y verduras, carrito y envío de pedidos sin pago online (cobro al recibir/recoger). Estilo fresco con verdes y colores vivos de fruta.

## Páginas
- **Inicio (/)** — Hero con propuesta ("Fruta y verdura fresca cada día en Getafe y Móstoles"), productos destacados, banner de oferta semanal, zonas de reparto, CTA al catálogo y a WhatsApp.
- **Tienda (/tienda)** — Catálogo con filtros por categoría (Frutas, Verduras, Ofertas), buscador, tarjetas de producto con precio por kg/unidad, botón "Añadir al carrito".
- **Ofertas (/ofertas)** — Cesta semanal y promociones destacadas.
- **Contacto (/contacto)** — Teléfono 674559853, email, Instagram @fruteriaslyamarket, horario 9:00–21:00, dos tarjetas con direcciones (Calle Cataluña 1, Getafe / Calle Joaquín Blume 23, Móstoles) y mapas embebidos.

## Carrito y checkout (sin pago online)
- Carrito persistente (lateral/drawer) accesible desde toda la web.
- Checkout en una página: datos del cliente (nombre, teléfono, email, dirección), zona de reparto, franja horaria preferida, notas, método de pago al recibir (efectivo / tarjeta en reparto).
- Al confirmar: el pedido se guarda en la base de datos y se envía email de confirmación a la frutería y al cliente.
- Botón alternativo "Pedir por WhatsApp" que envía el carrito como mensaje al 674559853.

## Reparto local
- Zonas configurables (Getafe, Móstoles y alrededores) con pedido mínimo y coste de envío opcional.
- Aviso visible en checkout sobre cobertura.

## Panel de administración (/admin, protegido)
- Login simple para gestionar:
  - Productos (alta/edición, precio, categoría, stock disponible sí/no, imagen).
  - Ofertas / Cesta semanal.
  - Pedidos recibidos con estado (Nuevo → Preparando → En reparto → Entregado).

## Diseño
- Paleta: verde fresco principal, acentos en naranja, rojo y amarillo (colores de fruta), fondo claro.
- Tipografía moderna y legible, tarjetas redondeadas, mucho espacio en blanco.
- Mobile-first (la mayoría de pedidos vendrán de móvil).
- Header con logo en texto "Fruterías Lya" + icono de hoja, navegación, icono carrito con contador.
- Footer con datos fiscales (Fruterías Lya SL · B26988139 · Calle Cataluña 1), enlaces, redes y horario.

## Imágenes
- Fotos de stock gratuitas de frutas y verduras para el catálogo inicial; fácilmente reemplazables luego desde el admin.

## SEO
- Cada página con su propio título y descripción optimizados para búsquedas locales ("frutería Getafe", "frutería Móstoles", "reparto fruta a domicilio").

## Datos de contacto integrados
- Teléfono 674559853 (clic para llamar y para WhatsApp)
- Email fruteriaslyamarket@gmail.com
- Instagram @fruteriaslyamarket
- Horario 9:00–21:00
- Dos tiendas físicas con dirección y mapa
