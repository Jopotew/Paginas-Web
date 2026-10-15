import type { Order } from "@pw/core";

/**
 * Copia local de los pedidos hechos desde este navegador, para mostrar la
 * confirmación y el link de WhatsApp. No es el registro oficial del pedido.
 */
const KEY = "pw:orders:v1";
const MAX_ORDERS = 20;

export function saveOrder(order: Order): void {
  try {
    const all = readAll();
    all[order.id] = order;
    const trimmed = Object.values(all)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, MAX_ORDERS);
    window.localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(trimmed.map((o) => [o.id, o]))));
  } catch {
    // Sin storage: la página de confirmación mostrará el aviso de "no encontrado".
  }
}

export function loadOrder(id: string): Order | null {
  return readAll()[id] ?? null;
}

function readAll(): Record<string, Order> {
  try {
    const raw = window.localStorage.getItem(KEY);
    const data: unknown = raw ? JSON.parse(raw) : {};
    return data && typeof data === "object" ? (data as Record<string, Order>) : {};
  } catch {
    return {};
  }
}
