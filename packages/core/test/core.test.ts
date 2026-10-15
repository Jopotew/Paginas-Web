import { describe, expect, it } from "vitest";
import {
  buildOrder,
  cartItemCount,
  cartReducer,
  cartSubtotal,
  discountPercent,
  EMPTY_CART,
  formatMoney,
  makeOrderId,
  parseStoredCart,
  searchItems,
  shippingCost,
  sortItems,
  type BaseItem,
  type CheckoutContext,
  type ShippingOption,
  type SkuInfo,
} from "../src";

const line = (sku: string, maxQuantity = 5, unitPrice = 1000) => ({
  sku,
  itemId: "i1",
  slug: "s",
  name: "Remera",
  variantLabel: "Negro, talle M",
  unitPrice,
  maxQuantity,
  meta: {},
});

describe("money", () => {
  it("formatea pesos argentinos sin decimales", () => {
    expect(formatMoney(19900).replace(/\s/g, " ")).toBe("$ 19.900");
  });
  it("calcula descuento solo si el precio anterior es mayor", () => {
    expect(discountPercent(24900, 31900)).toBe(21);
    expect(discountPercent(24900, null)).toBeNull();
    expect(discountPercent(24900, 24900)).toBeNull();
  });
});

describe("cartReducer", () => {
  it("agrega y suma cantidades del mismo SKU", () => {
    let s = cartReducer(EMPTY_CART, { type: "add", line: line("A") });
    s = cartReducer(s, { type: "add", line: line("A"), quantity: 2 });
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]!.quantity).toBe(3);
  });
  it("no supera el stock disponible", () => {
    let s = cartReducer(EMPTY_CART, { type: "add", line: line("A", 2), quantity: 5 });
    expect(s.lines[0]!.quantity).toBe(2);
    s = cartReducer(s, { type: "setQuantity", sku: "A", quantity: 9 });
    expect(s.lines[0]!.quantity).toBe(2);
  });
  it("no agrega SKUs sin stock", () => {
    expect(cartReducer(EMPTY_CART, { type: "add", line: line("A", 0) }).lines).toHaveLength(0);
  });
  it("cantidad 0 quita la línea", () => {
    const s = cartReducer(cartReducer(EMPTY_CART, { type: "add", line: line("A") }), { type: "setQuantity", sku: "A", quantity: 0 });
    expect(s.lines).toHaveLength(0);
  });
  it("calcula unidades y subtotal", () => {
    let s = cartReducer(EMPTY_CART, { type: "add", line: line("A", 5, 1000), quantity: 2 });
    s = cartReducer(s, { type: "add", line: line("B", 5, 500) });
    expect(cartItemCount(s)).toBe(3);
    expect(cartSubtotal(s)).toBe(2500);
  });
  it("descarta datos guardados corruptos", () => {
    expect(parseStoredCart("{no es json")).toEqual(EMPTY_CART);
    expect(parseStoredCart(JSON.stringify({ lines: [{ sku: 1 }] })).lines).toHaveLength(0);
  });
});

const items: BaseItem[] = [
  { id: "1", slug: "a", name: "Campera de jean", description: "Denim rígido", category: "camperas", price: 300, compareAtPrice: null, tags: [], createdAt: "2026-01-01", featured: false },
  { id: "2", slug: "b", name: "Remera básica", description: "Algodón peinado", category: "remeras", price: 100, compareAtPrice: null, tags: ["basico"], createdAt: "2026-03-01", featured: true },
  { id: "3", slug: "c", name: "Camisa Oxford", description: "Algodón", category: "camisas", price: 200, compareAtPrice: null, tags: [], createdAt: "2026-02-01", featured: false },
];

describe("catálogo", () => {
  it("ordena por precio y novedades", () => {
    expect(sortItems(items, "precio-asc").map((i) => i.id)).toEqual(["2", "3", "1"]);
    expect(sortItems(items, "novedades").map((i) => i.id)).toEqual(["2", "3", "1"]);
    expect(sortItems(items, "relevancia")[0]!.id).toBe("2");
  });
  it("busca sin importar tildes ni plural", () => {
    expect(searchItems(items, "algodon").map((i) => i.id)).toEqual(["2", "3"]);
    expect(searchItems(items, "camperas").map((i) => i.id)).toEqual(["1"]);
    expect(searchItems(items, "  ")).toHaveLength(3);
  });
});

describe("checkout", () => {
  const options: ShippingOption[] = [
    { id: "retiro", label: "Retiro", description: "x", price: 0, requiresAddress: false },
    { id: "envio", label: "Envío", description: "x", price: 5000, requiresAddress: true },
  ];
  const catalog: Record<string, SkuInfo> = {
    A: { sku: "A", itemId: "1", slug: "a", name: "Remera", variantLabel: "Negro, talle M", unitPrice: 20000, stock: 3 },
    B: { sku: "B", itemId: "2", slug: "b", name: "Jean", variantLabel: "Índigo, talle 40", unitPrice: 70000, stock: 0 },
  };
  const ctx: CheckoutContext = {
    resolveSku: (sku) => catalog[sku] ?? null,
    shippingOptions: options,
    freeShippingThreshold: 100000,
    now: () => new Date("2026-10-15T12:00:00Z"),
    makeId: () => "ABC234",
  };
  const customer = { fullName: "Ana Pérez", email: "ana@mail.com", phone: "11 5555 5555" };
  const address = { street: "Av. Siempreviva 742", city: "CABA", province: "CABA", postalCode: "1414" };

  it("recalcula precios desde el catálogo e ignora los del cliente", () => {
    const r = buildOrder({ customer, shippingOptionId: "envio", address, lines: [{ sku: "A", quantity: 2, unitPrice: 1 }] }, ctx);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order.subtotal).toBe(40000);
    expect(r.order.shipping.cost).toBe(5000);
    expect(r.order.total).toBe(45000);
    expect(r.order.id).toBe("ABC234");
  });
  it("rechaza si falta stock y dice qué hacer", () => {
    const r = buildOrder({ customer, shippingOptionId: "retiro", address: null, lines: [{ sku: "A", quantity: 4 }] }, ctx);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.formError).toContain("quedan 3");
    const r2 = buildOrder({ customer, shippingOptionId: "retiro", address: null, lines: [{ sku: "B", quantity: 1 }] }, ctx);
    expect(!r2.ok && r2.formError).toContain("se agotó");
  });
  it("pide dirección si el envío la requiere", () => {
    const r = buildOrder({ customer, shippingOptionId: "envio", address: null, lines: [{ sku: "A", quantity: 1 }] }, ctx);
    expect(!r.ok && r.fieldErrors["address.street"]).toBeTruthy();
  });
  it("devuelve errores por campo", () => {
    const r = buildOrder({ customer: { ...customer, email: "ana" }, shippingOptionId: "retiro", address: null, lines: [{ sku: "A", quantity: 1 }] }, ctx);
    expect(!r.ok && r.fieldErrors["customer.email"]).toMatch(/email/i);
  });
  it("aplica envío gratis desde el umbral, pero nunca a retiro con costo", () => {
    expect(shippingCost(options[1]!, 99999, 100000)).toBe(5000);
    expect(shippingCost(options[1]!, 100000, 100000)).toBe(0);
    expect(shippingCost(options[1]!, 100000, null)).toBe(5000);
  });
  it("genera IDs sin caracteres ambiguos", () => {
    const id = makeOrderId();
    expect(id).toMatch(/^[2-9A-HJ-NP-Z]{6}$/);
  });
});
