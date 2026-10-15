import type { CategoryWithProducts } from "@/lib/validate";
import { Carousel } from "./Carousel";
import { ProductCard } from "./ProductCard";
import styles from "./CategorySection.module.css";

export function CategorySection({ category }: { category: CategoryWithProducts }) {
  const n = category.products.length;
  return (
    <section id={category.id} className={styles.section} aria-labelledby={`${category.id}-title`}>
      <div className={styles.intro}>
        <h2 id={`${category.id}-title`} className={styles.name}>
          {category.name}
        </h2>
        <p className={styles.description}>{category.description}</p>
        <p className={styles.count}>
          {n} {n === 1 ? "opción" : "opciones"}
        </p>
      </div>
      <div className={styles.slides}>
        <Carousel variant="mini" label={category.name}>
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
