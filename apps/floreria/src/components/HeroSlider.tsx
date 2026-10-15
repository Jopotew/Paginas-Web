import Image from "next/image";
import type { HeroSlide } from "@/lib/schema";
import { Carousel } from "./Carousel";
import styles from "./HeroSlider.module.css";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  return (
    <div className={styles.wrap}>
      <Carousel variant="hero" label="Presentación de la florería" autoplayMs={6000}>
        {slides.map((s, i) => (
          <article key={s.id} className={styles.slide}>
            <Image
              src={s.image.src}
              alt={s.image.alt}
              width={s.image.width}
              height={s.image.height}
              sizes="100vw"
              // Solo la primera imagen bloquea el render inicial; el resto llega después.
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              className={styles.image}
            />
            <div className={styles.caption}>
              {i === 0 ? <h1 className={styles.title}>{s.title}</h1> : <h2 className={styles.title}>{s.title}</h2>}
              {s.text && <p className={styles.text}>{s.text}</p>}
              {s.cta && (
                <a href={s.cta.href} className={styles.cta}>
                  {s.cta.label}
                </a>
              )}
            </div>
          </article>
        ))}
      </Carousel>
    </div>
  );
}
