import type { CategoryWithProducts } from "@/lib/validate";
import { CartButton } from "./cart/CartButton";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ name, categories }: { name: string; categories: CategoryWithProducts[] }) {
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a href="#" className={styles.brand}>
          {name}
        </a>
        <nav aria-label="Tipos de flores" className={styles.nav}>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>{c.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <CartButton />
      </div>
    </header>
  );
}
