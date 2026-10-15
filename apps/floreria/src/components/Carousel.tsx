"use client";

import { Children, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Carousel.module.css";

type Props = {
  /** Nombre accesible del carrusel (ej: "Rosas"). */
  label: string;
  /**
   * hero: un slide a la vez, con puntos, loop y autoplay opcional.
   * mini: varios slides visibles, flechas, sin autoplay.
   */
  variant: "hero" | "mini";
  /** Solo hero. Milisegundos entre slides; se pausa con hover, foco o reduced motion. */
  autoplayMs?: number;
  children: ReactNode;
};

/**
 * Carrusel sin dependencias, basado en scroll-snap nativo: el desplazamiento
 * con dedo, trackpad y teclado lo resuelve el navegador, y el JS solo agrega
 * flechas, puntos y autoplay. Sin JS sigue funcionando como fila deslizable.
 */
export function Carousel({ label, variant, autoplayMs, children }: Props) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: count <= 1 });
  const [playing, setPlaying] = useState(Boolean(autoplayMs));
  const [paused, setPaused] = useState(false); // pausa temporal por hover o foco
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      const slide = track?.children[i] as HTMLElement | undefined;
      if (!track || !slide) return;
      track.scrollTo({ left: slide.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      if (variant === "hero") {
        goTo((index + dir + count) % count);
      } else {
        track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reducedMotion ? "auto" : "smooth" });
      }
    },
    [variant, index, count, goTo, reducedMotion],
  );

  // Sincroniza índice activo y bordes con la posición real del scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const first = track.children[0] as HTMLElement | undefined;
      const width = first?.offsetWidth ?? track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setIndex(Math.min(count - 1, Math.round(track.scrollLeft / (width + gap))));
      setEdges({
        start: track.scrollLeft <= 2,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 2,
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count]);

  // Autoplay: solo hero, solo si está en reproducción, sin hover/foco y con la pestaña visible.
  useEffect(() => {
    if (variant !== "hero" || !autoplayMs || !playing || paused || count < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") goTo((index + 1) % count);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [variant, autoplayMs, playing, paused, index, count, goTo]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const isHero = variant === "hero";

  return (
    <section
      className={`${styles.root} ${isHero ? styles.hero : styles.mini}`}
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <ul ref={trackRef} className={styles.track} aria-live={isHero && playing ? "off" : "polite"}>
        {slides.map((slide, i) => (
          <li
            key={i}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
          >
            {slide}
          </li>
        ))}
      </ul>

      {count > 1 && (
        <div className={styles.controls}>
          {isHero && autoplayMs && (
            <button
              type="button"
              className={styles.control}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar presentación" : "Reproducir presentación"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.filled}>
                {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5l11 7-11 7z" />}
              </svg>
            </button>
          )}
          <button
            type="button"
            className={styles.control}
            onClick={() => step(-1)}
            disabled={!isHero && edges.start}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={() => step(1)}
            disabled={!isHero && edges.end}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isHero && (
            <div className={styles.dots}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.dot}
                  aria-label={`Ir al slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
