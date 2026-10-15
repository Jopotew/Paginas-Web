import type { Store } from "@/lib/schema";
import { whatsappUrl } from "@/lib/whatsapp";
import styles from "./VisitUs.module.css";

export function VisitUs({ store }: { store: Store }) {
  return (
    <footer id="local" className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.title}>Visitanos</h2>
          <p className={styles.address}>
            {store.mapsUrl ? (
              <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer">
                {store.address}
              </a>
            ) : (
              store.address
            )}
          </p>
        </div>

        <dl className={styles.hours}>
          {store.hours.map((h) => (
            <div key={h.days}>
              <dt>{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>

        <ul className={styles.links}>
          <li>
            <a href={whatsappUrl(store.whatsapp, "Hola, quería hacer una consulta.")} target="_blank" rel="noopener noreferrer">
              Escribinos por WhatsApp
            </a>
          </li>
          {store.instagram && (
            <li>
              <a href={`https://instagram.com/${store.instagram}`} target="_blank" rel="noopener noreferrer">
                Instagram @{store.instagram}
              </a>
            </li>
          )}
        </ul>
      </div>
      <p className={styles.legal}>
        © {new Date().getFullYear()} {store.name}. Los precios pueden cambiar según la disponibilidad de cada día.
      </p>
    </footer>
  );
}
