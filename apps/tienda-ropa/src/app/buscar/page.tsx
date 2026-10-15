import { redirect } from "next/navigation";
import { categoryForQuery } from "@pw/ropa";
import { site } from "@/lib/content";

/**
 * La búsqueda no tiene página propia: si el texto es una categoría ("camperas")
 * lleva a la categoría, donde están los filtros de talle; si no, al catálogo
 * filtrado por texto. Así la búsqueda y la navegación muestran lo mismo.
 */
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const raw = params.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  if (!q) redirect("/tienda");
  const category = categoryForQuery(q, site.categories);
  if (category) redirect(`/tienda/${category}`);
  redirect(`/tienda?q=${encodeURIComponent(q)}`);
}
