"use client";

import { useRef } from "react";
import { SIZE_GUIDES } from "@pw/ropa";

export function SizeGuideDialog({ chart, highlight }: { chart: keyof typeof SIZE_GUIDES; highlight: string | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  const guide = SIZE_GUIDES[chart];
  return (
    <>
      <button type="button" className="link-button" onClick={() => ref.current?.showModal()}>
        Guía de talles
      </button>
      <dialog
        ref={ref}
        className="modal"
        aria-labelledby="guia-titulo"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="modal__panel">
          <header className="modal__head">
            <h2 id="guia-titulo">Guía de talles</h2>
            <button type="button" className="icon-button" onClick={() => ref.current?.close()} aria-label="Cerrar la guía de talles">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
          <p className="muted">{guide.title}. Medidas de la prenda en centímetros.</p>
          <div className="table-scroll">
            <table className="size-table">
              <thead>
                <tr>
                  <th scope="col">Talle</th>
                  {guide.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.rows.map((r) => (
                  <tr key={r.size} className={r.size === highlight ? "is-current" : undefined}>
                    <th scope="row">{r.size}</th>
                    {r.values.map((v, i) => (
                      <td key={guide.columns[i]}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Cómo medirte</h3>
          <ul className="plain-list">
            {guide.howToMeasure.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
