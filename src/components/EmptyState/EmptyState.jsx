import styles from './EmptyState.module.css';

/**
 * Shown in place of the table when no rows match.
 * @param {() => void} onClear  resets search, filters and sort
 */
export default function EmptyState({ onClear }) {
  return (
    <div className={styles.empty} role="status">
      <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M30 30l9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className={styles.title}>No transactions match your search.</p>
      <p className={styles.body}>Clear filters to see all orders.</p>
      <button type="button" className={styles.button} onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
