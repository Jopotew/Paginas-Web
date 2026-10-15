import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container narrow-page empty">
      <h1 className="page-title">Esta página no existe</h1>
      <p>Puede que el producto se haya dado de baja o que el link tenga un error.</p>
      <div className="empty__actions">
        <Link href="/tienda" className="button button--primary">
          Ver la colección
        </Link>
        <Link href="/" className="button button--ghost">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
