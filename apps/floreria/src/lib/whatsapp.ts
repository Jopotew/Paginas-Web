import { cartTotal, type CartState } from "./cart";
import { formatPrice } from "./format";

export type OrderDetails = {
  name: string;
  delivery: "retiro" | "envio";
  address: string;
  date: string;
  cardMessage: string;
};

/** Arma el texto del pedido que el cliente envía por WhatsApp. */
export function buildOrderMessage(cart: CartState, d: OrderDetails): string {
  const lines = cart.lines.map((l) => `• ${l.qty} × ${l.name} — ${formatPrice(l.qty * l.price)}`);
  const parts = [
    `Hola, soy ${d.name.trim()}. Quiero hacer este pedido:`,
    "",
    ...lines,
    "",
    `Total productos: ${formatPrice(cartTotal(cart))}`,
    d.delivery === "envio" ? `Envío a: ${d.address.trim()}` : "Lo retiro por el local",
  ];
  if (d.date) parts.push(`Para el día: ${formatDate(d.date)}`);
  if (d.cardMessage.trim()) parts.push(`Mensaje para la tarjeta: "${d.cardMessage.trim()}"`);
  return parts.join("\n");
}

export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function formatDate(iso: string): string {
  const [y, m, day] = iso.split("-");
  return y && m && day ? `${day}/${m}/${y}` : iso;
}
