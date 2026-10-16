"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  /** Link opcional junto al título ("Ver todo"). */
  action?: ReactNode;
  /** Un <li> por elemento. No hay tope: el carrusel crece con lo que se le pase. */
  children: ReactNode;
}

/**
 * Carrusel manual, sin autoplay: se mueve con los botones, con swipe o con el
 * scroll del trackpad. Usa scroll nativo con snap, así que funciona sin
 * JavaScript (solo los botones lo necesitan) y no hay que medir anchos a mano.
 */
export function Slider({ id, title, action, children }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 1);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  function page(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  }

  const fits = atStart && atEnd;

  return (
    <section className="container section slider" aria-labelledby={id}>
      <div className="section__head">
        <h2 id={id} className="section__title">
          {title}
        </h2>
        <div className="slider__tools">
          {action}
          {fits ? null : (
            <div className="slider__buttons">
              <button type="button" className="slider__button" onClick={() => page(-1)} disabled={atStart} aria-controls={`${id}-track`} aria-label="Ver anteriores">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" className="slider__button" onClick={() => page(1)} disabled={atEnd} aria-controls={`${id}-track`} aria-label="Ver siguientes">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <ul ref={trackRef} id={`${id}-track`} className="slider__track" aria-labelledby={id}>
        {children}
      </ul>
    </section>
  );
}
