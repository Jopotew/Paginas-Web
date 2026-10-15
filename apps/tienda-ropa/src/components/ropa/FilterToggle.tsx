"use client";

import { useState, type ReactNode } from "react";

/** En mobile los filtros se despliegan con un botón; en escritorio el CSS los deja siempre visibles. */
export function FilterToggle({ activeCount, children }: { activeCount: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-toggle" data-open={open}>
      <button type="button" className="button button--secondary filter-toggle__button" aria-expanded={open} aria-controls="panel-filtros" onClick={() => setOpen((o) => !o)}>
        {open ? "Ocultar filtros" : "Filtrar"}
        {activeCount > 0 ? <span className="badge">{activeCount}</span> : null}
      </button>
      <div id="panel-filtros" className="filter-toggle__panel">
        {children}
      </div>
    </div>
  );
}
