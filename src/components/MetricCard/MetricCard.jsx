import styles from './MetricCard.module.css';

/**
 * One KPI tile. Purely presentational: it formats nothing and computes nothing.
 * @param {string} label  card heading, e.g. "Net revenue"
 * @param {string} value  already formatted value, e.g. "₹ 1,10,680"
 * @param {string} [note] short line explaining what the figure covers
 */
export default function MetricCard({ label, value, note }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.label}>{label}</h2>
      <p className={styles.value}>{value}</p>
      {note && <p className={styles.note}>{note}</p>}
    </article>
  );
}
