import styles from "./HowToOrder.module.css";

const steps = [
  { title: "Elegí tus flores", text: "Agregá al pedido lo que te guste. Podés combinar varios productos." },
  { title: "Completá los datos", text: "Tu nombre, si lo retirás o lo enviamos, el día y el mensaje para la tarjeta." },
  { title: "Confirmalo por WhatsApp", text: "Te respondemos con disponibilidad, costo de envío y forma de pago." },
];

export function HowToOrder() {
  return (
    <section id="como-pedir" className={styles.section} aria-labelledby="como-pedir-title">
      <h2 id="como-pedir-title" className={styles.title}>
        Cómo pedir
      </h2>
      <ol className={styles.steps}>
        {steps.map((s) => (
          <li key={s.title} className={styles.step}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
